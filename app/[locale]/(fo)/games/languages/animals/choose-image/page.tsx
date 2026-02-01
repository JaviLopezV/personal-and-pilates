// ChooseImageGamePage.tsx
"use client";

import * as React from "react";
import { Container, Stack } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import type { Difficulty, Lang } from "../animalGame.utils";
import { getLanguageLabel } from "../animalGame.utils";

import { useChooseImageGame } from "./useChooseImageGame";
import { AnimalGameHeader } from "../AnimalGameHeader";
import { AnimalGameProgress } from "../AnimalGameProgress";
import { AnimalGameFinish } from "../AnimalGameFinish";
import { DifficultySelector } from "../DifficultySelector";
import { ChooseImageCard } from "./ChooseImageCard";

function asDifficulty(x: string | null): Difficulty {
  return x === "easy" || x === "normal" || x === "hard" ? x : "normal";
}

export default function ChooseImageGamePage() {
  const t = useTranslations("animalGame"); // puedes crear namespace nuevo si quieres
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();

  const learnLang = (sp.get("lang") as Lang) ?? "en";
  const difficulty = asDifficulty(sp.get("difficulty"));

  const learnLabel = getLanguageLabel(learnLang, locale);
  const game = useChooseImageGame(learnLang, difficulty);

  const backToGames = () => router.push("/games");

  const backToAnimals = () =>
    router.push(`/games/languages/animals?lang=${learnLang.toString()}`);

  const setDifficulty = (d: Difficulty) => {
    const params = new URLSearchParams(sp.toString());
    params.set("lang", learnLang);
    params.set("difficulty", d);
    router.push(`/games/languages/animals/choose-image?${params.toString()}`);
  };

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

  if (game.finished) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <AnimalGameFinish
          title={t("titleChooseImage")}
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
          title={t("titleChooseImage")}
          subtitle={subtitle}
          onBack={backToGames}
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
          <ChooseImageCard
            promptTitle={t("chooseImage.prompt")}
            promptWord={game.promptWord}
            options={game.options}
            onPick={game.pick}
            locked={game.locked}
            status={game.status}
            correctId={game.current.id}
            footerText={`${t("finish.correct")}: ${game.correctCount} · ${t("finish.wrong")}: ${game.wrongCount}`}
          />
        )}
      </Stack>
    </Container>
  );
}
