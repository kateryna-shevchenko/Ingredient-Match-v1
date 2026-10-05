import { toIngredientId } from "./catalog.js";
import { scoreRecipe } from "./match.js";
const FOOD_PHOTOS = {
  "cottage-cheese": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  chicken: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=900&q=80",
  spaghetti: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  potato: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80",
  avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=80",
  tomato: "https://images.unsplash.com/photo-1546470427-227c7369a8d4?auto=format&fit=crop&w=900&q=80",
  spinach: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80",
  rice: "https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&w=900&q=80",
  egg: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=900&q=80",
  lemon: "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=900&q=80",
  carrot: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=900&q=80",
  chickpea: "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=900&q=80",
  basil: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=900&q=80",
  chili: "https://images.unsplash.com/photo-1588252303782-cb80119abd51?auto=format&fit=crop&w=900&q=80",
  onion: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=900&q=80",
  garlic: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=900&q=80",
  butter: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",
  milk: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
  flour: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80",
  sugar: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=80",
  "olive-oil": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
};
const PHOTO_PRIORITY = Object.keys(FOOD_PHOTOS);

function pictureFor(title, ingredientIds) {
  let hash = 2166136261;
  for (const char of title.toLowerCase()) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const options = PHOTO_PRIORITY.filter((id) => ingredientIds.includes(id));
  if (!options.length) {
    const spare = [
      FOOD_PHOTOS.egg,
      FOOD_PHOTOS.potato,
      FOOD_PHOTOS.tomato,
      FOOD_PHOTOS.avocado,
      FOOD_PHOTOS.chicken,
    ];
    return spare[(hash >>> 0) % spare.length];
  }
  return FOOD_PHOTOS[options[(hash >>> 0) % options.length]];
}

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
  for (const raw of Array.isArray(proposal.ingredientIds) ? proposal.ingredientIds : []) {
    const id = toIngredientId(raw);
    if (!id || ingredientIds.includes(id)) continue;
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
    image: pictureFor(title, ingredientIds),
  };
  const match = scoreRecipe(pantryIds, recipe);
  return { ok: true, recipe, match };
}
