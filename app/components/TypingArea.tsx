"use client";

import React, { useEffect, useRef, useMemo } from "react";

interface TypingAreaProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedChars: { char: string; correct: boolean }[][];
  isFocused: boolean;
  onFocus: () => void;
  timeLeft: number | null;
  timerDuration: number;
  isRunning: boolean;
}

export default function TypingArea({
  words,
  currentWordIndex,
  currentCharIndex,
  typedChars,
  isFocused,
  onFocus,
  timeLeft,
  timerDuration,
  isRunning,
}: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Scroll to keep active word visible
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const wordEl = activeWordRef.current;
      const containerEl = containerRef.current;
      const wordTop = wordEl.offsetTop;
      const containerScroll = containerEl.scrollTop;
      const containerHeight = containerEl.clientHeight;

      if (wordTop > containerScroll + containerHeight - 60) {
        containerEl.scrollTo({
          top: wordTop - 40,
          behavior: "smooth",
        });
      }
    }
  }, [currentWordIndex]);

  // Memoize the visible words range to avoid re-rendering too many words
  const visibleRange = useMemo(() => {
    const start = Math.max(0, currentWordIndex - 30);
    const end = Math.min(words.length, currentWordIndex + 60);
    return { start, end };
  }, [currentWordIndex, words.length]);

  return (
    <div className="relative w-full max-w-[900px] mx-auto px-4">
      {/* Timer display */}
      {timerDuration > 0 && (
        <div
          className="text-5xl font-light mb-6 tabular-nums"
          style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}
        >
          {timeLeft !== null ? timeLeft : timerDuration}
        </div>
      )}

      {/* Typing area */}
      <div
        ref={containerRef}
        onClick={onFocus}
        className="relative h-[120px] overflow-hidden cursor-text"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 70%, transparent 100%)",
        }}
      >
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-2xl leading-relaxed font-mono">
          {words.slice(visibleRange.start, visibleRange.end).map((word, idx) => {
            const actualIdx = visibleRange.start + idx;
            const isCurrentWord = actualIdx === currentWordIndex;
            const isTypedWord = actualIdx < currentWordIndex;
            const wordTyped = typedChars[actualIdx] || [];

            return (
              <span
                key={actualIdx}
                ref={isCurrentWord ? activeWordRef : null}
                className="relative inline-block"
              >
                {word.split("").map((char, charIdx) => {
                  let color = "var(--text-dim)";
                  let className = "";

                  if (isTypedWord || (isCurrentWord && charIdx < currentCharIndex)) {
                    const typedChar = wordTyped[charIdx];
                    if (typedChar) {
                      color = typedChar.correct
                        ? "var(--text-correct)"
                        : "var(--text-error)";
                      if (!typedChar.correct) {
                        className = "underline decoration-2 underline-offset-4";
                      }
                    }
                  }

                  // Show cursor
                  const showCursor =
                    isFocused &&
                    isCurrentWord &&
                    charIdx === currentCharIndex &&
                    !isTypedWord;

                  return (
                    <span key={charIdx} className="relative">
                      {showCursor && (
                        <span
                          className="absolute left-0 top-0 h-full w-[2px] cursor-blink -translate-x-[1px]"
                          style={{ backgroundColor: "var(--cursor)" }}
                        />
                      )}
                      <span
                        className={`transition-colors duration-100 ${className}`}
                        style={{ color }}
                      >
                        {char}
                      </span>
                    </span>
                  );
                })}
                {/* Extra typed characters beyond word length */}
                {wordTyped.slice(word.length).map((typed, extraIdx) => (
                  <span
                    key={`extra-${extraIdx}`}
                    className="underline decoration-2 underline-offset-4"
                    style={{ color: "var(--text-error)" }}
                  >
                    {typed.char}
                  </span>
                ))}
                {/* Cursor at end of word */}
                {isFocused &&
                  isCurrentWord &&
                  currentCharIndex >= word.length &&
                  currentCharIndex === wordTyped.length && (
                    <span
                      className="absolute h-full w-[2px] cursor-blink"
                      style={{
                        backgroundColor: "var(--cursor)",
                        right: "-1px",
                        top: 0,
                      }}
                    />
                  )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Focus overlay */}
      {!isFocused && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl cursor-pointer"
          onClick={onFocus}
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="px-6 py-3 rounded-xl text-sm font-medium focus-pulse"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-dim)",
            }}
          >
            click or press any key to focus
          </div>
        </div>
      )}

      {/* Restart hint */}
      {isRunning && (
        <div
          className="flex items-center justify-center gap-2 mt-8 text-sm"
          style={{ color: "var(--text-dim)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          <span>tab+enter or cmd+enter to restart</span>
        </div>
      )}
    </div>
  );
}
