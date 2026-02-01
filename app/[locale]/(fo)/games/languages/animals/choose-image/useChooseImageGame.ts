// useChooseImageGame.ts
"use client";

import * as React from "react";
import { ANIMALS, type Animal } from "../animalGame.data";
import {
  DIFFICULTY_OPTION_COUNT,
  DIFFICULTY_SIZES,
  shuffle,
  type Difficulty,
  type Lang,
} from "../animalGame.utils";

type Status = "idle" | "correct" | "wrong";

function buildDeck(pool: Animal[], difficulty: Difficulty) {
  const size = DIFFICULTY_SIZES[difficulty];
  return shuffle(pool).slice(0, Math.min(size, pool.length));
}

function buildOptions(pool: Animal[], correct: Animal, optionCount: number) {
  const others = pool.filter((a) => a.id !== correct.id);
  const picks = shuffle(others).slice(0, Math.max(0, optionCount - 1));
  return shuffle([correct, ...picks]);
}

export function useChooseImageGame(learnLang: Lang, difficulty: Difficulty) {
  const pool = ANIMALS;

  const [deck, setDeck] = React.useState<Animal[]>(() => buildDeck(pool, difficulty));
  const [index, setIndex] = React.useState(0);

  const [status, setStatus] = React.useState<Status>("idle");
  const [locked, setLocked] = React.useState(false);

  const [correctCount, setCorrectCount] = React.useState(0);
  const [wrongCount, setWrongCount] = React.useState(0);

  // Reset automático al cambiar dificultad
  React.useEffect(() => {
    setDeck(buildDeck(pool, difficulty));
    setIndex(0);
    setStatus("idle");
    setLocked(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, [difficulty]);

  const total = deck.length;
  const finished = index >= total;

  const current = finished ? null : deck[index];
  const promptWord = current ? current[learnLang] : ""; // la palabra que mostramos
  const optionCount = Math.min(DIFFICULTY_OPTION_COUNT[difficulty], pool.length);

  const options = React.useMemo(() => {
    if (!current) return [];
    return buildOptions(pool, current, optionCount);
  }, [current, optionCount]);

  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  const resetGame = React.useCallback(() => {
    setDeck(buildDeck(pool, difficulty));
    setIndex(0);
    setStatus("idle");
    setLocked(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, [difficulty]);

  const next = React.useCallback(() => {
    setIndex((p) => p + 1);
    setStatus("idle");
    setLocked(false);
  }, []);

  const pick = React.useCallback(
    (pickedId: string) => {
      if (!current || locked) return;

      const ok = pickedId === current.id;
      setLocked(true);

      if (ok) {
        setStatus("correct");
        setCorrectCount((c) => c + 1);
        window.setTimeout(() => next(), 500);
      } else {
        setStatus("wrong");
        setWrongCount((w) => w + 1);
        // también avanzamos, pero un pelín más tarde para que se vea el feedback
        window.setTimeout(() => next(), 900);
      }
    },
    [current, locked, next],
  );

  const attempts = correctCount + wrongCount;
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;

  return {
    difficulty,
    deck,
    index,
    total,
    finished,
    current,
    promptWord,
    options,
    optionCount,
    status,
    locked,
    correctCount,
    wrongCount,
    progress,
    accuracy,
    resetGame,
    pick,
  };
}
