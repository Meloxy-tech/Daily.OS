"use client";

import { AppShell } from "@/components/layout/app-shell";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { motion } from "framer-motion";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Calculator, CheckSquare, Play, Plus, StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const notes = useAppStore((s) => s.notes);
  const tasks = useAppStore((s) => s.tasks);
  const habits = useAppStore((s) => s.habits);
  const addNote = useAppStore((s) => s.addNote);
  const addTask = useAppStore((s) => s.addTask);
  const setTimerRunning = useAppStore((s) => s.setTimerRunning);
  const recordToolUse = useAppStore((s) => s.recordToolUse);
  const router = useRouter();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const openTasks = tasks.filter((task) => task.status !== "DONE").length;
  const doneHabits = habits.filter((habit) => habit.completedToday).length;

  return (
    <AppShell title="Dashboard">
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
      >
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-soft)]">
              {greeting}
              {user?.name ? `, ${user.name}` : ""}. Your space is ready.
            </p>
            <p className="page-subtitle mt-1">
              Capture, focus, check off, calculate. Everything is one or two clicks away.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center sm:flex">
            {[
              ["Notes", notes.length],
              ["Open tasks", openTasks],
              ["Habits", `${doneHabits}/${habits.length}`],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-xl border border-[var(--border-soft)] bg-white/[0.025] px-3 py-2 sm:px-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">{value}</p>
                <p className="truncate text-[10px] text-[var(--muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="section-label">Quick start</h2>
          <p className="hidden text-xs text-[var(--muted)] sm:block">
            Common actions, always close.
          </p>
        </div>
        <div className="mobile-scroll-row mb-7 flex gap-2 overflow-x-auto pb-1">
          <Button
            className="h-10 shrink-0 gap-2"
            onClick={() => {
              const note = addNote({ title: "Untitled note" });
              recordToolUse("notes");
              router.push(`/notes?id=${note.id}`);
            }}
          >
            <Plus className="h-4 w-4" />
            Note
          </Button>
          <Button
            variant="secondary"
            className="h-10 shrink-0 gap-2"
            onClick={() => {
              setTimerRunning(true);
              recordToolUse("focus");
              router.push("/focus");
            }}
          >
            <Play className="h-4 w-4" />
            Start timer
          </Button>
          <Button
            variant="outline"
            className="h-10 shrink-0 gap-2"
            onClick={() => {
              addTask({ title: "New task" });
              recordToolUse("tasks");
              router.push("/tasks");
            }}
          >
            <CheckSquare className="h-4 w-4" />
            Task
          </Button>
          <Button
            variant="outline"
            className="h-10 shrink-0 gap-2"
            onClick={() => {
              recordToolUse("utilities");
              router.push("/utilities?tool=calculator");
            }}
          >
            <Calculator className="h-4 w-4" />
            Calculator
          </Button>
          <Button
            variant="ghost"
            className="h-10 shrink-0 gap-2"
            onClick={() => {
              recordToolUse("notes");
              router.push("/notes");
            }}
          >
            <StickyNote className="h-4 w-4" />
            Browse notes
          </Button>
        </div>
        <DashboardGrid />
      </motion.div>
    </AppShell>
  );
}
