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
  const key = env.MODEL_API_KEY || env.OPENAI_API_KEY;
  if (!key) throw new ModelNotConfigured();

  const base = (env.MODEL_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = env.MODEL_NAME || "gpt-4o-mini";
  const pantry = pantryIds.map((id) => names.get(id) || id).join(", ");
  const catalog = ingredients.map((item) => `${item.id} (${item.name})`).join(", ");

  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You propose one widely known home dish as JSON only. People should already know it by name, the way they know syrnyky, an omelette, or mashed potatoes. Do not invent a new dish. If the pantry contains cottage cheese, egg, flour, and sugar, propose Syrnyky (сирники). Otherwise pick another familiar dish that uses as many pantry ingredients as possible. Missing ingredients are allowed. Keys: title, ingredientIds, steps, minutes, servings, blurb. title is the common name. ingredientIds are catalog ids only. Salt and pepper are assumed and must not be listed. steps is 3 to 6 strings, and each step includes a time or temperature. Do not include an id or an image.",
        },
        {
          role: "user",
          content: `Catalog: ${catalog}. Pantry: ${pantry}.`,
        },
      ],
    }),
  });

  if (!response.ok) throw new Error("model-failed");
  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== "string") throw new Error("model-shape");
  return extractJson(text);
}
