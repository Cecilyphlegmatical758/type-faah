"use client";

import React from "react";

const themes = [
  { id: "default", color: "#a7c4a0", label: "Sage" },
  { id: "ocean", color: "#34495e", label: "Ocean" },
  { id: "lavender", color: "#7c4dff", label: "Lavender" },
  { id: "rose", color: "#f48fb1", label: "Rose" },
  { id: "coral", color: "#ff7043", label: "Coral" },
  { id: "amber", color: "#ffd54f", label: "Amber" },
];

const timerOptions = [15, 30, 60, 120];

interface HeaderProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  currentTimer: number;
  onTimerChange: (time: number) => void;
  isRunning: boolean;
}

export default function Header({
  currentTheme,
  onThemeChange,
  currentTimer,
  onTimerChange,
  isRunning,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto w-full">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--accent)" }}
        >
          keyb
        </span>
        <span className="text-2xl font-light" style={{ color: "var(--text-dim)" }}>
          /
        </span>
        <span
          className="text-2xl font-light tracking-wide"
          style={{ color: "var(--text-dim)" }}
        >
          type
        </span>
      </div>

      {/* Center: Theme dots + Timer */}
      <div className="flex items-center gap-8">
        {/* Theme dots */}
        <div className="flex items-center gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className="relative w-5 h-5 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none"
              style={{
                backgroundColor: theme.color,
                boxShadow:
                  currentTheme === theme.id
                    ? `0 0 0 2px var(--bg), 0 0 0 4px ${theme.color}`
                    : "none",
              }}
              title={theme.label}
              aria-label={`Switch to ${theme.label} theme`}
            />
          ))}
        </div>

        {/* Timer selector */}
        <div
          className="flex items-center rounded-xl px-1 py-1 gap-1"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {timerOptions.map((time) => (
            <button
              key={time}
              onClick={() => !isRunning && onTimerChange(time)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isRunning ? "cursor-default" : "cursor-pointer"
              }`}
              style={{
                backgroundColor:
                  currentTimer === time ? "var(--bg-card)" : "transparent",
                color:
                  currentTimer === time ? "var(--accent)" : "var(--text-dim)",
                boxShadow:
                  currentTimer === time
                    ? "0 2px 8px rgba(0,0,0,0.2)"
                    : "none",
              }}
              disabled={isRunning}
            >
              {time}s
            </button>
          ))}
          <button
            onClick={() => !isRunning && onTimerChange(0)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isRunning ? "cursor-default" : "cursor-pointer"
            }`}
            style={{
              backgroundColor:
                currentTimer === 0 ? "var(--bg-card)" : "transparent",
              color: currentTimer === 0 ? "var(--accent)" : "var(--text-dim)",
              boxShadow:
                currentTimer === 0 ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
            }}
            disabled={isRunning}
          >
            &infin;
          </button>
        </div>
      </div>

      {/* Right side placeholder for balance */}
      <div className="w-[120px]" />
    </header>
  );
}
