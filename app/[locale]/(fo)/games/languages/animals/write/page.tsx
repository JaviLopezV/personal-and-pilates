// AnimalGamesPage.tsx
"use client";

import * as React from "react";
import { Container, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import type { Difficulty, Lang } from "../animalGame.utils";
import { getLanguageLabel } from "../animalGame.utils";
import { useAnimalGame } from "./useAnimalGame";

import { AnimalGameHeader } from "../AnimalGameHeader";
import { AnimalGameProgress } from "../AnimalGameProgress";
import { AnimalGameCard } from "./AnimalGameCard";
import { AnimalGameFinish } from "../AnimalGameFinish";
import { DifficultySelector } from "../DifficultySelector";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

function asDifficulty(x: string | null): Difficulty {
  return x === "easy" || x === "normal" || x === "hard" ? x : "normal";
}

export default function AnimalGamesPage() {
  const t = useTranslations("animalGame");
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();

  const learnLang = (sp.get("lang") as Lang) ?? "en";
  const difficulty = asDifficulty(sp.get("difficulty"));

  const learnLabel = getLanguageLabel(learnLang, locale);
  const game = useAnimalGame(learnLang, difficulty);

  const backToGames = () => router.push("/games");

  const backToAnimals = () =>
    router.push(`/games/languages/animals?lang=${learnLang.toString()}`);

  const setDifficulty = (d: Difficulty) => {
    // reconstruimos query conservando lang
    const params = new URLSearchParams(sp.toString());
    params.set("lang", learnLang);
    params.set("difficulty", d);
    router.push(`/games/languages/animals/write?${params.toString()}`);
  };

  const helperText =
    game.status === "correct"
      ? t("helperCorrect")
      : game.status === "wrong"
        ? t("helperWrong")
        : t("helperIdle");

  const feedbackKey =
    game.accuracy >= 80 ? "high" : game.accuracy >= 50 ? "medium" : "low";
  const feedbackSeverity =
    game.accuracy >= 80 ? "success" : game.accuracy >= 50 ? "info" : "warning";

  const difficultyLabel =
    difficulty === "easy"
      ? t("difficulty.easy")
      : difficulty === "normal"
        ? t("difficulty.normal")
        : t("difficulty.hard");

  const subtitle = `${t("languageChosen")} ${learnLabel} · ${t("difficulty.label")} ${difficultyLabel}`;

  // ... dentro del componente:
  const tts = useSpeechSynthesis();

  const speakLang = learnLang === "es" ? "es-ES" : "en-US";

  const speakCurrentAnimal = () => {
    if (!game.current) return;
    // lee la palabra que el usuario debe escribir
    tts.speak(game.expected, { lang: speakLang, rate: 0.95 });
  };

  if (game.finished) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <AnimalGameFinish
          title={t("title")}
          backLabel={t("finish.back")}
          onBack={backToGames}
          backToAnimals={backToAnimals}
          finishTitle={t("finish.title")}
          languageChosenText={subtitle}
          correctLabel={t("finish.correct")}
          wrongLabel={t("finish.wrong")}
          accuracyLabel={t("finish.accuracy")}
          correctCount={game.correctCount}
          wrongCount={game.wrongCount}
          accuracy={game.accuracy}
          feedbackText={t(`finish.feedback.${feedbackKey}`)}
          feedbackSeverity={feedbackSeverity}
          playAgainLabel={t("finish.playAgain")}
          onPlayAgain={game.resetGame}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <AnimalGameHeader
          title={t("title")}
          subtitle={subtitle}
          onBack={backToAnimals}
          onReset={game.resetGame}
          backAriaLabel={t("finish.back")}
          resetAriaLabel={t("finish.playAgain")}
        />

        <DifficultySelector
          label={t("difficulty.label")}
          value={difficulty}
          onChange={setDifficulty}
          easyLabel={t("difficulty.easy")}
          normalLabel={t("difficulty.normal")}
          hardLabel={t("difficulty.hard")}
        />

        <AnimalGameProgress
          value={game.progress}
          indexLabel={`${game.index + 1} / ${game.total}`}
        />

        {game.current && (
          <AnimalGameCard
            animal={game.current}
            learnLabel={learnLabel}
            writePrompt={t("writeWord")}
            answerLabel={t("answerLabel")}
            checkLabel={t("check")}
            skipLabel={t("skip")}
            value={game.value}
            onChange={game.setValue}
            onEnter={game.check}
            helperText={helperText}
            showCorrectAnswer={game.status === "wrong" && game.showAnswer}
            correctAnswerText={t("correctAnswer") + " " + game.expected}
            onCheck={game.check}
            onSkip={game.skip}
            footerText={`${t("finish.correct")}: ${game.correctCount} · ${t("finish.wrong")}: ${game.wrongCount}`}
            onSpeak={speakCurrentAnimal}
            speakDisabled={!tts.isSupported}
            speakAriaLabel={t("speak")}
            speakTooltip={
              !tts.isSupported ? t("speechNotSupported") : t("speak")
            }
          />
        )}
      </Stack>
    </Container>
  );
}
