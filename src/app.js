import { acceptProposal } from "./accept.js";
import { resolveIngredient } from "./catalog.js";
import { applyChrome, currentLang, ingredientLabel, initLang, localizeRecipe, matchCount, setLang, t } from "./i18n.js";
import { rankMatches, scoreRecipe } from "./match.js";
import { recipeById, recipes } from "./recipes.js";
import { loadState, saveState } from "./store.js";

const root = document.querySelector("[data-app]");
const state = loadState();

let activeId = null;
let tab = "steps";
let pantryKey = "";
let suggestKey = "";
let suggestDetail = "";

const chips = root.querySelector("[data-chips]");
const results = root.querySelector("[data-results]");
const savedList = root.querySelector("[data-saved-list]");
const basketList = root.querySelector("[data-basket-list]");
const form = root.querySelector("[data-add-form]");
const input = root.querySelector("[data-add-input]");
const dialog = root.querySelector("dialog[data-detail]");
const views = root.querySelectorAll("[data-view]");
const count = root.querySelector("[data-count]");
const note = root.querySelector("[data-pantry-note]");
const suggestNote = root.querySelector("[data-suggest-note]");
const suggestButton = root.querySelector("[data-suggest]");
let suggesting = false;

function persist() {
  saveState(state);
}

function findRecipe(id) {
  const recipe = state.proposals.find((item) => item.id === id) || recipeById(id);
  return recipe ? localizeRecipe(recipe) : null;
}

function book() {
  const known = new Set(recipes.map((recipe) => recipe.id));
  return [...recipes, ...state.proposals.filter((recipe) => !known.has(recipe.id))];
}

function setSuggestNote(key, detail = "") {
  suggestKey = key || "";
  suggestDetail = detail || "";
  const message = suggestDetail || (suggestKey ? t(suggestKey) : "");
  suggestNote.hidden = !message;
  suggestNote.textContent = message;
}

function go(name) {
  views.forEach((view) => {
    view.hidden = view.getAttribute("data-view") !== name;
  });
  root.querySelectorAll("[data-nav]").forEach((button) => {
    const on = button.getAttribute("data-nav") === name;
    button.classList.toggle("text-papaya", on);
    button.classList.toggle("font-bold", on);
    button.classList.toggle("text-muted", !on);
  });
  if (dialog?.open) dialog.close();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderChips() {
  chips.innerHTML = state.pantry
    .map(
      (id) =>
        `<button type="button" class="inline-flex min-h-11 items-center gap-1.5 rounded-full border-0 bg-papaya/15 px-3 hover:-translate-y-0.5 hover:bg-papaya hover:text-white" data-remove="${escapeHtml(id)}"><span>${escapeHtml(ingredientLabel(id))}</span><i class="opacity-55 not-italic" aria-hidden="true">×</i></button>`,
    )
    .join("");
  note.hidden = !pantryKey;
  note.textContent = pantryKey ? t(pantryKey) : "";
}

function card(match) {
  const recipe = findRecipe(match.recipeId);
  const pct = Math.round(match.coverage * 100);
  const gap = match.missingIds.length
    ? `<p class="mt-1 text-[0.92em] text-warn">${escapeHtml(t("missing"))}: ${escapeHtml(match.missingIds.map(ingredientLabel).join(", "))}</p>`
    : `<p class="mt-1 text-[0.92em] font-semibold text-papaya">${escapeHtml(t("have-all"))}</p>`;
  return `<button type="button" class="m-0 grid min-w-0 overflow-hidden rounded-[1.15rem] border-0 bg-surface p-0 text-start hover:-translate-y-1 hover:shadow-[0_16px_32px_#441d0f22]" data-open="${escapeHtml(recipe.id)}">
      <img class="aspect-[16/10] w-full object-cover" src="${escapeHtml(recipe.image)}" alt="" width="640" height="400">
      <div class="min-w-0 px-4 pt-3 pb-4">
        <h3 class="m-0 text-[clamp(1rem,0.95rem+0.4vw,1.15rem)]">${escapeHtml(recipe.title)}</h3>
        <p class="mt-1 text-[0.92em] text-muted">${recipe.minutes} ${escapeHtml(t("min"))} · ${escapeHtml(t("servings"))} ${recipe.servings}</p>
        <div class="mt-2 grid grid-cols-[1fr_auto] items-center gap-1 text-[0.82em]">
          <b class="block h-1.5 overflow-hidden rounded-full bg-ink/10"><i class="block h-full bg-papaya" style="width:${pct}%"></i></b>
          <span>${pct}%</span>
        </div>
        ${gap}
      </div>
    </button>`;
}

function renderResults() {
  const list = rankMatches(state.pantry, book());
  if (!state.pantry.length) {
    count.textContent = t("add-have");
    results.innerHTML = `<p class="py-2 text-muted">${escapeHtml(t("overlap"))}</p>`;
    return;
  }
  count.textContent = list.length ? matchCount(list.length) : t("no-matches");
  results.innerHTML = list.length
    ? list.map(card).join("")
    : `<p class="py-2 text-muted">${escapeHtml(t("nothing-yet"))}</p>`;
}

function renderSaved() {
  const items = state.library.map(findRecipe).filter(Boolean);
  savedList.innerHTML = items.length
    ? items
        .map(
          (recipe) =>
            `<button type="button" class="mb-2 grid w-full grid-cols-[4.2rem_1fr] items-center gap-3 rounded-[1.15rem] border-0 bg-surface p-2 text-start hover:translate-x-1 hover:bg-[#f4e6da]" data-open="${escapeHtml(recipe.id)}"><img class="size-[4.2rem] rounded-xl object-cover" src="${escapeHtml(recipe.image)}" alt=""><span>${escapeHtml(recipe.title)}</span></button>`,
        )
        .join("")
      : `<p class="py-2 text-muted">${escapeHtml(t("heart"))}</p>`;
}

function renderBasket() {
  basketList.innerHTML = state.basket.length
    ? `<ul class="m-0 list-none p-0">${state.basket
        .map(
          (id) =>
            `<li class="my-1.5 flex items-center justify-between gap-3 rounded-[0.9rem] bg-surface px-4 py-3"><span>${escapeHtml(ingredientLabel(id))}</span><button class="min-h-11 border-0 bg-transparent font-semibold text-warn" type="button" data-basket-remove="${escapeHtml(id)}">${escapeHtml(t("remove"))}</button></li>`,
        )
        .join("")}</ul>`
    : `<p class="py-2 text-muted">${escapeHtml(t("basket-empty"))}</p>`;
}

function currentMatch(recipe) {
  if (!recipe) return null;
  return scoreRecipe(state.pantry, recipe);
}

function paintDetail() {
  const recipe = findRecipe(activeId);
  if (!dialog || !recipe) return;
  const match = currentMatch(recipe);
  const saved = state.library.includes(recipe.id);
  const missing = match.missingIds;
  const already = missing.every((id) => state.basket.includes(id));
  const addLabel = !missing.length
    ? ""
    : already
      ? `<button class="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border-0 bg-accent px-4 font-bold text-roast disabled:cursor-default disabled:opacity-55" type="button" disabled>${escapeHtml(t("in-basket"))}</button>`
      : `<button class="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full border-0 bg-accent px-4 font-bold text-roast hover:bg-[#d97a1c]" type="button" data-add-missing="${escapeHtml(recipe.id)}">${escapeHtml(t("add-missing"))}</button>`;
  const tabOff = "min-h-11 flex-1 rounded-full border-0 bg-transparent";
  const tabOn = "min-h-11 flex-1 rounded-full border-0 bg-roast text-white";
  const body =
    tab === "ingredients"
      ? `<ul class="m-0 list-none p-0">${recipe.ingredientIds
          .map((id) => {
            const ok = match.matchedIds.includes(id);
            return `<li class="my-1.5 flex items-center justify-between gap-3 rounded-[0.9rem] bg-surface px-4 py-3"><span class="min-w-0">${escapeHtml(ingredientLabel(id))}</span><em class="not-italic ${ok ? "text-papaya" : "text-warn"}">${ok ? escapeHtml(t("in-pantry")) : escapeHtml(t("to-buy"))}</em></li>`;
          })
          .join("")}</ul>`
      : `<ol class="m-0 list-decimal ps-5">${recipe.steps.map((step) => `<li class="my-1.5 list-item rounded-[0.9rem] bg-surface px-4 py-3 marker:font-bold">${escapeHtml(step)}</li>`).join("")}</ol>`;

  dialog.innerHTML = `
      <div class="relative min-h-[28svh] bg-cover bg-center" style="background-image:url('${escapeHtml(recipe.image)}')">
        <button type="button" class="absolute start-3 top-3 inline-flex size-11 items-center justify-center rounded-full border-0 bg-paper/85 hover:scale-105 hover:bg-accent" data-close aria-label="${escapeHtml(t("close"))}">✕</button>
        <button type="button" class="absolute end-3 top-3 inline-flex size-11 items-center justify-center rounded-full border-0 bg-paper/85 hover:scale-105 hover:bg-accent" data-save="${escapeHtml(recipe.id)}" aria-label="${escapeHtml(t("save"))}">${saved ? "♥" : "♡"}</button>
      </div>
      <div class="px-[max(1rem,env(safe-area-inset-left))] pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <h2 class="mb-2 text-balance text-[clamp(1.25rem,1.05rem+1.4vw,2.1rem)] leading-tight tracking-tight">${escapeHtml(recipe.title)}</h2>
        <p class="text-pretty">${escapeHtml(recipe.blurb)}</p>
        <p>${recipe.minutes} ${escapeHtml(t("min"))} · ${escapeHtml(t("servings"))} ${recipe.servings} · ${Math.round(match.coverage * 100)}% ${escapeHtml(t("match"))}</p>
        ${addLabel}
        <div class="my-3 flex rounded-full bg-surface p-1">
          <button type="button" class="${tab === "ingredients" ? tabOn : tabOff}" data-tab="ingredients">${escapeHtml(t("ingredients"))}</button>
          <button type="button" class="${tab === "steps" ? tabOn : tabOff}" data-tab="steps">${escapeHtml(t("instructions"))}</button>
        </div>
        ${body}
      </div>`;
}

function openDetail(id) {
  activeId = id;
  tab = "steps";
  paintDetail();
  if (dialog && !dialog.open) dialog.showModal();
}

function renderAll() {
  applyChrome(root);
  setSuggestNote(suggestKey, suggestDetail);
  renderChips();
  renderResults();
  renderSaved();
  renderBasket();
  if (dialog?.open && activeId) paintDetail();
}

root.addEventListener("click", (event) => {
  const target = event.target.closest(
    "[data-lang],[data-remove],[data-open],[data-save],[data-nav],[data-start],[data-close],[data-tab],[data-suggest],[data-add-missing],[data-basket-remove]",
  );
  if (!target) return;

  if (target.hasAttribute("data-lang")) {
    setLang(target.getAttribute("data-lang"));
    renderAll();
    return;
  }

  if (target.hasAttribute("data-remove")) {
    const id = target.getAttribute("data-remove");
    state.pantry = state.pantry.filter((item) => item !== id);
    pantryKey = "";
    persist();
    renderAll();
  }
  if (target.hasAttribute("data-open")) openDetail(target.getAttribute("data-open"));
  if (target.hasAttribute("data-save")) {
    const id = target.getAttribute("data-save");
    state.library = state.library.includes(id)
      ? state.library.filter((item) => item !== id)
      : [...state.library, id];
    persist();
    renderSaved();
    paintDetail();
  }
  if (target.hasAttribute("data-add-missing")) {
    const recipe = findRecipe(target.getAttribute("data-add-missing"));
    const match = currentMatch(recipe);
    for (const id of match.missingIds) {
      if (!state.basket.includes(id)) state.basket.push(id);
    }
    persist();
    renderBasket();
    paintDetail();
  }
  if (target.hasAttribute("data-basket-remove")) {
    const id = target.getAttribute("data-basket-remove");
    state.basket = state.basket.filter((item) => item !== id);
    persist();
    renderBasket();
  }
  if (target.hasAttribute("data-nav")) go(target.getAttribute("data-nav"));
  if (target.hasAttribute("data-start")) go("home");
  if (target.hasAttribute("data-close") && dialog) dialog.close();
  if (target.hasAttribute("data-tab")) {
    tab = target.getAttribute("data-tab");
    paintDetail();
  }
  if (target.hasAttribute("data-suggest")) suggest();
});

function failureNote(reply) {
  if (typeof reply?.detail === "string" && reply.detail) return reply.detail;
  if (typeof reply?.error === "string" && t(reply.error) !== reply.error) return t(reply.error);
  const code = reply?.error?.code || "";
  const message = reply?.error?.message || "";
  if (code === "FUNCTION_INVOCATION_TIMEOUT" || /timeout/i.test(message)) return t("timeout");
  if (typeof message === "string" && message) return message;
  return t("model-failed");
}

async function suggest() {
  if (suggesting) return;
  if (!state.pantry.length) {
    setSuggestNote("empty-pantry");
    return;
  }
  suggesting = true;
  suggestButton.disabled = true;
  setSuggestNote("asking");
  try {
    const response = await fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pantryIds: state.pantry, locale: currentLang() }),
    });
    const raw = await response.text();
    let reply;
    try {
      reply = JSON.parse(raw);
    } catch {
      setSuggestNote("no-model");
      return;
    }
    if (!response.ok) {
      setSuggestNote("", failureNote(reply));
      return;
    }
    const incoming = Array.isArray(reply.recipes) ? reply.recipes : reply.recipe ? [reply.recipe] : [];
    let acceptedAny = false;
    for (const proposal of incoming) {
      const accepted = acceptProposal(state.pantry, proposal);
      if (!accepted.ok) continue;
      acceptedAny = true;
      if (state.proposals.some((recipe) => recipe.id === accepted.recipe.id)) continue;
      state.proposals.push(accepted.recipe);
    }
    if (!acceptedAny) {
      setSuggestNote("shape");
      return;
    }
    persist();
    setSuggestNote("");
    renderAll();
    root.querySelector("#results")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  } catch {
    setSuggestNote("model-failed");
  } finally {
    suggesting = false;
    suggestButton.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const resolved = resolveIngredient(input.value);
  pantryKey = "";
  if (resolved.status === "assumed") {
    pantryKey = "assumed";
  } else if (resolved.status === "ok" && !state.pantry.includes(resolved.id)) {
    state.pantry.push(resolved.id);
    persist();
  }
  input.value = "";
  renderAll();
});

dialog.addEventListener("close", () => {
  activeId = null;
});

initLang();
renderAll();
go(root.getAttribute("data-first") || "home");
