---
name: Recipe app learning path
overview: "A study-first roadmap for building a minimal web app: 10 product checkboxes, submit to a small PHP backend that asks an LLM for 10 recipes, and persist past search results so refresh still shows history—while accepting that repeat searches may differ."
todos:
  - id: static-ui
    content: Build 10 checkboxes + submit in HTML/CSS; no backend yet.
    status: pending
  - id: dom-to-json
    content: In JS, collect checked values into an array on submit (console.log first).
    status: pending
  - id: backend-skeleton
    content: Add minimal PHP POST script (e.g. api/recipes.php); echo products or return mock 10-item JSON list.
    status: pending
  - id: wire-fetch
    content: Connect fetch POST from page to endpoint; render list from JSON.
    status: pending
  - id: llm-server
    content: From PHP, call LLM with key from env; json_encode parsed recipe array for the browser (handle errors).
    status: pending
  - id: history-storage
    content: Append each search to localStorage; on page load render history + latest run.
    status: pending
  - id: detail-view
    content: Click recipe to show full text (expand or simple detail panel).
    status: pending
isProject: false
---

# Learning roadmap: simple “10 checkboxes → 10 recipes” web app

## What you are building (fixed picture)

- **UI:** Exactly 10 products as checkboxes, plus a submit control.
- **Behavior:** On submit, the browser sends the list of checked products to **your** server; the server calls an LLM; the response becomes **up to 10 recipes** you show on the page.
- **After refresh:** The user still sees **past runs** (a history of what was already generated), not a blank screen. You are fine with this feeling like a “log” of prior screens.
- **Repeat search:** Same checkboxes can produce **different** recipes next time; you are **not** asking for identical replays.

That last point implies you should **append** each successful search to stored history (timestamp + selected products + model output), not overwrite a single slot—unless you explicitly want “only latest run” later.

---

## Where to start (first afternoon)

Work in this order so each step only needs the previous one.

1. **Static page that does nothing smart**  
   Learn: HTML form basics (`input type="checkbox"`, `button` or `input type="submit"`), a little CSS so it is not painful to look at.  
   **Ceiling:** You do not need a CSS framework yet.  
   **Files mindset:** One `index.html` is enough at first; optional `styles.css`.

2. **Read the checkboxes in JavaScript**  
   Learn: DOM queries, reading `.checked`, building a plain array like `["eggs","milk"]`.  
   **Ceiling:** No state library, no TypeScript yet if it slows you down.

3. **Send that array to your own server**  
   Learn: `fetch` with `POST`, `JSON.stringify` body, `Content-Type: application/json`, simple JSON response.  
   **Ceiling:** Skip authentication, skip databases for the first milestone.

You are using **PHP** for the backend—stay with one small entry point for the whole project:

- **Typical minimal layout:** one script that handles the search, e.g. `api/recipes.php` or `public/api/recipes.php`, exposed as `POST` (exact URL depends on your server: Apache `DocumentRoot`, nginx `root`, or `php -S` from a folder). Send `Content-Type: application/json` on responses; if the HTML page and PHP live on different origins during dev, you will touch **CORS** (`Access-Control-Allow-*` headers)—same folder on one host avoids that class of bug.
- **HTTP from PHP to the LLM:** learn `curl` in PHP (`curl_init` …) **or** Composer + `guzzlehttp/guzzle`—pick one and stick to it so you are not fighting two HTTP APIs at once.
- **JSON in/out:** `json_decode` / `json_encode`, `JSON_THROW_ON_ERROR` (PHP 7.3+) or try/catch around decode so malformed model output does not white-screen your script.

You only need a single endpoint the browser calls, e.g. `POST /api/recipes.php` (path as your host allows).

---

## Topics to discover next (core “full stack” slice)

4. **Environment variables and secrets (PHP)**  
   Learn: API key lives **only** on the server; browser never sees the provider key. Common patterns: Apache `SetEnv`, nginx `fastcgi_param`, **or** a local `.env` loaded with `vlucas/phpdotenv` (Composer)—whichever matches how you already run PHP.  
   **Ceiling:** You do not need Vault, Docker, or cloud secret managers yet.

5. **Calling the LLM from the server**  
   Learn: HTTP client on the server, reading response text or JSON, basic error handling (timeouts, non-200 status, empty body).  
   **Ceiling:** You do not need streaming, agents, or RAG for this app.

6. **Turning model output into data your UI can loop over**  
   Learn: On the **server**, `json_decode` the model payload (with error handling); on the **browser**, `JSON.parse` only if you stored a string, or use the object you already got from `fetch`’s `.json()`. For “10 recipes,” a structured JSON contract is easier than free-form prose. (This is “data shape,” not “prompt craft”: you are learning to validate and render lists.)

7. **Persist “history” across refresh**  
   You have two learning branches; pick one for v1:
   - **Browser-only history:** `localStorage` stores an array of past runs (each run: time, selected products, recipes). Easiest to ship.
   - **Server-side history:** A file or SQLite on disk; browser loads `/history`. More moving parts.

   Given your “log of what I already saw” goal, **localStorage** matches your earlier instinct and keeps the server stateless.

   **Ceiling:** Skip user accounts until v1 works end-to-end.

8. **Showing one recipe’s details**  
   Learn: either expand/collapse in the list, or a second “view” (still one page) where clicking a row sets `currentRecipe` and re-renders.  
   **Ceiling:** No router framework required; optional later.

---

## Maximum level (what you can defer)

- **Defer:** React/Vue/Svelte until you can do the flow in vanilla JS—or adopt one immediately if your course requires it; then the _topics_ stay the same, only the UI layer changes.
- **Defer:** Laravel/Symfony for v1 if plain PHP + one endpoint already matches how you host homework; adopt a framework when routing, middleware, and structure pay off.
- **Defer:** Postgres, Docker, CI/CD, caching layers, rate limiting (add when you expose the app publicly).
- **Defer:** “Making the model always factual”—you already accepted generative variability; focus on **reliable plumbing** (network, JSON, storage) first.

---

## Milestone map: “what to think about when”

| Moment            | You should be able to answer                                             |
| ----------------- | ------------------------------------------------------------------------ |
| After static HTML | Where do the 10 labels live? How does submit fire?                       |
| After DOM JS      | What exact array do I send when 3 boxes are checked?                     |
| After `fetch`     | What JSON does my server return on success vs error?                     |
| After LLM call    | Where is the key, and what is the raw response string before UI?         |
| After persistence | On load, do I read `localStorage`, parse JSON, and render a timeline?    |
| After polish      | What happens if the model returns malformed JSON or fewer than 10 items? |

---

## Files you might end up with (minimal mental model)

**Frontend (vanilla):**  
`index.html`, `main.js`, optional `styles.css`.

**Backend (PHP example):**  
`api/recipes.php` (or your single entry script), optional `composer.json` + `vendor/` if you use Guzzle or phpdotenv, `.env` (gitignored), `.gitignore`. Optional `public/index.html` + `public/main.js` if the server root is `public/`.

No extra folders until one file feels crowded—then split `routes` or `static` naturally.

---

## How this plan differs from “AI plan preparation”

You are not being asked to master prompt libraries first. The learning order is **UI → HTTP → server secrets → model HTTP → structured data → storage → edge cases**. Prompt wording becomes something you adjust _after_ the pipe works.
