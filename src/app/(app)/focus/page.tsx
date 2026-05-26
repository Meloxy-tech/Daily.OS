"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { Maximize2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const sounds = ["Rain", "Forest", "Cafe", "White noise"];

export default function FocusPage() {
  const focusMode = useAppStore((s) => s.focusMode);
  const setFocusMode = useAppStore((s) => s.setFocusMode);
  const sessionsToday = useAppStore((s) => s.sessionsToday);
  const [soundOn, setSoundOn] = useState(false);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  if (focusMode) {
    return (
      <div className="focus-cozy-bg fixed inset-0 z-[200] flex flex-col items-center justify-center px-5 py-8">
        <p className="section-label mb-8 text-[var(--muted)]">Deep focus</p>
        <div className="scale-100 sm:scale-110 md:scale-125">
          <PomodoroWidget />
        </div>
        <Button
          variant="ghost"
          className="mt-12 text-[var(--muted)] hover:text-[var(--foreground)]"
          onClick={() => setFocusMode(false)}
        >
          Leave focus space
        </Button>
      </div>
    );
  }

  return (
    <AppShell title="Focus & Timers">
      <p className="page-subtitle -mt-2 mb-8 max-w-lg">
        Settle in. One timer, one moment — no rush.
      </p>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:gap-8">
        <GlassPanel glow className="p-8 md:p-10">
          <PomodoroWidget />
          <Button
            className="mt-6 min-h-11 w-full gap-2"
            variant="secondary"
            onClick={() => setFocusMode(true)}
          >
            <Maximize2 className="h-4 w-4" /> Enter fullscreen focus
          </Button>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel className="p-6">
            <h3 className="section-label">Session stats</h3>
            <p className="timer-display mt-5 text-4xl text-[var(--accent)]">{sessionsToday}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Gentle wins today</p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="section-label">Ambient sounds</h3>
              <button onClick={() => setSoundOn(!soundOn)}>
                {soundOn ? (
                  <Volume2 className="h-4 w-4 text-cyan-400" />
                ) : (
                  <VolumeX className="h-4 w-4 text-white/40" />
                )}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {sounds.map((s) => (
                <button
                  key={s}
                  disabled={!soundOn}
                  onClick={() => setActiveSound(activeSound === s ? null : s)}
                  className={cn(
                    "min-h-12 rounded-xl py-3 text-sm transition",
                    activeSound === s
                      ? "bg-[var(--accent)]/15 text-[var(--accent)] shadow-[0_0_20px_-8px_var(--glow)]"
                      : "bg-white/[0.03] text-[var(--foreground-soft)] hover:bg-white/[0.06]",
                    !soundOn && "opacity-40"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-white/30">
              Ambient audio uses Web Audio — toggle sound to enable.
            </p>
          </GlassPanel>

          <GlassPanel className="p-6">
            <PomodoroWidget mode="stopwatch" />
          </GlassPanel>
        </div>
      </div>
    </AppShell>
  );
}
