// useAnimalGame.ts
"use client";

import * as React from "react";
import { ANIMALS, type Animal } from "../animalGame.data";
import { DIFFICULTY_SIZES, normalizeWord, shuffle, type Difficulty, type Lang } from "../animalGame.utils";

type Status = "idle" | "correct" | "wrong";

function buildDeck(pool: Animal[], difficulty: Difficulty) {
  const size = DIFFICULTY_SIZES[difficulty];
  // Si el pool es menor que el size, no rompe: coge lo que haya
  return shuffle(pool).slice(0, Math.min(size, pool.length));
}

export function useAnimalGame(learnLang: Lang, difficulty: Difficulty) {
  const pool = ANIMALS;

  const [deck, setDeck] = React.useState<Animal[]>(() => buildDeck(pool, difficulty));
  const [index, setIndex] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [wrongCount, setWrongCount] = React.useState(0);

  // Si cambia la dificultad, reiniciamos el juego con nuevo deck
  React.useEffect(() => {
    setDeck(buildDeck(pool, difficulty));
    setIndex(0);
    setValue("");
    setStatus("idle");
    setShowAnswer(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, [difficulty]); // pool es constante (ANIMALS), no hace falta meterlo

  const total = deck.length;
  const finished = index >= total;
  const current = finished ? null : deck[index];
  const expected = current ? current[learnLang] : "";
  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  const resetGame = React.useCallback(() => {
    setDeck(buildDeck(pool, difficulty));
    setIndex(0);
    setValue("");
    setStatus("idle");
    setShowAnswer(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, [difficulty]);

  const next = React.useCallback(() => {
    setIndex((prev) => prev + 1);
    setValue("");
    setStatus("idle");
    setShowAnswer(false);
  }, []);

  const check = React.useCallback(() => {
    if (!current) return;
    const ok = normalizeWord(value) === normalizeWord(expected);

    if (ok) {
      setStatus("correct");
      setCorrectCount((c) => c + 1);
      window.setTimeout(() => next(), 600);
    } else {
      setStatus("wrong");
      setWrongCount((w) => w + 1);
      setShowAnswer(true);
    }
  }, [current, expected, next, value]);

  const skip = React.useCallback(() => {
    setWrongCount((w) => w + 1);
    next();
  }, [next]);

  const attempts = correctCount + wrongCount;
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;

  return {
    // estado
    difficulty,
    deck,
    index,
    total,
    finished,
    current,
    expected,
    value,
    status,
    showAnswer,
    correctCount,
    wrongCount,
    progress,
    accuracy,

    // acciones
    setValue: (v: string) => {
      setValue(v);
      setStatus("idle");
      setShowAnswer(false);
    },
    resetGame,
    check,
    skip,
  };
}
