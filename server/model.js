import { ingredients } from "../src/catalog.js";

const names = new Map(ingredients.map((item) => [item.id, item.name]));

export class ModelNotConfigured extends Error {
  constructor() {
    super("not-configured");
    this.code = "not-configured";
  }
}

function extractJson(text) {
  const start = text.search(/[\[{]/);
  const end = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
  if (start === -1 || end <= start) throw new Error("model-shape");
  const slice = text.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    const recipes = [];
    const pattern = /\{[^{}]*"title"[^{}]*\}/g;
    for (const piece of slice.match(pattern) || []) {
      try {
        recipes.push(JSON.parse(piece));
      } catch {
        // A cut-off recipe is skipped; complete ones still count.
      }
    }
    if (!recipes.length) throw new Error("model-shape");
    return { recipes };
  }
}

async function generate(model, key, generationConfig, pantry) {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instructionsFor() }] },
      contents: [{ role: "user", parts: [{ text: `Pantry: ${pantry}.` }] }],
      generationConfig,
    }),
  });
}

function instructionsFor() {
  return 'You propose 10 different widely known home dishes as JSON only: {"recipes":[...]}. People should already know each one by name, the way they know syrnyky, pancakes, an omelette, or mashed potatoes. Do not invent dish names. If the pantry contains cottage cheese, egg, flour, and sugar, include Syrnyky (сирники) as one of the ten. Use as many pantry ingredients as you can, and copy those pantry ids exactly. Missing real groceries are allowed as new lowercase hyphen ids, such as banana or sour-cream. Do not invent brands or fantasy foods. Each recipe has keys title, ingredientIds, steps, minutes, servings, blurb. title is the common name. Salt and pepper are assumed and must not be listed. steps is exactly 3 short strings, and each step includes a time or temperature. Do not include an id or an image.';
}

export async function proposeRecipe(pantryIds, env = process.env) {
  const key = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!key) throw new ModelNotConfigured();

  const model = env.GEMINI_MODEL || "gemini-3.5-flash";
  const pantry = pantryIds.map((id) => `${id} (${names.get(id) || String(id).replace(/-/g, " ")})`).join(", ");
  const generationConfig = {
    temperature: 0.7,
    responseMimeType: "application/json",
    maxOutputTokens: 16384,
    thinkingConfig: model.startsWith("gemini-2.") ? { thinkingBudget: 0 } : { thinkingLevel: "minimal" },
  };

  let response = await generate(model, key, generationConfig, pantry);
  if (!response.ok) {
    const detail = await response.text();
    if (response.status === 400 && /thinking/i.test(detail)) {
      delete generationConfig.thinkingConfig;
      response = await generate(model, key, generationConfig, pantry);
    } else {
      console.error("gemini", response.status, detail.slice(0, 240));
      throw new Error("model-failed");
    }
  }
  if (!response.ok) {
    console.error("gemini", response.status, (await response.text()).slice(0, 240));
    throw new Error("model-failed");
  }

  const payload = await response.json();
  const parts = payload?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text)
    .join("");
  if (!text) throw new Error("model-shape");
  return extractJson(text);
}
