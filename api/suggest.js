import { suggestForPantry } from "../server/suggest.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "bad-request" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const locale = ["uk", "pl", "en"].includes(body.locale) ? body.locale : "en";
    const result = await suggestForPantry(Array.isArray(body.pantryIds) ? body.pantryIds : [], {
      ...process.env,
      RECIPE_LOCALE: locale,
    });
    res.status(result.status).json(result.body);
  } catch {
    res.status(400).json({ error: "bad-request" });
  }
}
