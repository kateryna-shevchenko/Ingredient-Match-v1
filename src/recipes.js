export const recipes = [
  {
    id: "lemon-rice",
    title: "Lemon Herb Rice Bowl",
    minutes: 20,
    servings: 2,
    ingredientIds: ["rice", "lemon", "olive-oil", "spinach", "garlic"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    blurb: "Bright rice with wilted greens. Salt and pepper are already assumed.",
    steps: [
      "Rinse 200 g rice until the water runs clear. Boil it in salted water for 12 minutes, then drain and rest 3 minutes.",
      "Warm 1 tablespoon olive oil in a pan over medium heat. Cook the garlic for 45 seconds, until it smells sweet, not brown.",
      "Add the spinach and cook 2 minutes, until just wilted.",
      "Fold the rice into the greens. Take the pan off the heat and stir in the lemon zest and juice. Rest 1 minute, then serve.",
    ],
  },
  {
    id: "garlic-spinach",
    title: "Garlic Spinach",
    minutes: 8,
    servings: 2,
    ingredientIds: ["spinach", "garlic", "olive-oil"],
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    blurb: "A fast side. The timing is the whole recipe.",
    steps: [
      "Heat 1 tablespoon olive oil in a wide pan over medium heat for 1 minute.",
      "Add sliced garlic and cook 45 seconds, stirring, until fragrant.",
      "Add the spinach in handfuls. Cook 2 minutes, turning, until every leaf has collapsed and looks glossy.",
      "Take it off the heat. Salt and pepper are enough. Serve at once.",
    ],
  },
  {
    id: "market-tray",
    title: "Market Rice Tray",
    minutes: 40,
    servings: 3,
    ingredientIds: [
      "rice",
      "lemon",
      "olive-oil",
      "spinach",
      "garlic",
      "tomato",
      "onion",
      "chickpea",
      "carrot",
      "basil",
    ],
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80",
    blurb: "One tray beside a pot of rice. Whatever is missing can go in the basket.",
    steps: [
      "Heat the oven to 200°C. Slice the carrot and onion.",
      "Toss carrot, onion, and chickpeas with 1 tablespoon olive oil and the garlic. Roast 25 minutes.",
      "Add the chopped tomato and roast 8 minutes more, until the tomato slumps.",
      "Meanwhile boil the rice in salted water for 12 minutes. Drain.",
      "Wilt the spinach in a spoon of olive oil for 2 minutes. Fold it into the rice with the lemon juice.",
      "Spoon the tray over the rice and tear the basil on top. Do not cook the basil.",
    ],
  },
  {
    id: "tomato-basil",
    title: "Tomato Basil Skillet",
    minutes: 18,
    servings: 2,
    ingredientIds: ["tomato", "basil", "olive-oil", "garlic", "onion"],
    image:
      "https://images.unsplash.com/photo-1473093296543-ed59528be60f?auto=format&fit=crop&w=900&q=80",
    blurb: "A jammy skillet. Serve it on the lemon rice when you have both.",
    steps: [
      "Warm 1 tablespoon olive oil over medium heat. Cook the onion 5 minutes, until soft and translucent.",
      "Add the garlic and cook 45 seconds.",
      "Add the chopped tomato. Simmer 10 minutes, stirring, until it looks like jam and the liquid has thickened.",
      "Take the pan off the heat. Tear in the basil and wait 1 minute before serving.",
    ],
  },
  {
    id: "chickpea-spaghetti",
    title: "Spaghetti with Chickpea and Tomato Sauce",
    minutes: 25,
    servings: 4,
    ingredientIds: ["spaghetti", "tomato", "chickpea", "olive-oil", "basil", "garlic"],
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
    blurb: "Pantry pasta. The sauce and the pasta finish in the same minute.",
    steps: [
      "Boil the spaghetti in well-salted water for 9 minutes, until al dente. Save a cup of the water, then drain.",
      "While it boils, warm 1 tablespoon olive oil and cook the garlic 45 seconds.",
      "Add chopped tomato and chickpeas. Simmer 10 minutes, until the tomato breaks down.",
      "Toss the pasta with the sauce for 1 minute, adding a splash of pasta water if it looks dry. Tear in the basil off the heat.",
    ],
  },
];

const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));

export function recipeById(id) {
  return byId.get(id) ?? null;
}
