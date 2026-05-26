"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useAppStore } from "@/stores/app-store";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Flame, Trophy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function HabitsPage() {
  const habits = useAppStore((s) => s.habits);
  const addHabit = useAppStore((s) => s.addHabit);
  const toggleHabit = useAppStore((s) => s.toggleHabit);
  const [name, setName] = useState("");

  const totalXp = habits.reduce((a, h) => a + h.xp, 0);

  return (
    <AppShell title="Habits">
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <GlassPanel className="p-4">
          <p className="text-xs text-white/50">Total XP</p>
          <p className="text-2xl font-bold text-cyan-400">{totalXp}</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-white/50">Active habits</p>
          <p className="text-2xl font-bold">{habits.length}</p>
        </GlassPanel>
        <GlassPanel className="p-4">
          <p className="text-xs text-white/50">Done today</p>
          <p className="text-2xl font-bold text-violet-400">
            {habits.filter((h) => h.completedToday).length}
          </p>
        </GlassPanel>
      </div>

      <div className="mb-6 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit..."
          className="min-h-11 max-w-xs"
        />
        <Button
          onClick={() => {
            if (name.trim()) {
              addHabit({ name });
              setName("");
            }
          }}
          className="min-h-11 gap-1"
        >
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {habits.map((h) => (
          <GlassPanel key={h.id} className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl text-2xl",
                    h.completedToday ? "bg-cyan-500/20" : "bg-white/5"
                  )}
                >
                  {h.icon}
                </span>
                <div>
                  <h3 className="font-semibold">{h.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-amber-400/80">
                    <Flame className="h-3 w-3" /> {h.streak} day streak
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant={h.completedToday ? "secondary" : "default"}
                onClick={() => toggleHabit(h.id)}
                className="min-h-10 sm:min-h-8"
              >
                {h.completedToday ? "Done" : "Check in"}
              </Button>
            </div>
            <div className="mt-4 flex justify-between gap-1">
              {h.weekLog.map((done, i) => (
                <div
                  key={i}
                  role="img"
                  aria-label={`${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]} ${done ? "completed" : "not completed"}`}
                  className={cn(
                    "h-8 flex-1 rounded-lg",
                    done ? "bg-cyan-500/40" : "bg-white/5"
                  )}
                  title={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]}
                />
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Best: {h.bestStreak}
              </span>
              <span>{h.xp} XP</span>
            </div>
          </GlassPanel>
        ))}
      </div>
    </AppShell>
  );
}
