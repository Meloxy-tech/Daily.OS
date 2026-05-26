"use client";

import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export function HabitsWidget() {
  const habits = useAppStore((s) => s.habits);
  const toggleHabit = useAppStore((s) => s.toggleHabit);

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 flex justify-between">
        <span className="text-xs font-medium text-white/70">Habits</span>
        <Link href="/habits" className="text-[10px] text-cyan-400">
          Tracker
        </Link>
      </div>
      <div className="space-y-2">
        {habits.slice(0, 4).map((h) => (
          <button
            key={h.id}
            onClick={() => toggleHabit(h.id)}
            className="flex w-full items-center gap-2 rounded-lg bg-white/[0.02] px-2 py-2 text-left hover:bg-white/5"
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-sm",
                h.completedToday ? "bg-cyan-500/20" : "bg-white/5"
              )}
            >
              {h.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs">{h.name}</p>
              <p className="text-[10px] text-white/40">🔥 {h.streak} day streak</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
