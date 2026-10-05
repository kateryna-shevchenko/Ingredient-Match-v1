import { ingredients } from "../src/catalog.js";

const names = new Map(ingredients.map((item) => [item.id, item.name]));

export class ModelNotConfigured extends Error {
  constructor() {
    super("not-configured");
    this.code = "not-configured";
  }
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("model-shape");
  return JSON.parse(text.slice(start, end + 1));
}

export async function proposeRecipe(pantryIds, env = process.env) {
  const key = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!key) throw new ModelNotConfigured();

  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const pantry = pantryIds.map((id) => names.get(id) || id).join(", ");
  const catalog = ingredients.map((item) => `${item.id} (${item.name})`).join(", ");
  const instructions =
    "You propose one widely known home dish as JSON only. People should already know it by name, the way they know syrnyky, an omelette, or mashed potatoes. Do not invent a new dish. If the pantry contains cottage cheese, egg, flour, and sugar, propose Syrnyky (сирники). Otherwise pick another familiar dish that uses as many pantry ingredients as possible. Missing ingredients are allowed. Keys: title, ingredientIds, steps, minutes, servings, blurb. title is the common name. ingredientIds are catalog ids only. Salt and pepper are assumed and must not be listed. steps is 3 to 6 strings, and each step includes a time or temperature. Do not include an id or an image.";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents: [
          {
            role: "user",
            parts: [{ text: `Catalog: ${catalog}. Pantry: ${pantry}.` }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) throw new Error("model-failed");
  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("") ?? "";
  if (!text) throw new Error("model-shape");
  return extractJson(text);
}
