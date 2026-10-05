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
    signal: AbortSignal.timeout(25000),
  });
}

function instructionsFor() {
  return 'You propose 10 different widely known home dishes as JSON only: {"recipes":[...]}. People should already know each one by name, the way they know syrnyky, pancakes, an omelette, or mashed potatoes. Do not invent dish names. If the pantry contains cottage cheese, egg, flour, and sugar, include Syrnyky (сирники) as one of the ten. Use as many pantry ingredients as you can, and copy those pantry ids exactly. Missing real groceries are allowed as new lowercase hyphen ids, such as banana or sour-cream. Do not invent brands or fantasy foods. Each recipe has keys title, ingredientIds, steps, minutes, servings, blurb. title is the common name. Salt and pepper are assumed and must not be listed. steps is exactly 3 short strings, and each step includes a time or temperature. Do not include an id or an image.';
}

const SPARE_MODELS = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];

function modelsToTry(preferred) {
  return [...new Set([preferred, ...SPARE_MODELS].filter(Boolean))];
}

function configFor(model) {
  return {
    temperature: 0.7,
    responseMimeType: "application/json",
    maxOutputTokens: 8192,
    thinkingConfig: String(model).startsWith("gemini-2.") ? { thinkingBudget: 0 } : { thinkingLevel: "minimal" },
  };
}

function busy(status, detail) {
  return status === 503 || status === 429 || /high demand|try again later|unavailable|overloaded|quota|rate limit/i.test(detail);
}

export async function proposeRecipe(pantryIds, env = process.env) {
  const key = env.GEMINI_API_KEY || env.GOOGLE_API_KEY;
  if (!key) throw new ModelNotConfigured();

  const pantry = pantryIds.map((id) => `${id} (${names.get(id) || String(id).replace(/-/g, " ")})`).join(", ");
  let lastDetail = "Every Gemini model is busy right now. Wait a minute and try again.";

  for (const model of modelsToTry(env.GEMINI_MODEL || "gemini-3.5-flash")) {
    const generationConfig = configFor(model);
    let response;
    try {
      response = await generate(model, key, generationConfig, pantry);
    } catch {
      lastDetail = "Every Gemini model is busy right now. Wait a minute and try again.";
      continue;
    }
    let detail = response.ok ? "" : await response.text();
    if (!response.ok && response.status === 400) {
      delete generationConfig.thinkingConfig;
      generationConfig.maxOutputTokens = 4096;
      try {
        response = await generate(model, key, generationConfig, pantry);
        detail = response.ok ? "" : await response.text();
      } catch {
        lastDetail = "Every Gemini model is busy right now. Wait a minute and try again.";
        continue;
      }
    }
    if (!response.ok) {
      lastDetail = geminiDetail(response.status, detail);
      if (busy(response.status, detail) || response.status === 404) continue;
      const error = new Error("model-failed");
      error.detail = lastDetail;
      throw error;
    }

    const payload = await response.json();
    const parts = payload?.candidates?.[0]?.content?.parts ?? [];
    const visible = parts.filter((part) => part.text && !part.thought).map((part) => part.text).join("");
    const text = visible || parts.map((part) => part.text || "").join("");
    if (!text) {
      lastDetail = "The model stopped before writing recipes.";
      continue;
    }
    try {
      return extractJson(text);
    } catch {
      lastDetail = "The model answer was not a recipe list.";
    }
  }

  const error = new Error("model-failed");
  error.detail = lastDetail;
  throw error;
}

function geminiDetail(status, body) {
  let message = body;
  try {
    const parsed = JSON.parse(body);
    message = parsed?.error?.message || parsed?.error?.status || body;
  } catch {
    message = body;
  }
  const text = String(message).replace(/\s+/g, " ").slice(0, 160);
  if (status === 503 || /high demand|try again later|unavailable|overloaded/i.test(text)) {
    return "Every Gemini model is busy right now. Wait a minute and try again.";
  }
  if (status === 429 || /quota|rate limit|resource_exhausted/i.test(text)) {
    return "Gemini's free limit is used up for now. Wait a minute and try again.";
  }
  if (status === 404) return "The model name on the server was not found. Check GEMINI_MODEL.";
  return text || `Gemini returned ${status}.`;
}
