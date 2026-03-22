"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TypeWriterProps = {
  words: string[];
};

export function TypeWriter({ words }: TypeWriterProps) {
  const reduced = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const longestWord = words.reduce((max, word) => (word.length > max.length ? word : max), words[0] ?? "");
  const maxChars = Math.max(longestWord.length, 28);

  useEffect(() => {
    if (reduced) return;
    const word = words[wordIndex] ?? "";
    const delay =
      !deleting && charIndex === word.length ? 1500 : deleting && charIndex === 0 ? 500 : deleting ? 38 : 72;

    const timeout = setTimeout(
      () => {
        if (!deleting && charIndex < word.length) {
          setCharIndex((prev) => prev + 1);
          return;
        }
        if (!deleting && charIndex === word.length) {
          setDeleting(true);
          return;
        }
        if (deleting && charIndex > 0) {
          setCharIndex((prev) => prev - 1);
          return;
        }
        if (deleting && charIndex === 0) {
          setDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      },
      delay,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, reduced]);

  const current = reduced ? words[0] ?? "" : (words[wordIndex] ?? "").slice(0, charIndex);

  return (
    <span className="typewriter-container font-mono text-[var(--accent-2)]" style={{ ["--typewriter-ch" as string]: String(maxChars) }}>
      <span className="typewriter-sizer" aria-hidden>
        {longestWord}
      </span>
      <span className="typewriter-text">
        {current}
        <span className="typewriter-cursor" aria-hidden />
      </span>
    </span>
  );
}
