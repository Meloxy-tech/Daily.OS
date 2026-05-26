"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

export function TasksWidget() {
  const tasks = useAppStore((s) => s.tasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const active = tasks.filter((t) => t.status !== "DONE").slice(0, 5);
  const done = tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">Today</span>
        <Link href="/tasks" className="text-[10px] text-cyan-400">
          {done}/{tasks.length} done
        </Link>
      </div>
      <ul className="flex-1 space-y-1.5 overflow-y-auto">
        {active.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5"
          >
            <button
              onClick={() => moveTask(task.id, "DONE")}
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                task.priority === "HIGH"
                  ? "border-red-400/50"
                  : "border-white/20"
              )}
            >
              <Check className="h-2.5 w-2.5 opacity-0 hover:opacity-50" />
            </button>
            <span className="truncate text-xs">{task.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
