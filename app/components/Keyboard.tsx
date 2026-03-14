"use client";

import React from "react";

interface KeyboardProps {
  pressedKeys: Set<string>;
}

interface KeyConfig {
  key: string;
  label?: string;
  subLabel?: string;
  width?: number;
}

const keyboardRows: KeyConfig[][] = [
  // Function row
  [
    { key: "Escape", label: "esc", width: 1.2 },
    { key: "F1", label: "F1" },
    { key: "F2", label: "F2" },
    { key: "F3", label: "F3" },
    { key: "F4", label: "F4" },
    { key: "F5", label: "F5" },
    { key: "F6", label: "F6" },
    { key: "F7", label: "F7" },
    { key: "F8", label: "F8" },
    { key: "F9", label: "F9" },
    { key: "F10", label: "F10" },
    { key: "F11", label: "F11" },
    { key: "F12", label: "F12" },
    { key: "Delete", label: "del" },
  ],
  // Number row
  [
    { key: "Backquote", label: "~", subLabel: "`" },
    { key: "Digit1", label: "!", subLabel: "1" },
    { key: "Digit2", label: "@", subLabel: "2" },
    { key: "Digit3", label: "#", subLabel: "3" },
    { key: "Digit4", label: "$", subLabel: "4" },
    { key: "Digit5", label: "%", subLabel: "5" },
    { key: "Digit6", label: "^", subLabel: "6" },
    { key: "Digit7", label: "&", subLabel: "7" },
    { key: "Digit8", label: "*", subLabel: "8" },
    { key: "Digit9", label: "(", subLabel: "9" },
    { key: "Digit0", label: ")", subLabel: "0" },
    { key: "Minus", label: "_", subLabel: "-" },
    { key: "Equal", label: "+", subLabel: "=" },
    { key: "Backspace", label: "\u2190", width: 1.6 },
  ],
  // QWERTY row
  [
    { key: "Tab", label: "tab", width: 1.6 },
    { key: "KeyQ", label: "Q" },
    { key: "KeyW", label: "W" },
    { key: "KeyE", label: "E" },
    { key: "KeyR", label: "R" },
    { key: "KeyT", label: "T" },
    { key: "KeyY", label: "Y" },
    { key: "KeyU", label: "U" },
    { key: "KeyI", label: "I" },
    { key: "KeyO", label: "O" },
    { key: "KeyP", label: "P" },
    { key: "BracketLeft", label: "{", subLabel: "[" },
    { key: "BracketRight", label: "}", subLabel: "]" },
    { key: "Backslash", label: "|", subLabel: "\\" },
  ],
  // Home row
  [
    { key: "CapsLock", label: "caps lock", width: 1.9 },
    { key: "KeyA", label: "A" },
    { key: "KeyS", label: "S" },
    { key: "KeyD", label: "D" },
    { key: "KeyF", label: "F" },
    { key: "KeyG", label: "G" },
    { key: "KeyH", label: "H" },
    { key: "KeyJ", label: "J" },
    { key: "KeyK", label: "K" },
    { key: "KeyL", label: "L" },
    { key: "Semicolon", label: ":", subLabel: ";" },
    { key: "Quote", label: '"', subLabel: "'" },
    { key: "Enter", label: "return", width: 1.9 },
  ],
  // Bottom row
  [
    { key: "ShiftLeft", label: "shift", width: 2.4 },
    { key: "KeyZ", label: "Z" },
    { key: "KeyX", label: "X" },
    { key: "KeyC", label: "C" },
    { key: "KeyV", label: "V" },
    { key: "KeyB", label: "B" },
    { key: "KeyN", label: "N" },
    { key: "KeyM", label: "M" },
    { key: "Comma", label: "<", subLabel: "," },
    { key: "Period", label: ">", subLabel: "." },
    { key: "Slash", label: "?", subLabel: "/" },
    { key: "ShiftRight", label: "shift", width: 2.4 },
  ],
  // Space row
  [
    { key: "ControlLeft", label: "ctrl", width: 1.3 },
    { key: "AltLeft", label: "opt", width: 1.3 },
    { key: "MetaLeft", label: "cmd", width: 1.3 },
    { key: "Space", label: "", width: 6 },
    { key: "MetaRight", label: "cmd", width: 1.3 },
    { key: "AltRight", label: "opt", width: 1.3 },
    { key: "ControlRight", label: "ctrl", width: 1.3 },
  ],
];

// Keys that get accent color styling
const accentKeys = new Set([
  "Escape",
  "Tab",
  "CapsLock",
  "ShiftLeft",
  "ShiftRight",
  "Enter",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "MetaLeft",
  "MetaRight",
]);

// Keys that get alt color styling
const altKeys = new Set([
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",
  "Delete", "Backspace",
  "Backquote", "BracketLeft", "BracketRight", "Backslash",
  "Semicolon", "Quote", "Comma", "Period", "Slash",
  "Minus", "Equal",
]);

function getKeyStyle(keyCode: string, isPressed: boolean) {
  const isAccent = accentKeys.has(keyCode);
  const isAlt = altKeys.has(keyCode);

  let bg = "var(--key-bg)";
  if (isAccent) bg = "var(--key-bg-accent)";
  else if (isAlt) bg = "var(--key-bg-alt)";

  if (isPressed) bg = "var(--key-active)";

  return {
    backgroundColor: bg,
    color: "var(--key-text)",
    boxShadow: isPressed
      ? "0 1px 0 var(--key-shadow)"
      : "0 3px 0 var(--key-shadow), 0 4px 6px rgba(0,0,0,0.15)",
    transform: isPressed ? "translateY(2px)" : "translateY(0)",
    transition: "all 0.08s ease-out",
  };
}

export default function Keyboard({ pressedKeys }: KeyboardProps) {
  return (
    <div
      className="w-full max-w-[920px] mx-auto rounded-2xl p-5 pb-6"
      style={{
        background: "linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg) 100%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      {keyboardRows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={`flex gap-[4px] justify-center ${rowIdx === 0 ? "mb-3" : "mb-[4px]"}`}
        >
          {row.map((keyConfig) => {
            const isPressed = pressedKeys.has(keyConfig.key);
            const width = keyConfig.width || 1;
            const baseWidth = 52;

            return (
              <div
                key={keyConfig.key}
                className="rounded-lg flex flex-col items-center justify-center text-xs font-medium select-none"
                style={{
                  ...getKeyStyle(keyConfig.key, isPressed),
                  width: `${baseWidth * width + (width - 1) * 4}px`,
                  height: rowIdx === 0 ? "36px" : "44px",
                  fontSize: width > 1.5 ? "10px" : "12px",
                }}
              >
                {keyConfig.subLabel ? (
                  <>
                    <span className="text-[9px] opacity-60 leading-none mb-0.5">
                      {keyConfig.label}
                    </span>
                    <span className="text-[12px] font-semibold leading-none">
                      {keyConfig.subLabel}
                    </span>
                  </>
                ) : (
                  <span className={`${width > 1.5 ? "text-[10px]" : "text-[13px] font-semibold"}`}>
                    {keyConfig.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
