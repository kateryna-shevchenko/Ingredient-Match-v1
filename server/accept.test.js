import assert from "node:assert/strict";
import test from "node:test";
import { acceptProposal } from "../src/accept.js";
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
    title: "",
    ingredientIds: ["rice"],
    steps: [],
    minutes: 20,
    servings: 2,
  }));
  assert.equal(result.status, 422);
  assert.equal(result.body.recipe, undefined);
});

test("the server returns a recipe only after the gate accepts it", async () => {
  const result = await suggestForPantry(pantry, {}, async () => ({
    title: "Garlic Rice",
    ingredientIds: ["rice", "garlic", "olive-oil", "papaya"],
    steps: ["Boil rice 12 minutes.", "Garlic in oil 45 seconds.", "Fold together and rest 1 minute."],
    minutes: 14,
    servings: 2,
  }));
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.recipe.ingredientIds, ["rice", "garlic", "olive-oil"]);
  assert.equal(typeof result.body.recipe.id, "string");
});
