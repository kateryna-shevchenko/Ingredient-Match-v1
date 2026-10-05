import { ingredientName } from "./catalog.js";

const LANGS = ["uk", "pl", "en"];
const KEY = "ingredient-match-lang";

const copy = {
  en: {
    skip: "Skip to recipes",
    welcomeTitle: "Cook like a chef",
    welcomeText: "Cook professional dishes right in your kitchen.",
    start: "Get started",
    ask: "What do you want to cook today?",
    product: "Product",
    add: "Add",
    suggest: "Make something with these",
    resultsTitle: "From this kitchen",
    bookmarks: "Bookmarks",
    basket: "Basket",
    basketLead: "Salt and pepper are assumed. You only add products that change the dish.",
    home: "Home",
    saved: "Saved",
    close: "Close",
    save: "Save",
    "empty-pantry": "Add what you already have first.",
    steps: "That suggestion had no cooking times, so it stayed off the page.",
    shape: "That suggestion did not match the recipe contract, so it stayed off the page.",
    "not-configured": "Gemini is not connected yet. Set GEMINI_API_KEY on the server.",
    "model-failed": "The model could not answer. The page kept the recipes already in the kitchen.",
    "bad-request": "The kitchen could not read that request.",
    assumed: "Salt and pepper are already assumed.",
    asking: "Asking for recipes…",
    "no-model": "This address has no recipe model yet. Open the latest Preview link.",
    timeout: "The kitchen ran out of time while writing the recipes. Try again.",
    "add-have": "Add what you already have",
    overlap: "Add a product you already have. Recipes appear as soon as one ingredient overlaps.",
    "no-matches": "No matches yet",
    "nothing-yet": "Nothing in the kitchen uses these products yet.",
    heart: "Heart a recipe to keep it here.",
    remove: "Remove",
    "basket-empty": "Open a recipe and add what it is missing.",
    missing: "Missing",
    "have-all": "You have everything",
    "in-pantry": "in pantry",
    "to-buy": "to buy",
    "in-basket": "In the basket",
    "add-missing": "Add missing to basket",
    ingredients: "Ingredients",
    instructions: "Instructions",
    min: "min",
    servings: "Servings",
    match: "match",
    welcomeAlt: "A market spread of fruits and vegetables",
  },
  uk: {
    skip: "До рецептів",
    welcomeTitle: "Готуй як шеф",
    welcomeText: "Професійні страви просто на твоїй кухні.",
    start: "Почати",
    ask: "Що хочеш приготувати сьогодні?",
    product: "Продукт",
    add: "Додати",
    suggest: "Приготувати з цього",
    resultsTitle: "З цієї кухні",
    bookmarks: "Збережене",
    basket: "Кошик",
    basketLead: "Сіль і перець уже є. Додавай лише продукти, які змінюють страву.",
    home: "Кухня",
    saved: "Збережене",
    close: "Закрити",
    save: "Зберегти",
    "empty-pantry": "Спочатку додай те, що вже є.",
    steps: "У відповіді не було часу готування, тож вона не потрапила на сторінку.",
    shape: "Відповідь не схожа на рецепт, тож вона не потрапила на сторінку.",
    "not-configured": "Gemini ще не підключено. Додай GEMINI_API_KEY на сервері.",
    "model-failed": "Модель не відповіла. Страви, які вже були на кухні, лишилися.",
    "bad-request": "Кухня не прочитала цей запит.",
    assumed: "Сіль і перець уже вважаються наявними.",
    asking: "Шукаю рецепти…",
    "no-model": "На цій адресі ще немає моделі. Відкрий останнє Preview.",
    timeout: "Часу на рецепти не вистачило. Спробуй ще раз.",
    "add-have": "Додай те, що вже є",
    overlap: "Додай продукт, який уже є. Рецепт з’явиться, щойно збіжиться хоч один інгредієнт.",
    "no-matches": "Збігів ще немає",
    "nothing-yet": "Жодна страва на кухні ще не використовує ці продукти.",
    heart: "Натисни серце, щоб зберегти рецепт.",
    remove: "Прибрати",
    "basket-empty": "Відкрий рецепт і додай те, чого бракує.",
    missing: "Бракує",
    "have-all": "Усе є",
    "in-pantry": "є вдома",
    "to-buy": "купити",
    "in-basket": "Уже в кошику",
    "add-missing": "Додати бракує в кошик",
    ingredients: "Інгредієнти",
    instructions: "Кроки",
    min: "хв",
    servings: "Порції",
    match: "збіг",
    welcomeAlt: "Овочі та фрукти з ринку",
  },
  pl: {
    skip: "Do przepisów",
    welcomeTitle: "Gotuj jak szef",
    welcomeText: "Profesjonalne dania w twojej kuchni.",
    start: "Zacznij",
    ask: "Co chcesz dziś ugotować?",
    product: "Produkt",
    add: "Dodaj",
    suggest: "Ugotuj z tego",
    resultsTitle: "Z tej kuchni",
    bookmarks: "Zapisane",
    basket: "Koszyk",
    basketLead: "Sól i pieprz są już wliczone. Dodajesz tylko produkty, które zmieniają danie.",
    home: "Kuchnia",
    saved: "Zapisane",
    close: "Zamknij",
    save: "Zapisz",
    "empty-pantry": "Najpierw dodaj to, co już masz.",
    steps: "W odpowiedzi nie było czasu gotowania, więc nie trafiła na stronę.",
    shape: "Odpowiedź nie wygląda jak przepis, więc nie trafiła na stronę.",
    "not-configured": "Gemini nie jest jeszcze podłączone. Ustaw GEMINI_API_KEY na serwerze.",
    "model-failed": "Model nie odpowiedział. Przepisy, które już były w kuchni, zostały.",
    "bad-request": "Kuchnia nie odczytała tego żądania.",
    assumed: "Sól i pieprz są już uwzględnione.",
    asking: "Szukam przepisów…",
    "no-model": "Pod tym adresem nie ma jeszcze modelu. Otwórz najnowszy Preview.",
    timeout: "Zabrakło czasu na przepisy. Spróbuj jeszcze raz.",
    "add-have": "Dodaj to, co już masz",
    overlap: "Dodaj produkt, który już masz. Przepis pojawi się, gdy choć jeden składnik się zgodzi.",
    "no-matches": "Brak trafień",
    "nothing-yet": "Żadne danie w kuchni nie używa jeszcze tych produktów.",
    heart: "Naciśnij serce, żeby zachować przepis.",
    remove: "Usuń",
    "basket-empty": "Otwórz przepis i dodaj to, czego brakuje.",
    missing: "Brakuje",
    "have-all": "Masz wszystko",
    "in-pantry": "jest w domu",
    "to-buy": "do kupienia",
    "in-basket": "Już w koszyku",
    "add-missing": "Dodaj braki do koszyka",
    ingredients: "Składniki",
    instructions: "Kroki",
    min: "min",
    servings: "Porcje",
    match: "zgodność",
    welcomeAlt: "Warzywa i owoce z targu",
  },
};

const labels = {
  uk: {
    rice: "рис",
    lemon: "лимон",
    "olive-oil": "оливкова олія",
    spinach: "шпинат",
    garlic: "часник",
    tomato: "помідор",
    basil: "базилік",
    onion: "цибуля",
    chickpea: "нут",
    carrot: "морква",
    spaghetti: "спагеті",
    avocado: "авокадо",
    egg: "яйце",
    chili: "чилі",
    "cottage-cheese": "сир",
    flour: "борошно",
    sugar: "цукор",
    butter: "масло",
    milk: "молоко",
    potato: "картопля",
    chicken: "курка",
  },
  pl: {
    rice: "ryż",
    lemon: "cytryna",
    "olive-oil": "oliwa",
    spinach: "szpinak",
    garlic: "czosnek",
    tomato: "pomidor",
    basil: "bazylia",
    onion: "cebula",
    chickpea: "ciecierzyca",
    carrot: "marchew",
    spaghetti: "spaghetti",
    avocado: "awokado",
    egg: "jajko",
    chili: "chili",
    "cottage-cheese": "twaróg",
    flour: "mąka",
    sugar: "cukier",
    butter: "masło",
    milk: "mleko",
    potato: "ziemniak",
    chicken: "kurczak",
  },
};

const books = {
  uk: {
    "lemon-rice": {
      title: "Рис з лимоном і зеленню",
      blurb: "Світлий рис із прив’яленою зеленню. Сіль і перець уже є.",
      steps: [
        "Промий 200 г рису, поки вода не стане прозорою. Вари в підсоленій воді 12 хвилин, злий і дай постояти 3 хвилини.",
        "На середньому вогні прогрій 1 столову ложку олії. Готуй часник 45 секунд, до солодкого запаху, без рум’янцю.",
        "Додай шпинат і готуй 2 хвилини, лише до м’якості.",
        "Вмішай рис. Зніми з вогню, додай цедру й сік лимона. Дай постояти 1 хвилину і подавай.",
      ],
    },
    "garlic-spinach": {
      title: "Шпинат з часником",
      blurb: "Швидкий гарнір. Увесь рецепт тримається на часі.",
      steps: [
        "Прогрій 1 столову ложку олії на широкій пательні 1 хвилину на середньому вогні.",
        "Додай нарізаний часник і готуй 45 секунд, помішуючи, до аромату.",
        "Додай шпинат жменями. Готуй 2 хвилини, перевертаючи, поки все листя не осяде і не заблищить.",
        "Зніми з вогню. Солі й перцю досить. Подавай одразу.",
      ],
    },
    "market-tray": {
      title: "Рис із деком з ринку",
      blurb: "Одне деко біля каструлі рису. Чого бракує, можна покласти в кошик.",
      steps: [
        "Розігрій духовку до 200°C. Наріж моркву й цибулю.",
        "Змішай моркву, цибулю й нут з 1 столовою ложкою олії та часником. Запікай 25 хвилин.",
        "Додай нарізаний помідор і запікай ще 8 хвилин, поки помідор не осяде.",
        "Тим часом вари рис у підсоленій воді 12 хвилин. Злий воду.",
        "Прив’яль шпинат у ложці олії 2 хвилини. Вмішай у рис разом із соком лимона.",
        "Виклади деко на рис і порви зверху базилік. Базилік не готуй.",
      ],
    },
    "tomato-basil": {
      title: "Помідори з базиліком на пательні",
      blurb: "Густа пательня. Подавай на рисі з лимоном, якщо є обидва.",
      steps: [
        "Прогрій 1 столову ложку олії на середньому вогні. Готуй цибулю 5 хвилин, до м’якості й прозорості.",
        "Додай часник і готуй 45 секунд.",
        "Додай нарізаний помідор. Тушкуй 10 хвилин, помішуючи, поки маса не стане як джем і рідина не загусне.",
        "Зніми з вогню. Порви базилік і зачекай 1 хвилину перед подачею.",
      ],
    },
    "chickpea-spaghetti": {
      title: "Спагеті з нутом і помідорами",
      blurb: "Паста з того, що є. Соус і паста закінчуються в ту саму хвилину.",
      steps: [
        "Вари спагеті в добре підсоленій воді 9 хвилин, до al dente. Відлий склянку води і злий решту.",
        "Поки варяться, прогрій 1 столову ложку олії і готуй часник 45 секунд.",
        "Додай нарізаний помідор і нут. Тушкуй 10 хвилин, поки помідор не розпадеться.",
        "Змішай пасту з соусом 1 хвилину. Якщо сухо, додай трохи води від пасти. Базилік порви вже без вогню.",
      ],
    },
  },
  pl: {
    "lemon-rice": {
      title: "Ryż z cytryną i zieleniną",
      blurb: "Jasny ryż z podwiędniętą zieleniną. Sól i pieprz są już wliczone.",
      steps: [
        "Płucz 200 g ryżu, aż woda będzie czysta. Gotuj w osolonej wodzie 12 minut, odcedź i odstaw na 3 minuty.",
        "Na średnim ogniu rozgrzej 1 łyżkę oliwy. Smaż czosnek 45 sekund, aż zapachnie słodko, bez rumieńca.",
        "Dodaj szpinak i gotuj 2 minuty, tylko do zwiędnięcia.",
        "Wymieszaj z ryżem. Zdejmij z ognia, dodaj skórkę i sok z cytryny. Odstaw na 1 minutę i podawaj.",
      ],
    },
    "garlic-spinach": {
      title: "Szpinak z czosnkiem",
      blurb: "Szybki dodatek. Cały przepis opiera się na czasie.",
      steps: [
        "Rozgrzej 1 łyżkę oliwy na szerokiej patelni przez 1 minutę na średnim ogniu.",
        "Dodaj pokrojony czosnek i smaż 45 sekund, mieszając, aż zapachnie.",
        "Dodawaj szpinak garściami. Gotuj 2 minuty, przewracając, aż każdy liść opadnie i zabłyśnie.",
        "Zdejmij z ognia. Sól i pieprz wystarczą. Podawaj od razu.",
      ],
    },
    "market-tray": {
      title: "Ryż z blachą z targu",
      blurb: "Jedna blacha obok garnka ryżu. Czego brakuje, może trafić do koszyka.",
      steps: [
        "Nagrzej piekarnik do 200°C. Pokrój marchew i cebulę.",
        "Wymieszaj marchew, cebulę i ciecierzycę z 1 łyżką oliwy i czosnkiem. Piecz 25 minut.",
        "Dodaj posiekanego pomidora i piecz jeszcze 8 minut, aż pomidor zmięknie.",
        "W tym czasie gotuj ryż w osolonej wodzie 12 minut. Odcedź.",
        "Podduś szpinak na łyżce oliwy przez 2 minuty. Wymieszaj z ryżem i sokiem z cytryny.",
        "Wyłóż blachę na ryż i porwij bazylię na wierzch. Bazylii nie gotuj.",
      ],
    },
    "tomato-basil": {
      title: "Pomidory z bazylią na patelni",
      blurb: "Gęsta patelnia. Podawaj na ryżu z cytryną, gdy masz oba.",
      steps: [
        "Rozgrzej 1 łyżkę oliwy na średnim ogniu. Smaż cebulę 5 minut, aż zmięknie i stanie się przejrzysta.",
        "Dodaj czosnek i smaż 45 sekund.",
        "Dodaj posiekanego pomidora. Duś 10 minut, mieszając, aż masa będzie jak dżem, a płyn zgęstnieje.",
        "Zdejmij z ognia. Porwij bazylię i odczekaj 1 minutę przed podaniem.",
      ],
    },
    "chickpea-spaghetti": {
      title: "Spaghetti z ciecierzycą i pomidorami",
      blurb: "Makaron z tego, co jest. Sos i makaron kończą się w tej samej minucie.",
      steps: [
        "Gotuj spaghetti w dobrze osolonej wodzie 9 minut, al dente. Odlej kubek wody i odcedź resztę.",
        "W tym czasie rozgrzej 1 łyżkę oliwy i smaż czosnek 45 sekund.",
        "Dodaj posiekanego pomidora i ciecierzycę. Duś 10 minut, aż pomidor się rozpadnie.",
        "Wymieszaj makaron z sosem przez 1 minutę. Jeśli jest sucho, dodaj odrobinę wody z makaronu. Bazylię porwij już bez ognia.",
      ],
    },
  },
};

let lang = "en";

export function currentLang() {
  return lang;
}

export function initLang() {
  let saved = "";
  try {
    saved = localStorage.getItem(KEY) || "";
  } catch {
    saved = "";
  }
  const detected = (navigator.language || "en").slice(0, 2);
  const next = LANGS.includes(saved) ? saved : detected === "uk" || detected === "pl" ? detected : "en";
  lang = next;
  document.documentElement.lang = next;
}

export function setLang(next) {
  lang = LANGS.includes(next) ? next : "en";
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    // The page still switches for this visit.
  }
  document.documentElement.lang = lang;
}

export function t(key) {
  return copy[lang]?.[key] || copy.en[key] || key;
}

export function ingredientLabel(id) {
  return labels[lang]?.[id] || ingredientName(id);
}

export function localizeRecipe(recipe) {
  const overlay = books[lang]?.[recipe.id];
  return overlay ? { ...recipe, ...overlay } : recipe;
}

export function matchCount(count) {
  if (lang === "uk") {
    const word = count === 1 ? "збіг" : count >= 2 && count <= 4 ? "збіги" : "збігів";
    return `${count} ${word}`;
  }
  if (lang === "pl") {
    const word = count === 1 ? "trafienie" : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 > 20) ? "trafienia" : "trafień";
    return `${count} ${word}`;
  }
  return `${count} match${count === 1 ? "" : "es"}`;
}

export function applyChrome(root) {
  root.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
  });
  root.querySelectorAll("[data-i18n-alt]").forEach((node) => {
    node.setAttribute("alt", t(node.getAttribute("data-i18n-alt")));
  });
  root.querySelectorAll("[data-i18n-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.getAttribute("data-i18n-label")));
  });
  root.querySelectorAll("[data-lang]").forEach((button) => {
    const on = button.getAttribute("data-lang") === lang;
    button.classList.toggle("font-bold", on);
    button.classList.toggle("underline", on);
  });
}
