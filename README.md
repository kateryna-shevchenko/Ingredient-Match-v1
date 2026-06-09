# Ingredient Match

Small full-stack web app: pick ingredients from checkboxes, send them to a PHP backend, get recipe ideas back.

Built as a learning project with **HTML**, **vanilla JavaScript**, and **PHP**.

## What it does

1. User selects ingredients (cheese, eggs, chicken, etc.)
2. Browser sends the list as JSON via `fetch`
3. PHP endpoint returns recipe suggestions (mock response today; LLM integration planned)

## Tech

- Frontend: HTML, JavaScript (`fetch`, DOM)
- Backend: PHP, JSON API
- Planned: LLM API call, `localStorage` search history

## Status

- [x] Checkbox UI + form submit
- [x] JavaScript collects ingredients and POSTs JSON
- [x] PHP endpoint accepts request and returns mock recipes
- [ ] Render recipes on the page
- [ ] LLM-powered suggestions
- [ ] Search history with `localStorage`
