const KEY = "ingredient-match";
const SEED = ["rice", "lemon", "olive-oil", "spinach", "garlic"];

function recipesOf(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (recipe) =>
      recipe &&
      typeof recipe.id === "string" &&
      typeof recipe.title === "string" &&
      Array.isArray(recipe.ingredientIds) &&
      Array.isArray(recipe.steps),
  );
}

function empty() {
  return { pantry: [], library: [], basket: [], proposals: [] };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { pantry: [...SEED], library: [], basket: [], proposals: [] };
    const data = JSON.parse(raw);
    return {
      pantry: Array.isArray(data.pantry) ? data.pantry : [...SEED],
      library: Array.isArray(data.library) ? data.library : [],
      basket: Array.isArray(data.basket) ? data.basket : [],
      proposals: recipesOf(data.proposals),
    };
  } catch {
    return empty();
  }
}

export function saveState(state) {
  localStorage.setItem(
    KEY,
    JSON.stringify({
      pantry: state.pantry,
      library: state.library,
      basket: state.basket,
      proposals: state.proposals,
    }),
  );
}
