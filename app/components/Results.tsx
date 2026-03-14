"use client";

import React from "react";

interface ResultsProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
  onRestart: () => void;
}

function getAchievement(wpm: number, accuracy: number) {
  if (wpm > 100 && accuracy >= 95)
    return { emoji: "\uD83D\uDC51", title: "TYPING GOD", sub: "Bhai tu toh keyboard ka baap hai", color: "var(--accent)" };
  if (wpm > 80)
    return { emoji: "\uD83D\uDD25", title: "EK JHAAT BHAR KA AADMI", sub: "Speed demon - fingers on fire!", color: "var(--text-correct)" };
  if (wpm >= 65)
    return { emoji: "\u26A1", title: "ALAG HI LEVEL KA BANDA", sub: "Matlab wo speed thi bhai... respect", color: "var(--accent)" };
  if (wpm >= 45)
    return { emoji: "\uD83D\uDCAA", title: "THEEK THAAK HAI", sub: "Average hai bhai, thoda aur practice kar", color: "var(--text-dim)" };
  if (wpm >= 25)
    return { emoji: "\uD83D\uDC22", title: "NIKAL JAO", sub: "Mere lode ke samne se nikal jao bhai", color: "var(--text-error)" };
  return { emoji: "\uD83D\uDC80", title: "KYA THA YE?", sub: "Bhai keyboard dekh ke type kar", color: "var(--text-error)" };
}

export default function Results({
  wpm,
  rawWpm,
  accuracy,
  correctChars,
  incorrectChars,
  timeElapsed,
  onRestart,
}: ResultsProps) {
  const achievement = getAchievement(wpm, accuracy);

  return (
    <div className="w-full flex flex-col items-center fade-in-up px-4">
      {/* Achievement badge */}
      <div className="text-center mb-6">
        <div className="text-[48px] leading-none mb-2">{achievement.emoji}</div>
        <div
          className="text-[13px] uppercase tracking-[0.3em] font-bold"
          style={{ color: achievement.color }}
        >
          {achievement.title}
        </div>
        <div
          className="text-[12px] mt-1.5 tracking-wide"
          style={{ color: "var(--text-dim)" }}
        >
          {achievement.sub}
        </div>
      </div>

      {/* Big WPM */}
      <div
        className="text-[120px] font-extralight tabular-nums leading-none"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        {wpm}
      </div>
      <div
        className="text-[11px] uppercase tracking-[0.45em] font-medium mt-3 mb-16"
        style={{ color: "var(--text-dim)" }}
      >
        words per minute
      </div>

      {/* Stats grid */}
      <div
        className="grid grid-cols-4 w-full mb-16"
        style={{ maxWidth: "560px" }}
      >
        <div className="text-center py-1">
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: "var(--text-dim)" }}>raw</div>
          <div className="text-[26px] font-bold tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{rawWpm}</div>
        </div>
        <div className="text-center py-1" style={{ borderLeft: "1px solid var(--border)" }}>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: "var(--text-dim)" }}>accuracy</div>
          <div className="text-[26px] font-bold tabular-nums" style={{ color: accuracy >= 90 ? "var(--text-correct)" : "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{accuracy}%</div>
        </div>
        <div className="text-center py-1" style={{ borderLeft: "1px solid var(--border)" }}>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: "var(--text-dim)" }}>correct/err</div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-[26px] font-bold tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{correctChars}</span>
            <span className="text-[14px] tabular-nums" style={{ color: "var(--text-dim)", fontFamily: "var(--font-geist-mono)" }}>/{incorrectChars}</span>
          </div>
        </div>
        <div className="text-center py-1" style={{ borderLeft: "1px solid var(--border)" }}>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: "var(--text-dim)" }}>time</div>
          <div className="text-[26px] font-bold tabular-nums" style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}>{timeElapsed}s</div>
        </div>
      </div>

      {/* Sound info */}
      <div
        className="text-center mb-10 rounded-xl px-5 py-3"
        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-1" style={{ color: "var(--text-dim)" }}>
          Sound reward
        </div>
        <div className="text-[11px] tracking-wide" style={{ color: "var(--text)", opacity: 0.7 }}>
          {wpm > 80
            ? "\uD83D\uDD0A Ek jhaat bhar ka aadmi"
            : wpm >= 65
            ? "\uD83D\uDD0A Alag hi level ka banda tha"
            : "\uD83D\uDD0A Nikal jao mere lode ke samne se"}
        </div>
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="group flex items-center gap-3 rounded-xl text-[14px] font-medium tracking-wide transition-all duration-300 hover:scale-[1.04] active:scale-[0.96]"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--accent)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          padding: "12px 24px",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover:rotate-[-180deg]">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
        </svg>
        Restart Test
      </button>
      <div className="mt-3 text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-dim)", opacity: 0.3 }}>
        tab + enter
      </div>
    </div>
  );
}
