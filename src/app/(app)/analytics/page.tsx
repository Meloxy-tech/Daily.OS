"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useAppStore } from "@/stores/app-store";

export default function AnalyticsPage() {
  const tasks = useAppStore((s) => s.tasks);
  const habits = useAppStore((s) => s.habits);
  const sessionsToday = useAppStore((s) => s.sessionsToday);

  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const habitRate =
    habits.length > 0
      ? Math.round(
          (habits.filter((h) => h.completedToday).length / habits.length) * 100
        )
      : 0;

  const weekData = [3, 5, 4, 6, sessionsToday || 2, 4, 5];
  const max = Math.max(...weekData, 1);

  return (
    <AppShell title="Analytics">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Focus sessions", value: sessionsToday, sub: "today" },
          { label: "Tasks done", value: doneTasks, sub: `of ${tasks.length}` },
          { label: "Habit rate", value: `${habitRate}%`, sub: "today" },
          { label: "Total XP", value: habits.reduce((a, h) => a + h.xp, 0), sub: "habits" },
        ].map((stat) => (
          <GlassPanel key={stat.label} className="p-5">
            <p className="text-xs text-white/50">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">{stat.value}</p>
            <p className="text-[10px] text-white/30">{stat.sub}</p>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel className="mt-6 p-6">
        <h3 className="text-sm font-medium text-white/70">Weekly focus hours</h3>
        <div className="mt-6 flex h-40 items-end justify-between gap-2">
          {weekData.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500/60 to-violet-500/40 transition-all"
                style={{ height: `${(v / max) * 100}%`, minHeight: 8 }}
              />
              <span className="text-[10px] text-white/30">
                {["S", "M", "T", "W", "T", "F", "S"][i]}
              </span>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="mt-6 p-6">
        <h3 className="text-sm font-medium text-white/70">Insights</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/60">
          <li>You&apos;re most productive in morning focus blocks.</li>
          <li>{doneTasks > 0 ? "Great task momentum — keep going!" : "Add tasks to track completion trends."}</li>
          <li>{habitRate >= 50 ? "Habit consistency is strong this week." : "Try checking in on habits earlier in the day."}</li>
        </ul>
      </GlassPanel>
    </AppShell>
  );
}
