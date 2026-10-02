export function scoreRecipe(pantryIds, recipe) {
  const pantry = new Set(pantryIds);
  const matchedIds = recipe.ingredientIds.filter((id) => pantry.has(id));
  const missingIds = recipe.ingredientIds.filter((id) => !pantry.has(id));
  const coverage = recipe.ingredientIds.length
    ? matchedIds.length / recipe.ingredientIds.length
    : 0;
  return {
    recipeId: recipe.id,
    matchedIds,
    missingIds,
    coverage,
  };
}

export function rankMatches(pantryIds, recipes) {
  if (!pantryIds.length) return [];
  return recipes
    .map((recipe) => scoreRecipe(pantryIds, recipe))
    .filter((match) => match.matchedIds.length > 0)
    .sort((a, b) => b.coverage - a.coverage || b.matchedIds.length - a.matchedIds.length);
}
