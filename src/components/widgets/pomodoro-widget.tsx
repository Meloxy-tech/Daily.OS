"use client";

import { useEffect, useMemo } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { formatDuration } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PomodoroWidget({ mode }: { mode?: "stopwatch" }) {
  const timerSeconds = useAppStore((s) => s.timerSeconds);
  const timerRunning = useAppStore((s) => s.timerRunning);
  const pomodoroPhase = useAppStore((s) => s.pomodoroPhase);
  const sessionsToday = useAppStore((s) => s.sessionsToday);
  const setTimer = useAppStore((s) => s.setTimer);
  const setTimerRunning = useAppStore((s) => s.setTimerRunning);
  const setPomodoroPhase = useAppStore((s) => s.setPomodoroPhase);
  const incrementSessions = useAppStore((s) => s.incrementSessions);
  const isStopwatch = mode === "stopwatch";

  const totalSeconds = useMemo(() => {
    if (isStopwatch) return Math.max(timerSeconds, 1);
    return pomodoroPhase === "work" ? 25 * 60 : 5 * 60;
  }, [isStopwatch, pomodoroPhase, timerSeconds]);

  const progress = isStopwatch
    ? 0
    : Math.min(1, 1 - timerSeconds / totalSeconds);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      const current = useAppStore.getState().timerSeconds;
      if (isStopwatch) {
        setTimer(current + 1);
        return;
      }
      if (current <= 1) {
        setTimerRunning(false);
        if (useAppStore.getState().pomodoroPhase === "work") {
          incrementSessions();
          toast.success("Lovely work — time for a gentle break ☕");
          setPomodoroPhase("break");
          setTimer(5 * 60);
        } else {
          toast.success("Break's over — ease back into focus");
          setPomodoroPhase("work");
          setTimer(25 * 60);
        }
        return;
      }
      setTimer(current - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [
    timerRunning,
    isStopwatch,
    setTimer,
    setTimerRunning,
    setPomodoroPhase,
    incrementSessions,
  ]);

  const reset = () => {
    setTimerRunning(false);
    setTimer(isStopwatch ? 0 : pomodoroPhase === "work" ? 25 * 60 : 5 * 60);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      {!isStopwatch && (
        <p className="section-label mb-4 text-[var(--accent)]">
          {pomodoroPhase === "work" ? "Focus" : "Rest"} · {sessionsToday} today
        </p>
      )}

      <div className="relative flex items-center justify-center">
        {!isStopwatch && (
          <div
            className="absolute h-36 w-36 rounded-full opacity-80 transition-all duration-1000 ease-out md:h-40 md:w-40"
            style={{
              background: `conic-gradient(
                var(--accent) ${progress * 360}deg,
                rgba(255, 248, 240, 0.06) ${progress * 360}deg
              )`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px))",
            }}
          />
        )}
        <div
          className={cn(
            "relative flex h-32 w-32 items-center justify-center rounded-full bg-white/[0.02] md:h-36 md:w-36",
            timerRunning && "animate-[cozy-pulse_3s_ease-in-out_infinite]"
          )}
        >
          <p className="timer-display text-3xl md:text-4xl">
            {formatDuration(timerSeconds)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          size="icon"
          variant="secondary"
          className="h-11 w-11 rounded-full"
          onClick={() => setTimerRunning(!timerRunning)}
          aria-label={timerRunning ? "Pause timer" : "Start timer"}
        >
          {timerRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-11 w-11 rounded-full"
          onClick={reset}
          aria-label="Reset timer"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
