"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function GoalsWidget() {
  const [goals, setGoals] = useState([
    { id: "1", text: "Ship DailyOS MVP", done: true },
    { id: "2", text: "4 pomodoros today", done: false },
    { id: "3", text: "Review habits", done: false },
  ]);
  const [newGoal, setNewGoal] = useState("");

  const add = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: crypto.randomUUID(), text: newGoal, done: false }]);
    setNewGoal("");
  };

  const done = goals.filter((g) => g.done).length;

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 flex justify-between text-xs">
        <span className="text-white/70">Daily goals</span>
        <span className="text-cyan-400">{done}/{goals.length}</span>
      </div>
      <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all"
          style={{ width: `${(done / goals.length) * 100}%` }}
        />
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto">
        {goals.map((g) => (
          <li key={g.id} className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={g.done}
              onChange={() =>
                setGoals(goals.map((x) => (x.id === g.id ? { ...x, done: !x.done } : x)))
              }
              className="rounded border-white/20"
            />
            <span className={g.done ? "text-white/40 line-through" : ""}>{g.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-1">
        <Input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add goal..."
          className="h-8 text-xs"
        />
      </div>
    </div>
  );
}
