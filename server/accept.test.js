import assert from "node:assert/strict";
import { test } from "vitest";
import { acceptProposal } from "../src/accept.js";
import { resolveIngredient } from "../src/catalog.js";
import { suggestForPantry } from "./suggest.js";

const pantry = ["rice", "lemon", "olive-oil", "spinach", "garlic"];

test("a full match is stored with a stable id", () => {
  const proposal = {
    title: "Lemon Garlic Rice",
    ingredientIds: ["rice", "garlic", "lemon", "olive-oil", "salt"],
    steps: [
      "Boil the rice for 12 minutes.",
      "Cook the garlic in olive oil for 45 seconds.",
      "Stir in the lemon and rest for 1 minute.",
    ],
    minutes: 15,
    servings: 2,
  };
  const first = acceptProposal(pantry, proposal);
  const second = acceptProposal(pantry, proposal);
  assert.equal(first.ok, true);
  assert.equal(first.recipe.id, second.recipe.id);
  assert.equal(first.recipe.ingredientIds.includes("salt"), false);
  assert.equal(first.match.coverage, 1);
});

test("a partial match is still a recipe, with the gap listed", () => {
  const result = acceptProposal(pantry, {
    title: "Tomato Pasta",
    ingredientIds: ["spaghetti", "tomato", "basil", "garlic"],
    steps: ["Boil pasta 9 minutes.", "Simmer tomato 10 minutes.", "Basil off the heat 1 minute."],
    minutes: 20,
    servings: 2,
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.match.missingIds, ["spaghetti", "tomato", "basil"]);
});

test("the server keeps a broken proposal off the response", async () => {
  const result = await suggestForPantry(pantry, {}, async () => ({
    recipes: [
      {
        title: "",
        ingredientIds: ["rice"],
        steps: [],
        minutes: 20,
        servings: 2,
      },
    ],
  }));
  assert.equal(result.status, 422);
  assert.equal(result.body.recipes, undefined);
});

test("the server returns every recipe the gate accepts", async () => {
  const result = await suggestForPantry(pantry, {}, async () => ({
    recipes: [
      {
        title: "Garlic Rice",
        ingredientIds: ["rice", "garlic", "olive-oil", "papaya"],
        steps: ["Boil rice 12 minutes.", "Garlic in oil 45 seconds.", "Fold together and rest 1 minute."],
        minutes: 14,
        servings: 2,
      },
      {
        title: "Lemon Spinach",
        ingredientIds: ["spinach", "lemon", "olive-oil"],
        steps: ["Heat oil 1 minute.", "Wilt spinach 2 minutes.", "Add lemon and rest 1 minute."],
        minutes: 8,
        servings: 2,
      },
      {
        title: "",
        ingredientIds: ["rice"],
        steps: [],
        minutes: 1,
        servings: 1,
      },
    ],
  }));
  assert.equal(result.status, 200);
  assert.equal(result.body.recipes.length, 2);
  assert.deepEqual(result.body.recipes[0].ingredientIds, ["rice", "garlic", "olive-oil", "papaya"]);
  assert.notEqual(result.body.recipes[0].image, result.body.recipes[1].image);
});

test("a cheese recipe does not reuse the rice photo", () => {
  const rice = acceptProposal(pantry, {
    title: "Garlic Rice",
    ingredientIds: ["rice", "garlic"],
    steps: ["Boil 12 minutes.", "Garlic 45 seconds.", "Rest 1 minute."],
    minutes: 14,
    servings: 2,
  });
  const cheese = acceptProposal(["cottage-cheese", "flour", "sugar"], {
    title: "Syrnyky",
    ingredientIds: ["cottage-cheese", "flour", "sugar"],
    steps: ["Mix 2 minutes.", "Fry 3 minutes.", "Turn and fry 2 minutes."],
    minutes: 15,
    servings: 2,
  });
  assert.equal(rice.ok, true);
  assert.equal(cheese.ok, true);
  assert.notEqual(rice.recipe.image, cheese.recipe.image);
});

test("any grocery name can enter the pantry", () => {
  assert.equal(resolveIngredient("Banana").id, "banana");
  assert.equal(resolveIngredient("банан").id, "банан");
  assert.equal(resolveIngredient("сир").id, "cottage-cheese");
  assert.equal(resolveIngredient("сіль").status, "assumed");
  const result = acceptProposal(["banana", "банан"], {
    title: "Banana Toast",
    ingredientIds: ["banana", "банан", "salt", "honey"],
    steps: ["Toast bread 2 minutes.", "Slice banana 1 minute.", "Honey and rest 1 minute."],
    minutes: 5,
    servings: 1,
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.recipe.ingredientIds, ["banana", "банан", "honey"]);
  assert.equal(result.match.missingIds.length, 1);
});
