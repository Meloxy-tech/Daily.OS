"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppStore } from "@/stores/app-store";
import type { TaskItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const columns: { id: TaskItem["status"]; label: string }[] = [
  { id: "TODO", label: "To Do" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
];

export default function TasksPage() {
  const tasks = useAppStore((s) => s.tasks);
  const addTask = useAppStore((s) => s.addTask);
  const moveTask = useAppStore((s) => s.moveTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const [newTitle, setNewTitle] = useState("");

  const add = () => {
    if (!newTitle.trim()) return;
    addTask({ title: newTitle });
    setNewTitle("");
  };

  const done = tasks.filter((t) => t.status === "DONE").length;

  return (
    <AppShell title="Tasks">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex flex-1 gap-2">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a task..."
            className="min-h-11 max-w-md"
          />
          <Button onClick={add} className="min-h-11 gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <p className="text-sm text-white/50">
          {done}/{tasks.length} completed
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <GlassPanel key={col.id} className="min-h-72 p-4 lg:min-h-[400px]">
            <h3 className="section-label mb-5">{col.label}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: task.status === "DONE" ? 0.98 : 1,
                      }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className={cn(
                        "group rounded-xl border border-[var(--border-soft)] bg-white/[0.025] p-3.5 transition-shadow duration-300 hover:border-[var(--border)] hover:bg-white/[0.04]",
                        task.status === "DONE" &&
                          "border-[var(--accent)]/10 bg-[var(--accent)]/[0.04] opacity-75"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm",
                          task.status === "DONE" && "line-through"
                        )}
                      >
                        {task.title}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                        {columns
                          .filter((c) => c.id !== task.status)
                          .map((c) => (
                            <button
                              key={c.id}
                              onClick={() => moveTask(task.id, c.id)}
                              className="rounded-lg bg-white/10 px-2.5 py-1.5 text-[10px] hover:bg-white/20"
                            >
                              → {c.label}
                            </button>
                          ))}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="ml-auto rounded-lg p-1.5 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-3 w-3 text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </GlassPanel>
        ))}
      </div>
    </AppShell>
  );
}
