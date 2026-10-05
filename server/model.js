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
  return JSON.parse(text.slice(start, end + 1));
}

export async function proposeRecipe(pantryIds, env = process.env) {
  const key = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!key) throw new ModelNotConfigured();

  const model = env.GEMINI_MODEL || "gemini-3.5-flash";
  const pantry = pantryIds.map((id) => `${id} (${names.get(id) || id.replace(/-/g, " ")})`).join(", ");
  const instructions =
    'You propose 10 different widely known home dishes as JSON only: {"recipes":[...]}. People should already know each one by name, the way they know syrnyky, pancakes, an omelette, or mashed potatoes. Do not invent dish names. If the pantry contains cottage cheese, egg, flour, and sugar, include Syrnyky (сирники) as one of the ten. Use as many pantry ingredients as you can, and copy those pantry ids exactly. Missing real groceries are allowed as new lowercase hyphen ids, such as banana or sour-cream. Do not invent brands or fantasy foods. Each recipe has keys title, ingredientIds, steps, minutes, servings, blurb. title is the common name. Salt and pepper are assumed and must not be listed. steps is exactly 3 short strings, and each step includes a time or temperature. Do not include an id or an image.';

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
            parts: [{ text: `Pantry: ${pantry}.` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
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
