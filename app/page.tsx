"use client";
/* eslint-disable @next/next/no-img-element -- shared component also builds as a static Vite app for GitHub Pages */

import { useEffect, useMemo, useState } from "react";
import { ADDITIONAL_RECIPES, ADDITIONAL_STEPS, DAGS_NOTES, QUANTITIES, STAPLE_QUANTITIES } from "./recipe-data";
import { DESSERT_NOTES, DESSERT_QUANTITIES, DESSERT_RECIPES, DESSERT_STAPLE_QUANTITIES, DESSERT_STEPS, DESSERT_SWAPS } from "./dessert-data";

type PantryState = "have" | "avoid" | undefined;
type ColorScheme = "garden" | "pink";
type FoodMode = "savory" | "dessert";

type Recipe = {
  id: string;
  title: string;
  description: string;
  time: number;
  difficulty: "Easy" | "Medium";
  category: string;
  ingredients: string[];
  staples: string[];
  accent: string;
};

const SAVORY_RECIPES: Recipe[] = [
  {
    id: "lemon-butter-beans",
    title: "Creamy lemon butter beans",
    description: "Creamy, lemony beans with tender greens, parmesan and plenty of sauce for toast.",
    time: 28,
    difficulty: "Easy",
    category: "One pan",
    ingredients: ["butter beans", "onion", "garlic", "vegetable stock", "cream", "spinach", "lemon", "parmesan", "parsley"],
    staples: ["olive oil", "fine salt", "black pepper"],
    accent: "citrus",
  },
  {
    id: "gochujang-tofu",
    title: "Crispy gochujang tofu bowls",
    description: "Cornflour-crisp tofu in a glossy chilli glaze with rice, greens and cool cucumber.",
    time: 38,
    difficulty: "Medium",
    category: "High protein",
    ingredients: ["tofu", "rice", "broccoli", "cucumber", "gochujang", "soy sauce", "garlic", "ginger", "lime", "spring onion", "sesame seeds", "cornflour"],
    staples: ["neutral oil", "sugar", "fine salt", "water"],
    accent: "chilli",
  },
  {
    id: "golden-orzo",
    title: "Golden tomato orzo",
    description: "A glossy one-pot orzo with burst tomatoes, feta, greens and a fresh lemon finish.",
    time: 30,
    difficulty: "Easy",
    category: "One pot",
    ingredients: ["orzo", "tomatoes", "onion", "garlic", "tomato paste", "vegetable stock", "spinach", "feta", "lemon", "basil"],
    staples: ["olive oil", "fine salt", "black pepper"],
    accent: "tomato",
  },
  {
    id: "lentil-tacos",
    title: "Smoky lentil tacos",
    description: "Smoky, jammy lentils with quick lime slaw, avocado and a cooling crema.",
    time: 32,
    difficulty: "Easy",
    category: "Weeknight",
    ingredients: ["lentils", "tortillas", "red onion", "garlic", "tomatoes", "cabbage", "lime", "yogurt", "avocado", "cumin", "paprika", "cheddar"],
    staples: ["neutral oil", "fine salt", "black pepper", "water"],
    accent: "plum",
  },
  {
    id: "coconut-curry",
    title: "Coconut chickpea curry",
    description: "A fragrant coconut curry with tender sweet potato, chickpeas, greens and fluffy rice.",
    time: 38,
    difficulty: "Easy",
    category: "Pantry hero",
    ingredients: ["chickpeas", "coconut milk", "sweet potato", "onion", "garlic", "ginger", "curry powder", "tomatoes", "spinach", "lime", "rice", "coriander"],
    staples: ["neutral oil", "fine salt", "water"],
    accent: "saffron",
  },
  {
    id: "miso-udon",
    title: "Miso mushroom udon",
    description: "Bouncy noodles, deeply browned mushrooms and greens in a gingery miso broth.",
    time: 30,
    difficulty: "Easy",
    category: "Comfort food",
    ingredients: ["udon", "mushrooms", "miso", "pak choi", "spring onion", "garlic", "ginger", "vegetable stock", "soy sauce", "sesame seeds"],
    staples: ["neutral oil", "sesame oil"],
    accent: "forest",
  },
  ...ADDITIONAL_RECIPES,
];

const ALL_RECIPES: Recipe[] = [...SAVORY_RECIPES, ...DESSERT_RECIPES];
const ALL_QUANTITIES: Record<string, string[]> = { ...QUANTITIES, ...DESSERT_QUANTITIES };
const ALL_STAPLE_QUANTITIES: Record<string, string[]> = { ...STAPLE_QUANTITIES, ...DESSERT_STAPLE_QUANTITIES };
const ALL_NOTES: Record<string, string> = { ...DAGS_NOTES, ...DESSERT_NOTES };

const RECIPE_SOURCES: Record<string, { label: string; url: string }> = {
  "cooktoria-chickpea-gyros": { label: "Cooktoria", url: "https://cooktoria.com/vegetarian-gyros/" },
  "chelsea-chickpea-gyros": { label: "Chelsea’s Messy Apron", url: "https://www.chelseasmessyapron.com/vegetarian-gyros/" },
  "portobello-gyros": { label: "Live Eat Learn", url: "https://www.liveeatlearn.com/vegetarian-portobello-mushroom-gyros/" },
  "king-oyster-gyros": { label: "Ale Cooks", url: "https://www.alecooks.com/vegetarian-gyro-with-king-oyster-mushrooms/" },
  "tofu-fries-gyros": { label: "School Night Vegan", url: "https://schoolnightvegan.com/home/vegan-gyros-with-tzatziki/" },
};

const DEFAULT_PANTRY: Record<string, PantryState> = {
  chickpeas: "have", spinach: "have", tomatoes: "have", garlic: "have",
  lemon: "have", rice: "have", tofu: "avoid",
};

const SWAPS: Record<string, string[]> = {
  "butter beans": ["cannellini beans", "chickpeas"],
  spinach: ["kale", "Swiss chard"],
  cream: ["oat cream", "coconut cream"],
  tofu: ["tempeh", "chickpeas"],
  "french fries": ["oven-baked potato wedges", "sweet potato fries"],
  rice: ["quinoa", "cauliflower rice"],
  cucumber: ["shredded cabbage", "radishes"],
  gochujang: ["sriracha + miso", "harissa"],
  orzo: ["small pasta", "pearl couscous"],
  feta: ["goat cheese", "plant-based feta"],
  basil: ["parsley", "baby spinach"],
  lentils: ["black beans", "crumbled tempeh"],
  tortillas: ["lettuce cups", "flatbread"],
  yogurt: ["sour cream", "plant-based yogurt"],
  chickpeas: ["butter beans", "firm tofu"],
  "coconut milk": ["oat cream", "cashew cream"],
  "sweet potato": ["butternut squash", "carrots"],
  onion: ["red onion", "2 shallots"],
  "red onion": ["brown onion", "2 shallots"],
  "vegetable stock": ["water + stock cube", "light miso broth"],
  parmesan: ["pecorino-style cheese", "nutritional yeast"],
  parsley: ["basil", "chives"],
  broccoli: ["pak choi", "green beans"],
  "soy sauce": ["tamari", "coconut aminos"],
  ginger: ["ginger paste", "¼ tsp ground ginger"],
  "sesame seeds": ["chopped peanuts", "sunflower seeds"],
  cornflour: ["potato starch", "plain flour"],
  "tomato paste": ["tomato purée", "2 tbsp passata"],
  avocado: ["extra lime slaw", "crumbled feta"],
  cumin: ["ground coriander", "taco seasoning"],
  paprika: ["mild chilli powder", "chipotle powder"],
  cheddar: ["mozzarella", "crumbled feta"],
  "curry powder": ["garam masala + turmeric", "mild curry paste"],
  coriander: ["parsley", "mint"],
  rocket: ["baby spinach", "mixed salad leaves"],
  olives: ["capers", "sun-dried tomatoes"],
  bread: ["flatbread", "seeded crackers"],
  edamame: ["peas", "cubed tofu"],
  carrots: ["shredded cabbage", "red pepper"],
  courgette: ["broccoli", "asparagus"],
  "white wine": ["extra vegetable stock", "apple juice + lemon"],
  butter: ["olive oil", "plant-based butter"],
  "black beans": ["pinto beans", "kidney beans"],
  "bell pepper": ["courgette", "cherry tomatoes"],
  "red lentils": ["yellow split peas", "split mung beans"],
  gnocchi: ["small potatoes", "short pasta"],
  pesto: ["herb oil", "sun-dried tomato pesto"],
  peas: ["edamame", "chopped green beans"],
  mozzarella: ["feta", "soft goat cheese"],
  eggs: ["crumbled firm tofu", "chickpea scramble"],
  halloumi: ["paneer", "firm tofu"],
  aubergine: ["mushrooms", "extra courgette"],
  udon: ["ramen noodles", "rice noodles"],
  mushrooms: ["aubergine", "smoked tofu"],
  miso: ["soy sauce + tahini", "vegetable stock concentrate"],
  "pak choi": ["spinach", "broccoli"],
  lime: ["lemon", "rice vinegar"],
  lemon: ["lime", "white wine vinegar"],
  kale: ["spinach", "Swiss chard"],
  celery: ["fennel", "extra carrot"],
  "small pasta": ["orzo", "broken spaghetti"],
  breadcrumbs: ["panko", "crushed crackers"],
  romaine: ["little gem lettuce", "crunchy cabbage"],
  mustard: ["Dijon mustard", "horseradish"],
  capers: ["chopped olives", "finely chopped pickles"],
  milk: ["oat milk", "unsweetened soy milk"],
  couscous: ["quinoa", "bulgur wheat"],
  hummus: ["white bean dip", "whipped feta"],
  mint: ["dill", "extra parsley"],
  falafel: ["roasted chickpeas", "grilled halloumi"],
  cauliflower: ["broccoli", "aubergine"],
  paneer: ["halloumi", "extra-firm tofu"],
  "vegetarian kimchi": ["sauerkraut + chilli sauce", "spicy pickled cabbage"],
  "spring onion": ["chives", "finely sliced red onion"],
  dill: ["parsley", "tarragon"],
  "egg noodles": ["tagliatelle", "rice noodles"],
  "sour cream": ["crème fraîche", "Greek yogurt"],
  thyme: ["rosemary", "dried thyme"],
  "ramen noodles": ["udon", "rice noodles"],
  "soba noodles": ["wholewheat spaghetti", "rice noodles"],
  walnuts: ["pumpkin seeds", "toasted breadcrumbs"],
  "cannellini beans": ["butter beans", "chickpeas"],
  potatoes: ["sweet potato", "celeriac"],
  "pumpkin seeds": ["sunflower seeds", "chopped walnuts"],
  spaghetti: ["linguine", "bucatini"],
  "filo pastry": ["puff pastry", "spring-roll wrappers"],
  ricotta: ["cottage cheese", "soft goat cheese"],
  tomatoes: ["passata", "roasted red peppers"],
  corn: ["peas", "diced bell pepper"],
  garlic: ["garlic paste", "finely chopped shallot"],
  "chickpea pasta": ["wholewheat pasta", "lentil pasta"],
  harissa: ["gochujang", "smoked paprika + chilli"],
  "arborio rice": ["carnaroli rice", "pearl barley"],
  "pumpkin puree": ["butternut squash purée", "sweet potato mash"],
  sage: ["thyme", "rosemary"],
  "pasta shells": ["cannelloni tubes", "large rigatoni"],
  "green curry paste": ["red curry paste", "curry powder + fresh herbs"],
  quinoa: ["couscous", "bulgur wheat"],
  farro: ["pearl barley", "brown rice"],
  "butternut squash": ["sweet potato", "pumpkin"],
  "pita bread": ["flatbread", "soft tortillas"],
  lettuce: ["rocket", "shredded cabbage"],
  "portobello mushrooms": ["large flat mushrooms", "aubergine"],
  "king oyster mushrooms": ["portobello mushrooms", "firm tofu"],
  "red wine vinegar": ["lemon juice", "white wine vinegar"],
  macaroni: ["small shells", "short pasta"],
};

const STEPS: Record<string, string[]> = {
  "lemon-butter-beans": [
    "Drain and rinse the butter beans. Finely chop the onion and parsley, mince the garlic, zest the lemon, then cut it in half.",
    "Heat the olive oil in a wide frying pan over medium heat. Add the onion and salt and cook for 5 minutes, stirring, until soft but not browned.",
    "Add the garlic and cook for 30 seconds. Stir in the beans and stock, bring to a lively simmer and cook uncovered for 7–8 minutes. Crush about a quarter of the beans with the back of a spoon to thicken the sauce.",
    "Turn the heat to low. Stir in the cream and parmesan and simmer gently for 2 minutes, until glossy. Do not let it boil hard or the cream may split.",
    "Add the spinach a handful at a time and fold it through until just wilted, about 2 minutes.",
    "Take the pan off the heat. Stir in the lemon zest, half the juice, parsley and plenty of black pepper. Taste and add more lemon or salt if needed; serve immediately with toast.",
  ],
  "gochujang-tofu": [
    "Rinse the rice, put it in a small saucepan with the packet’s recommended amount of water and a pinch of salt, and bring to a boil. Cover, turn the heat to low and cook for 12 minutes; remove from the heat and leave covered for 10 minutes.",
    "Pat the tofu very dry and tear it into bite-sized pieces. Toss with the cornflour and salt until every craggy edge is lightly coated.",
    "Heat the oil in a large non-stick pan over medium-high heat. Fry the tofu for 8–10 minutes, turning every couple of minutes, until crisp and golden on most sides.",
    "Meanwhile, whisk the gochujang, soy sauce, sugar, grated garlic and ginger, the juice of half the lime and the measured water in a bowl.",
    "Cut the broccoli into small florets and steam or boil for 3–4 minutes until bright green and just tender. Thinly slice the cucumber and spring onions.",
    "Pour the sauce over the crisp tofu. Bubble for 1–2 minutes, tossing constantly, until the sauce is thick, shiny and clings to every piece.",
    "Fluff the rice and divide it between bowls. Add the broccoli, cucumber and tofu, then finish with spring onion, sesame seeds and the remaining lime cut into wedges.",
  ],
  "golden-orzo": [
    "Finely chop the onion and garlic. Halve the tomatoes, crumble the feta and dissolve the stock in 500 ml freshly boiled water.",
    "Heat the olive oil in a deep frying pan over medium heat. Add the onion and salt and cook for 4–5 minutes until translucent. Add the garlic and tomato paste and cook for 1 minute.",
    "Add the tomatoes and cook for 4 minutes, pressing a few with the back of a spoon so their juices form the base of the sauce.",
    "Stir in the orzo for 30 seconds, then pour in the hot stock. Simmer uncovered over medium-low heat for 10–12 minutes, stirring often so the pasta does not catch, until the orzo is tender and saucy.",
    "Stir in the spinach and two-thirds of the feta. Cook for 1–2 minutes, adding a splash of hot water if the orzo looks tight; it should settle softly rather than hold its shape.",
    "Remove from the heat and rest for 2 minutes. Stir in the lemon juice and torn basil, taste for salt and pepper, then top with the remaining feta.",
  ],
  "lentil-tacos": [
    "Thinly slice the cabbage and half the red onion. Toss both with the juice of half the lime and a pinch of salt, scrunching for 30 seconds with clean hands. Set aside to soften.",
    "Finely chop the remaining onion and mince the garlic. Heat the oil in a frying pan over medium heat and cook the onion for 4 minutes until soft.",
    "Add the garlic, cumin and paprika and stir for 30 seconds. Add the lentils and chopped tomatoes with the measured water, then simmer for 8–10 minutes, stirring and lightly crushing the lentils, until thick and spoonable.",
    "Mix the yogurt with a squeeze of lime, a pinch of salt and 1 tablespoon of water to make a drizzly crema. Slice the avocado and grate the cheddar.",
    "Warm the tortillas in a dry pan for 20–30 seconds per side, or wrap the stack in a damp tea towel and microwave for 30 seconds.",
    "Fill each warm tortilla with smoky lentils, lime slaw, avocado and cheddar. Spoon over the crema and serve with the remaining lime in wedges.",
  ],
  "coconut-curry": [
    "Rinse the rice and put it in a saucepan with the packet’s recommended amount of water and a pinch of salt. Bring to a boil, cover and cook over low heat for 12 minutes. Remove from the heat and leave covered for 10 minutes.",
    "Peel the sweet potato and cut it into 2 cm cubes. Finely chop the onion, mince the garlic and grate the ginger.",
    "Heat the oil in a deep pan over medium heat. Cook the onion with the salt for 5 minutes until soft. Add the garlic, ginger and curry powder and stir for 1 minute until fragrant.",
    "Add the sweet potato, tomatoes, drained chickpeas, coconut milk and the measured water. Bring to a simmer, partly cover and cook for 16–18 minutes, stirring occasionally, until the sweet potato is tender.",
    "Uncover and simmer for another 3–5 minutes if the sauce needs thickening. Stir in the spinach and cook just until wilted.",
    "Squeeze in half the lime, taste and adjust the salt. Fluff the rice, spoon over the curry and finish with coriander and the remaining lime cut into wedges.",
  ],
  "miso-udon": [
    "Slice the mushrooms and pak choi, keeping the white stems separate from the leaves. Finely chop the garlic, grate the ginger and slice the spring onions, separating the white and green parts.",
    "Heat the neutral oil in a wide saucepan over medium-high heat. Add the mushrooms in a single layer and leave them untouched for 2 minutes, then cook for another 6–7 minutes, stirring occasionally, until deeply browned.",
    "Add the garlic, ginger and white spring-onion slices. Stir for 1 minute until fragrant, then pour in the vegetable stock and bring to a gentle simmer.",
    "Add the pak choi stems and udon. Simmer for 2 minutes, teasing the noodles apart with tongs, then add the leaves and cook for 1 minute more.",
    "Put the miso in a small bowl, whisk in a ladleful of hot broth until smooth, then stir it back into the pan with the soy sauce. Keep the heat low and do not boil once the miso is added.",
    "Taste the broth, adding a splash of water if it is too strong. Finish with sesame oil, green spring-onion slices and sesame seeds, then serve immediately in deep bowls.",
  ],
  ...ADDITIONAL_STEPS,
  ...DESSERT_STEPS,
};

function LeafMark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M31.7 6.6C20.4 7.5 10.2 12.3 9.1 22.2c-.5 4.5 2.8 8.7 7.3 9.3 9.8 1.2 14.7-9.2 15.3-24.9Z" />
      <path d="M8.3 33.4c4.8-8.7 10.6-13.7 18-17.6" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
    </svg>
  );
}

function formatScaledAmount(value: number) {
  const whole = Math.floor(value + 0.0001);
  const decimal = value - whole;
  const fraction = Math.abs(decimal - 0.25) < 0.01
    ? "¼"
    : Math.abs(decimal - 0.5) < 0.01
      ? "½"
      : Math.abs(decimal - 0.75) < 0.01
        ? "¾"
        : "";

  if (fraction) return `${whole || ""}${fraction}`;
  return Number(value.toFixed(2)).toString();
}

function scaleQuantity(quantity: string, portions: number) {
  const match = quantity.match(/^(\d+(?:\.\d+)?|¼|½|¾)(.*)$/u);
  if (!match) return quantity;

  const fractionValues: Record<string, number> = { "¼": 0.25, "½": 0.5, "¾": 0.75 };
  const baseAmount = fractionValues[match[1]] ?? Number(match[1]);
  const suffix = match[2];
  const rawAmount = baseAmount * (portions / 2);
  const scaledAmount = /^\s*(g|ml)\b/.test(suffix) && rawAmount >= 10
    ? Math.round(rawAmount / 5) * 5
    : rawAmount;

  return `${formatScaledAmount(scaledAmount)}${suffix}`;
}

export default function Home() {
  const [pantry, setPantry] = useState<Record<string, PantryState>>(DEFAULT_PANTRY);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"match" | "fastest">("match");
  const [surprise, setSurprise] = useState<string | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);
  const [openSwap, setOpenSwap] = useState<string | null>(null);
  const [pantryReady, setPantryReady] = useState(false);
  const [portions, setPortions] = useState(2);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("pink");
  const [foodMode, setFoodMode] = useState<FoodMode>("savory");

  const have = useMemo(
    () => new Set(Object.keys(pantry).filter((item) => pantry[item] === "have")),
    [pantry],
  );
  const avoid = useMemo(
    () => new Set(Object.keys(pantry).filter((item) => pantry[item] === "avoid")),
    [pantry],
  );

  const activeRecipes = foodMode === "savory" ? SAVORY_RECIPES : DESSERT_RECIPES;
  const pantryIngredients = useMemo(
    () => Array.from(new Set(activeRecipes.flatMap((recipe) => recipe.ingredients))).sort((a, b) => a.localeCompare(b)),
    [activeRecipes],
  );

  const scoredRecipes = useMemo(() => {
    return activeRecipes.map((recipe) => {
      const matched = recipe.ingredients.filter((item) => have.has(item));
      const missing = recipe.ingredients.filter((item) => !have.has(item));
      const blocked = recipe.ingredients.filter((item) => avoid.has(item));
      return { ...recipe, matched, missing, blocked, score: matched.length / recipe.ingredients.length };
    })
      .filter((recipe) => recipe.blocked.length === 0)
      .sort((a, b) => sort === "fastest"
        ? a.time - b.time
        : b.matched.length - a.matched.length || b.score - a.score || a.time - b.time);
  }, [activeRecipes, avoid, have, sort]);

  const visibleIngredients = pantryIngredients.filter((ingredient) =>
    ingredient.includes(query.trim().toLowerCase()),
  );

  const activeRecipe = ALL_RECIPES.find((recipe) => recipe.id === activeRecipeId) ?? null;

  useEffect(() => {
    if (activeRecipeId) setPortions(2);
  }, [activeRecipeId]);

  useEffect(() => {
    const loadSavedPantry = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("pantryful-pantry");
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            setPantry(parsed as Record<string, PantryState>);
          }
        }
      } catch {
        // A blocked or malformed local preference should not prevent recipe matching.
      } finally {
        setPantryReady(true);
      }
    }, 0);
    return () => window.clearTimeout(loadSavedPantry);
  }, []);

  useEffect(() => {
    if (!pantryReady) return;
    try {
      window.localStorage.setItem("pantryful-pantry", JSON.stringify(pantry));
    } catch {
      // Matching still works when storage is unavailable.
    }
  }, [pantry, pantryReady]);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("nicole-color-scheme");
      const initialTheme: ColorScheme = savedTheme === "garden" ? "garden" : "pink";
      setColorScheme(initialTheme);
      document.documentElement.dataset.theme = initialTheme;
    } catch {
      // The theme toggle still works for this visit when storage is unavailable.
    }
  }, []);

  useEffect(() => {
    if (!activeRecipe) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveRecipeId(null);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeRecipe]);


  function switchFoodMode(nextMode: FoodMode) {
    if (nextMode === foodMode) return;
    setFoodMode(nextMode);
    setQuery("");
    setSurprise(null);
    setOpenSwap(null);
    setActiveRecipeId(null);
  }

  function cycleIngredient(ingredient: string) {
    setPantry((current) => {
      const next = { ...current };
      if (!next[ingredient]) next[ingredient] = "have";
      else if (next[ingredient] === "have") next[ingredient] = "avoid";
      else delete next[ingredient];
      return next;
    });
    setSurprise(null);
  }

  function chooseForMe() {
    if (!scoredRecipes.length) return;
    const bestScore = scoredRecipes[0].score;
    const shortlist = scoredRecipes.filter((recipe) => recipe.score >= bestScore - 0.2);
    const choices = shortlist.filter((recipe) => recipe.id !== surprise);
    const pool = choices.length ? choices : shortlist;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setSurprise(picked.id);
    setOpenSwap(null);
    setActiveRecipeId(picked.id);
  }

  function toggleColorScheme() {
    const nextTheme: ColorScheme = colorScheme === "pink" ? "garden" : "pink";
    setColorScheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("nicole-color-scheme", nextTheme);
    } catch {
      // The selected palette remains active for this visit without storage.
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Nicole's birthday gift home">
          <span className="brand-mark"><LeafMark /></span><span>Nicole&apos;s birthday gift</span>
        </a>
        <nav aria-label="Main navigation"><a href="#pantry">My pantry</a><a href="#recipe-results">Recipes</a></nav>
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={colorScheme === "pink"}
          aria-label={`${colorScheme === "pink" ? "Use green" : "Use pink"} color scheme`}
          onClick={toggleColorScheme}
        >
          <span className="theme-toggle-track" aria-hidden="true"><i /></span>
          <span className="theme-toggle-label">Pink palette</span>
        </button>
        <button className="small-surprise" onClick={chooseForMe} type="button" aria-label={`Choose a surprise ${foodMode === "dessert" ? "dessert" : "recipe"}`}><ShuffleIcon /> <span>Surprise me</span></button>
      </header>

      <section className="intro" id="top">
        <div className="eyebrow"><span /> {foodMode === "dessert" ? "Hopefully desserts you actually want to make" : "Hopefully recipes you actually want to cook"}</div>
        <h1>Lets see you not know what<br /><em>{foodMode === "dessert" ? "to bake ever again" : "to cook ever again"}</em></h1>
        <p>{foodMode === "dessert"
          ? "Tell me what’s in your kitchen. I’ll find the desserts you can pull off and clever swaps for what’s missing."
          : "Tell me what’s in your kitchen. I’ll find the vegetarian recipes that fit and clever swaps for what doesn’t."}
        </p>
        <div className="food-switcher" role="group" aria-label="Recipe type">
          <button type="button" className={foodMode === "savory" ? "active" : ""} aria-pressed={foodMode === "savory"} onClick={() => switchFoodMode("savory")}>
            <span aria-hidden="true">◐</span> Savory
          </button>
          <button type="button" className={foodMode === "dessert" ? "active" : ""} aria-pressed={foodMode === "dessert"} onClick={() => switchFoodMode("dessert")}>
            <span aria-hidden="true">✦</span> Desserts
          </button>
        </div>
      </section>

      <section className="pantry-shell" id="pantry">
        <div className="pantry-heading">
          <div><span className="step">01</span><h2>{foodMode === "dessert" ? "What’s in your baking cupboard?" : "What’s in your kitchen?"}</h2><p>Tap once if you have it. Tap twice to mark it missing.</p></div>
          <div className="pantry-count" aria-live="polite"><strong>{pantryIngredients.filter((item) => have.has(item)).length}</strong> have <span>·</span> <strong>{pantryIngredients.filter((item) => avoid.has(item)).length}</strong> don’t have</div>
        </div>

        <div className="pantry-toolbar">
          <label className="ingredient-search">
            <span className="sr-only">Find an ingredient</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an ingredient…" />
          </label>
          <div className="key" aria-label="Ingredient tag key"><span><i className="key-have" /> Have</span><span><i className="key-avoid" /> Don’t have</span></div>
        </div>

        <div className="ingredient-cloud">
          {visibleIngredients.map((ingredient) => {
            const state = pantry[ingredient];
            return (
              <button
                key={ingredient}
                type="button"
                className={`ingredient-pill ${state ?? "neutral"}`}
                onClick={() => cycleIngredient(ingredient)}
                aria-pressed={state === "have"}
                aria-label={`${ingredient}: ${state === "have" ? "have" : state === "avoid" ? "don't have" : "not set"}. Click to change.`}
              >
                {state === "have" && <span>✓</span>}{state === "avoid" && <span>×</span>}{ingredient}
              </button>
            );
          })}
          {!visibleIngredients.length && <p className="no-ingredients">No pantry ingredients match “{query}”.</p>}
        </div>
      </section>

      <section className="decision-strip" aria-labelledby="decision-title">
        <div><span className="decision-kicker">Can’t decide?</span><h2 id="decision-title">{foodMode === "dessert" ? "I don’t know what sweet thing to make." : "I don’t know what to eat."}</h2></div>
        <button type="button" onClick={chooseForMe} disabled={!scoredRecipes.length}><ShuffleIcon /> {foodMode === "dessert" ? "Pick a dessert" : "Choose for me"}</button>
      </section>

      <section className="results" id="recipe-results">
        <div className="results-heading">
          <div><span className="step">02</span><h2>{foodMode === "dessert" ? "Sweet things you can make" : "Cookable right now"}</h2><p>{scoredRecipes.length} {foodMode === "dessert" ? "desserts" : "recipes"} without your missing ingredients.</p></div>
          <label className="sort-control"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as "match" | "fastest")}><option value="match">Best match</option><option value="fastest">Fastest</option></select></label>
        </div>

        {scoredRecipes.length ? (
          <div className="recipe-grid">
            {scoredRecipes.map((recipe, index) => {
              const isSurprise = recipe.id === surprise;
              return (
                <article className={`recipe-card ${isSurprise ? "surprise-pick" : ""}`} key={recipe.id}>
                  <div className={`recipe-art art-${recipe.accent} ${recipe.id === "lemon-butter-beans" ? "has-image" : ""}`}>
                    {recipe.id === "lemon-butter-beans" && <img src="./pantryful-food-hero.png" alt="Creamy butter beans with spinach and tomatoes" />}
                    <span className="recipe-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="recipe-category">{recipe.category}</span>
                    {isSurprise && <span className="picked-label">Tonight’s pick</span>}
                  </div>
                  <div className="recipe-body">
                    <div className="recipe-meta"><span>{recipe.time} min</span><span>{recipe.difficulty}</span></div>
                    <h3>{recipe.title}</h3><p>{recipe.description}</p>
                    <div className="match-row"><strong>{recipe.matched.length}/{recipe.ingredients.length} on hand</strong><span>{recipe.missing.length === 0 ? "You have everything" : `${recipe.missing.length} to find or swap`}</span></div>
                    <div className="mini-ingredients" aria-label="Recipe ingredient match">
                      {recipe.ingredients.slice(0, 4).map((ingredient) => <span className={have.has(ingredient) ? "mini-have" : avoid.has(ingredient) ? "mini-avoid" : "mini-missing"} key={ingredient}>{have.has(ingredient) ? "✓" : avoid.has(ingredient) ? "×" : "+"} {ingredient}</span>)}
                    </div>
                    <button type="button" className="view-recipe" onClick={() => { setOpenSwap(null); setActiveRecipeId(recipe.id); }}>View recipe <span aria-hidden="true">→</span></button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state"><LeafMark /><h3>Every recipe uses something you’ve ruled out.</h3><p>Clear one of your “don’t have” tags and we’ll start matching again.</p></div>
        )}
      </section>

      {activeRecipe && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveRecipeId(null); }}>
          <section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="recipe-modal-title">
            <button className="modal-close" type="button" onClick={() => setActiveRecipeId(null)} aria-label="Close recipe">×</button>
            <div className={`modal-hero art-${activeRecipe.accent}`}>
              {activeRecipe.id === "lemon-butter-beans" && <img src="./pantryful-food-hero.png" alt="Creamy butter beans with spinach and tomatoes" />}
              <div className="modal-hero-copy"><span>{activeRecipe.category}</span><h2 id="recipe-modal-title">{activeRecipe.title}</h2><p>{activeRecipe.time} min · {activeRecipe.difficulty} · Serves {portions}</p></div>
            </div>
            <div className="modal-content">
              <div className="modal-ingredients">
                <div className="serving-control">
                  <div><label htmlFor="portions-slider">Portions</label><output htmlFor="portions-slider" aria-live="polite">{portions}</output></div>
                  <input
                    id="portions-slider"
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={portions}
                    aria-valuetext={`${portions} ${portions === 1 ? "portion" : "portions"}`}
                    onChange={(event) => setPortions(Number(event.target.value))}
                  />
                  <p aria-hidden="true"><span>1</span><span>8</span></p>
                </div>
                <div className="modal-section-title"><span>What you’ll need</span><em>{activeRecipe.ingredients.filter((item) => have.has(item)).length}/{activeRecipe.ingredients.length} matched</em></div>
                <ul>
                  {activeRecipe.ingredients.map((ingredient, index) => {
                    const alternatives = foodMode === "dessert"
                      ? DESSERT_SWAPS[ingredient] ?? SWAPS[ingredient] ?? []
                      : SWAPS[ingredient] ?? DESSERT_SWAPS[ingredient] ?? [];
                    const isOpen = openSwap === ingredient;
                    const baseQuantity = ALL_QUANTITIES[activeRecipe.id]?.[index] ?? "as needed";
                    const quantity = scaleQuantity(baseQuantity, portions);
                    return (
                      <li key={ingredient} className={have.has(ingredient) ? "owned" : avoid.has(ingredient) ? "unavailable" : "needed"}>
                        <div><i>{have.has(ingredient) ? "✓" : avoid.has(ingredient) ? "×" : "+"}</i><span className="ingredient-copy">{ingredient}<small>{quantity}</small></span></div>
                        {alternatives.length > 0 && <button type="button" aria-expanded={isOpen} onClick={() => setOpenSwap(isOpen ? null : ingredient)}>Swap</button>}
                        {isOpen && <p className="swap-note"><strong>Try instead:</strong> {alternatives.join(" or ")}</p>}
                      </li>
                    );
                  })}
                </ul>
                <p className="staples"><strong>Plus pantry staples:</strong> {activeRecipe.staples.map((staple, index) => {
                  const amount = ALL_STAPLE_QUANTITIES[activeRecipe.id]?.[index];
                  return amount ? `${scaleQuantity(amount, portions)} ${staple}` : staple;
                }).join(", ")}.</p>
              </div>
              <div className="modal-method">
                <div className="modal-section-title"><span>Make it</span></div>
                <ol>
                  {(STEPS[activeRecipe.id] ?? []).map((step, index) => <li key={step}><b>{index + 1}</b><p>{step}</p></li>)}
                </ol>
                <div className="cook-note"><span>Dag&apos;s notes</span><p>{ALL_NOTES[activeRecipe.id]}</p></div>
                {RECIPE_SOURCES[activeRecipe.id] && (
                  <p className="recipe-source">Inspired by <a href={RECIPE_SOURCES[activeRecipe.id].url} target="_blank" rel="noreferrer">{RECIPE_SOURCES[activeRecipe.id].label}</a>. Pantryful wording and quantities are adapted for this site.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
