// animalGame.utils.ts
export type Lang = "es" | "en";
export type Difficulty = "easy" | "normal" | "hard";

export const DIFFICULTY_SIZES: Record<Difficulty, number> = {
  easy: 5,
  normal: 10,
  hard: 20,
};

export function normalizeWord(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getLanguageLabel(lang: Lang, locale: string) {
  try {
    const dn = new Intl.DisplayNames([locale], { type: "language" });
    const label = dn.of(lang) ?? lang;
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch {
    return lang;
  }
}

export function getDifficultyLabel(d: Difficulty) {
  // lo dejo simple; si quieres, lo pasamos a next-intl
  return d === "easy" ? "Fácil" : d === "normal" ? "Normal" : "Difícil";
}


// animalGame.utils.ts (añade esto)
export const DIFFICULTY_OPTION_COUNT: Record<Difficulty, number> = {
  easy: 2,
  normal: 4,
  hard: 6,
};
