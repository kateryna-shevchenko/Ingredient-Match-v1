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
  мука: "flour",
  олія: "olive-oil",
  "оливкова олія": "olive-oil",
  шпинат: "spinach",
  базилік: "basil",
  морква: "carrot",
  нут: "chickpea",
  спагеті: "spaghetti",
  авокадо: "avocado",
  чилі: "chili",
  ryż: "rice",
  ryz: "rice",
  cytryna: "lemon",
  oliwa: "olive-oil",
  szpinak: "spinach",
  czosnek: "garlic",
  pomidor: "tomato",
  bazylia: "basil",
  cebula: "onion",
  ciecierzyca: "chickpea",
  marchew: "carrot",
  awokado: "avocado",
  jajko: "egg",
  jajka: "egg",
  twaróg: "cottage-cheese",
  twarog: "cottage-cheese",
  mąka: "flour",
  maka: "flour",
  cukier: "sugar",
  masło: "butter",
  maslo: "butter",
  mleko: "milk",
  ziemniak: "potato",
  ziemniaki: "potato",
  kurczak: "chicken",
};

const byId = new Map(ingredients.map((item) => [item.id, item]));

export function ingredientName(id) {
  return byId.get(id)?.name ?? String(id).replace(/-/g, " ");
}

function freeId(text) {
  return text
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function resolveIngredient(raw) {
  const text = String(raw ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!text || text.length > 40) return { status: "empty" };
  if (text === "salt" || text === "pepper" || text === "salt and pepper" || text === "сіль" || text === "перець") {
    return { status: "assumed" };
  }
  const key = text.replace(/\s+/g, "-");
  const alias = aliases[text] || aliases[key];
  if (alias && byId.has(alias)) return { status: "ok", id: alias };
  if (byId.has(key)) return { status: "ok", id: key };
  const hit =
    ingredients.find((item) => item.name === text) ||
    ingredients.find((item) => item.name.startsWith(text) && text.length >= 3) ||
    ingredients.find((item) => text.length >= 3 && item.name.includes(text));
  if (hit) return { status: "ok", id: hit.id };
  const id = freeId(text);
  if (!id || id === "salt" || id === "pepper") return { status: "empty" };
  return { status: "ok", id };
}

export function toIngredientId(raw) {
  const resolved = resolveIngredient(raw);
  return resolved.status === "ok" ? resolved.id : "";
}
