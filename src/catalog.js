export const ingredients = [
  { id: "rice", name: "rice" },
  { id: "lemon", name: "lemon" },
  { id: "olive-oil", name: "olive oil" },
  { id: "spinach", name: "spinach" },
  { id: "garlic", name: "garlic" },
  { id: "tomato", name: "tomato" },
  { id: "basil", name: "basil" },
  { id: "onion", name: "onion" },
  { id: "chickpea", name: "chickpea" },
  { id: "carrot", name: "carrot" },
  { id: "spaghetti", name: "spaghetti" },
  { id: "avocado", name: "avocado" },
  { id: "egg", name: "egg" },
  { id: "chili", name: "chili" },
  { id: "cottage-cheese", name: "cottage cheese" },
  { id: "flour", name: "flour" },
  { id: "sugar", name: "sugar" },
  { id: "butter", name: "butter" },
  { id: "milk", name: "milk" },
  { id: "potato", name: "potato" },
  { id: "chicken", name: "chicken" },
];

const aliases = {
  eggs: "egg",
  lemons: "lemon",
  tomatoes: "tomato",
  carrots: "carrot",
  chickpeas: "chickpea",
  onions: "onion",
  oliveoil: "olive-oil",
  tvorog: "cottage-cheese",
  творог: "cottage-cheese",
  сир: "cottage-cheese",
  борошно: "flour",
  цукор: "sugar",
  масло: "butter",
  молоко: "milk",
  картопля: "potato",
  potatoes: "potato",
  курка: "chicken",
  яйце: "egg",
  яйця: "egg",
  рис: "rice",
  лимон: "lemon",
  часник: "garlic",
  помідор: "tomato",
  цибуля: "onion",
};

const byId = new Map(ingredients.map((item) => [item.id, item]));

export function ingredientName(id) {
  return byId.get(id)?.name ?? id;
}

export function resolveIngredient(raw) {
  const text = raw.trim().toLowerCase().replace(/\s+/g, " ");
  if (!text) return { status: "empty" };
  if (text === "salt" || text === "pepper" || text === "salt and pepper") {
    return { status: "assumed" };
  }
  const key = text.replace(/\s+/g, "-");
  const alias = aliases[text] || aliases[key];
  if (alias && byId.has(alias)) return { status: "ok", id: alias };
  if (byId.has(key)) return { status: "ok", id: key };
  const hit =
    ingredients.find((item) => item.name === text) ||
    ingredients.find((item) => item.name.startsWith(text)) ||
    ingredients.find((item) => item.name.includes(text));
  if (hit) return { status: "ok", id: hit.id };
  return { status: "unknown" };
}
