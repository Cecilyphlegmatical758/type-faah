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

export default function Results({
  wpm,
  rawWpm,
  accuracy,
  correctChars,
  incorrectChars,
  totalChars,
  timeElapsed,
  onRestart,
}: ResultsProps) {
  return (
    <div className="w-full max-w-[800px] mx-auto fade-in-up">
      {/* Main WPM */}
      <div className="text-center mb-16">
        <div
          className="text-[120px] font-extralight tabular-nums leading-none mb-2"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-geist-mono)",
            textShadow: "0 0 80px color-mix(in srgb, var(--accent) 25%, transparent)",
          }}
        >
          {wpm}
        </div>
        <div
          className="text-[13px] uppercase tracking-[0.5em] font-medium"
          style={{ color: "var(--text-dim)" }}
        >
          words per minute
        </div>
      </div>

      {/* Stats - two rows for better layout */}
      <div className="grid grid-cols-2 gap-5 max-w-[520px] mx-auto mb-16">
        <StatCard label="raw wpm" value={rawWpm.toString()} delay={0} />
        <StatCard label="accuracy" value={`${accuracy}%`} delay={1} accent={accuracy >= 95} />
        <StatCard
          label="correct / errors"
          value={`${correctChars}`}
          sub={`/ ${incorrectChars}`}
          detail={`${totalChars} total`}
          delay={2}
        />
        <StatCard label="time" value={`${timeElapsed}s`} delay={3} />
      </div>

      {/* Restart */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onRestart}
          className="group flex items-center gap-3 px-10 py-4 rounded-2xl text-[14px] font-medium tracking-wider transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--accent)",
            border: "1px solid var(--border)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
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
            className="transition-transform duration-500 group-hover:rotate-[-180deg]"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          restart test
        </button>
        <span
          className="text-[11px] tracking-[0.2em] uppercase"
          style={{ color: "var(--text-dim)", opacity: 0.4 }}
        >
          tab + enter
        </span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  detail,
  delay,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  detail?: string;
  delay: number;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-6 fade-in-up"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        animationDelay: `${delay * 0.08 + 0.15}s`,
        animationFillMode: "both",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.3em] mb-4 font-medium"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <div
          className="text-[32px] font-bold tabular-nums leading-none"
          style={{
            color: accent ? "var(--text-correct)" : "var(--accent)",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          {value}
        </div>
        {sub && (
          <span
            className="text-[18px] font-light tabular-nums"
            style={{ color: "var(--text-dim)", fontFamily: "var(--font-geist-mono)" }}
          >
            {sub}
          </span>
        )}
      </div>
      {detail && (
        <div
          className="text-[11px] mt-2 tracking-wide"
          style={{ color: "var(--text-dim)", opacity: 0.6 }}
        >
          {detail}
        </div>
      )}
    </div>
  );
}
