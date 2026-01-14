"use client";

import { useState, useEffect, useRef } from "react";

interface TimerProps {
  initialSeconds: number;
  isRunning: boolean;
  onToggle: () => void;
  onStop: (seconds: number) => void;
  onReset: () => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Timer({
  initialSeconds,
  isRunning,
  onToggle,
  onStop,
  onReset,
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasRunningRef = useRef(false);

  // Sync with initialSeconds when it changes externally
  useEffect(() => {
    if (!isRunning) {
      setSeconds(initialSeconds);
    }
  }, [initialSeconds, isRunning]);

  // Handle timer ticking
  useEffect(() => {
    if (isRunning) {
      wasRunningRef.current = true;
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Report final time when stopping (not on initial mount)
      if (wasRunningRef.current) {
        wasRunningRef.current = false;
        // Use setTimeout to defer state update outside render cycle
        setTimeout(() => onStop(seconds), 0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger toggle
    setSeconds(0);
    onReset();
  };

  return (
    <div className="flex items-center">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-2 py-1 text-xs transition-colors ${
          isRunning
            ? "rounded-l bg-red-100 text-red-700 hover:bg-red-200"
            : "rounded bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
        }`}
      >
        {isRunning ? (
          <PauseIcon className="h-3 w-3" />
        ) : (
          <PlayIcon className="h-3 w-3" />
        )}
        <span className="font-mono">{formatTime(seconds)}</span>
      </button>

      {/* Reset button - only visible when running */}
      {isRunning && (
        <button
          onClick={handleReset}
          className="flex items-center rounded-r border-l border-red-200 bg-red-100 px-1.5 py-1 text-red-700 hover:bg-red-200 transition-colors"
          title="Reset timer"
        >
          <ResetIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
    </svg>
  );
}

function ResetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
