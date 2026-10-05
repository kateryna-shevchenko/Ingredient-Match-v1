# Ingredient Match

A kitchen that suggests dishes from the products you already have. Add what is in the pantry, and the page ranks recipes by how much they overlap. Gemini can propose up to ten familiar dishes. Anything missing can go into the basket from the recipe card.

The interface and newly generated recipes work in Ukrainian, Polish, and English.

## How it works

A product has a stable id. "Молоко", "milk", and "mleko" are the same product. Salt and pepper are never added: they are assumed to be on hand.

The pantry, saved recipes, and basket live in the browser (`localStorage`). Saving stores a recipe id, not a copy of the text. The basket changes only when you press the button on a recipe: it receives the products that are missing from the pantry at that moment.

Static recipes live in `src/recipes.js`. Generated ones pass a check before they are stored: a title, ingredients, at least three steps that include a time, a duration, and a serving count. The model does not assign an id or choose a picture. The photo comes from the dish's ingredients.

## Locally

```bash
npm install
npm run dev
```

Open the address Vite prints. In this mode, `POST /api/suggest` is served by the same code that runs on Vercel.

Check the gate without calling the model:

```bash
npm test
```

## Gemini key

The key stays on the server. It never goes into the browser or into git.

For local development, create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your-key
```

`GOOGLE_API_KEY` works as well. `GEMINI_MODEL` is optional. If the named model is busy, the server tries other Gemini Flash models.

On Vercel, set the same variables in **Settings → Environment Variables** for Preview or Production. A new deployment is required after a variable changes.

## Deploy

The site is Vite. Generation is the `api/suggest.js` function. Host settings are in `vercel.json`.

A push to GitHub creates a Preview. The public address stays as it is until that deployment is promoted to Production.
