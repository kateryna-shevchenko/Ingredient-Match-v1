import { ingredients } from "./catalog.js";
import { scoreRecipe } from "./match.js";

const catalogIds = new Set(ingredients.map((item) => item.id));
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80";

function stableId(title, ingredientIds) {
  const text = `${title.toLowerCase()}|${[...ingredientIds].sort().join(",")}`;
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `${slug || "recipe"}-${(hash >>> 0).toString(36)}`;
}

export function acceptProposal(pantryIds, proposal) {
  if (!proposal || typeof proposal !== "object") {
    return { ok: false, reason: "shape" };
  }
  const title = String(proposal.title || "").trim().slice(0, 80);
  const steps = Array.isArray(proposal.steps)
    ? proposal.steps.map((step) => String(step).trim()).filter(Boolean).slice(0, 8)
    : [];
  const ingredientIds = [];
  for (const id of Array.isArray(proposal.ingredientIds) ? proposal.ingredientIds : []) {
    if (id === "salt" || id === "pepper") continue;
    if (!catalogIds.has(id) || ingredientIds.includes(id)) continue;
    ingredientIds.push(id);
  }
  const minutes = Number(proposal.minutes);
  const servings = Number(proposal.servings);
  if (!title || ingredientIds.length === 0 || steps.length < 3) {
    return { ok: false, reason: "shape" };
  }
  if (!steps.some((step) => /\d/.test(step))) {
    return { ok: false, reason: "steps" };
  }
  if (!Number.isFinite(minutes) || minutes < 1 || !Number.isFinite(servings) || servings < 1) {
    return { ok: false, reason: "shape" };
  }

  const recipe = {
    id: stableId(title, ingredientIds),
    title,
    minutes: Math.round(minutes),
    servings: Math.round(servings),
    ingredientIds,
    steps,
    blurb: String(proposal.blurb || "Suggested for this kitchen.").trim().slice(0, 180),
    image: FALLBACK_IMAGE,
  };
  const match = scoreRecipe(pantryIds, recipe);
  return { ok: true, recipe, match };
}
