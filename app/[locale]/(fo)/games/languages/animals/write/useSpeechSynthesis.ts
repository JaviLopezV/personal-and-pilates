// useSpeechSynthesis.ts
"use client";

import * as React from "react";

type SpeakOptions = {
  lang?: string; // ej: "en-US", "es-ES"
  rate?: number; // 0.1 - 10 (normal ~1)
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
};

export function useSpeechSynthesis() {
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const [speaking, setSpeaking] = React.useState(false);

  const cancel = React.useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [isSupported]);

  const speak = React.useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!isSupported) return;

      // corta cualquier voz previa para evitar solaparse
      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);
      if (opts.lang) u.lang = opts.lang;
      if (opts.rate != null) u.rate = opts.rate;
      if (opts.pitch != null) u.pitch = opts.pitch;
      if (opts.volume != null) u.volume = opts.volume;

      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(u);
    },
    [isSupported],
  );

  // seguridad: al desmontar componente, cancela
  React.useEffect(() => cancel, [cancel]);

  return { isSupported, speaking, speak, cancel };
}
