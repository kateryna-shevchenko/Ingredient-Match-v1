import { ingredients } from "../src/catalog.js";
import { acceptProposal } from "../src/accept.js";
import { ModelNotConfigured, proposeRecipe } from "./model.js";

const catalogIds = new Set(ingredients.map((item) => item.id));

export async function suggestForPantry(pantryIds, env = process.env, propose = proposeRecipe) {
  const pantry = [...new Set(pantryIds.filter((id) => catalogIds.has(id)))];
  if (!pantry.length) return { status: 400, body: { error: "empty-pantry" } };
  try {
    const proposal = await propose(pantry, env);
    const list = Array.isArray(proposal)
      ? proposal
      : Array.isArray(proposal?.recipes)
        ? proposal.recipes
        : [proposal];
    const recipes = [];
    const seen = new Set();
    let refusal = "shape";
    for (const item of list) {
      const accepted = acceptProposal(pantry, item);
      if (!accepted.ok) {
        refusal = accepted.reason;
        continue;
      }
      if (seen.has(accepted.recipe.id)) continue;
      seen.add(accepted.recipe.id);
      recipes.push(accepted.recipe);
    }
    if (!recipes.length) return { status: 422, body: { error: refusal } };
    return { status: 200, body: { recipes } };
  } catch (error) {
    if (error instanceof ModelNotConfigured || error?.code === "not-configured") {
      return { status: 503, body: { error: "not-configured" } };
    }
    return { status: 502, body: { error: "model-failed" } };
  }
}

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

export function attachSuggest(middlewares, env) {
  middlewares.use(async (req, res, next) => {
    const url = req.url?.split("?")[0];
    if (url !== "/api/suggest" || req.method !== "POST") return next();
    try {
      const body = await readJsonBody(req);
      const result = await suggestForPantry(
        Array.isArray(body.pantryIds) ? body.pantryIds : [],
        env,
      );
      res.statusCode = result.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result.body));
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "bad-request" }));
    }
  });
}
