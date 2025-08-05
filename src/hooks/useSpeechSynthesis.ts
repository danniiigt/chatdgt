"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LOCALE } from "@/lib/constants";

export const useSpeechSynthesis = () => {
  // Third party hooks
  const pathname = usePathname();

  // State
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);

  // Helpers / Functions
  const getSpeechLanguage = (locale: string) => {
    const speechLanguageMap: Record<string, string> = {
      [LOCALE.ES]: "es-ES",
      [LOCALE.EN]: "en-US",
    };
    return speechLanguageMap[locale] || "es-ES";
  };

  const speakText = async (text: string, messageId: string) => {
    if (!text || !(window && "speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported");
      return;
    }

    const isSpeaking = currentSpeakingId === messageId;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setCurrentSpeakingId(null);
      return;
    }

    // Cancel any other speaking message
    if (currentSpeakingId) {
      window.speechSynthesis.cancel();
    }

    const currentLocale = pathname.split("/")[1] || LOCALE.ES;
    const speechLanguage = getSpeechLanguage(currentLocale);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setCurrentSpeakingId(messageId);
    utterance.onend = () => setCurrentSpeakingId(null);
    utterance.onerror = () => setCurrentSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setCurrentSpeakingId(null);
    }
  };

  return {
    currentSpeakingId,
    speakText,
    stopSpeaking,
  };
};