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
    <div className="w-full max-w-[700px] mx-auto fade-in-up">
      {/* Main WPM display */}
      <div className="text-center mb-12">
        <div
          className="text-8xl font-bold tabular-nums mb-2"
          style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}
        >
          {wpm}
        </div>
        <div className="text-lg uppercase tracking-[0.3em]" style={{ color: "var(--text-dim)" }}>
          wpm
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        <StatBox label="raw" value={rawWpm.toString()} />
        <StatBox label="accuracy" value={`${accuracy}%`} />
        <StatBox label="characters" value={`${correctChars}/${incorrectChars}`} subLabel={`of ${totalChars}`} />
        <StatBox label="time" value={`${timeElapsed}s`} />
      </div>

      {/* Restart button */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-3 px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--accent)",
            border: "1px solid var(--border)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          restart test
        </button>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  subLabel,
}: {
  label: string;
  value: string;
  subLabel?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className="text-xs uppercase tracking-[0.2em] mb-2"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold tabular-nums"
        style={{ color: "var(--accent)", fontFamily: "var(--font-geist-mono)" }}
      >
        {value}
      </div>
      {subLabel && (
        <div className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
          {subLabel}
        </div>
      )}
    </div>
  );
}
