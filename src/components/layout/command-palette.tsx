"use client";

import { useEffect } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  StickyNote,
  Timer,
  CheckSquare,
  Target,
  Wrench,
  BarChart3,
  Settings,
  Sparkles,
  Plus,
  Play,
  Calculator,
  Search,
  Star,
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";

const commands = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, keywords: "home widgets today" },
  { id: "notes", label: "Notes", href: "/notes", icon: StickyNote, keywords: "write journal markdown" },
  { id: "focus", label: "Focus & Timers", href: "/focus", icon: Timer, keywords: "pomodoro stopwatch deep work" },
  { id: "tasks", label: "Tasks", href: "/tasks", icon: CheckSquare, keywords: "todo kanban work" },
  { id: "habits", label: "Habits", href: "/habits", icon: Target, keywords: "routine streaks" },
  { id: "utilities", label: "Utilities", href: "/utilities", icon: Wrench, keywords: "tools qr password json color" },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3, keywords: "stats progress review" },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings, keywords: "profile theme data" },
  { id: "ai", label: "AI Assistant", href: "/dashboard?ai=1", icon: Sparkles, keywords: "plan summarize help" },
];

export function CommandPalette() {
  const open = useAppStore((s) => s.commandOpen);
  const setOpen = useAppStore((s) => s.setCommandOpen);
  const notes = useAppStore((s) => s.notes);
  const tasks = useAppStore((s) => s.tasks);
  const addNote = useAppStore((s) => s.addNote);
  const addTask = useAppStore((s) => s.addTask);
  const setTimerRunning = useAppStore((s) => s.setTimerRunning);
  const favoriteTools = useAppStore((s) => s.favoriteTools);
  const recentTools = useAppStore((s) => s.recentTools);
  const recordToolUse = useAppStore((s) => s.recordToolUse);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  if (!open) return null;

  const run = (href: string, id?: string) => {
    if (id) recordToolUse(id);
    router.push(href);
    setOpen(false);
  };

  const recentCommands = recentTools
    .filter((id) => !favoriteTools.includes(id))
    .map((id) => commands.find((cmd) => cmd.id === id))
    .filter(Boolean)
    .slice(0, 4);
  const favoriteCommands = favoriteTools
    .map((id) => commands.find((cmd) => cmd.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[#0a090d]/70 p-3 pt-[10vh] backdrop-blur-md sm:p-4 sm:pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <Command
        className="cozy-surface w-full max-w-lg overflow-hidden shadow-2xl shadow-[var(--glow)]/20"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-soft)] px-5">
          <Search className="h-4 w-4 text-[var(--muted)]" />
          <Command.Input
            placeholder="Search tools, notes, tasks, actions..."
            className="w-full bg-transparent py-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
          />
          <kbd className="rounded-md border border-[var(--border-soft)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">
            Esc
          </kbd>
        </div>
        <Command.List className="max-h-[min(28rem,70vh)] overflow-y-auto p-2">
          <Command.Empty className="py-8 text-center text-sm text-[var(--muted)]">
            Nothing found. Try note, timer, task, or calc.
          </Command.Empty>
          <Command.Group heading="Quick actions" className="section-label px-3 py-2">
            <Command.Item
              value="Create new note quick action write"
              onSelect={() => {
                const note = addNote({ title: "Untitled note" });
                run(`/notes?id=${note.id}`, "notes");
              }}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
            >
              <Plus className="h-4 w-4 text-[var(--accent)]" />
              New note
            </Command.Item>
            <Command.Item
              value="Add task quick action todo"
              onSelect={() => {
                addTask({ title: "New task" });
                run("/tasks", "tasks");
              }}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
            >
              <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
              Add task
            </Command.Item>
            <Command.Item
              value="Start focus timer pomodoro"
              onSelect={() => {
                setTimerRunning(true);
                run("/focus", "focus");
              }}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
            >
              <Play className="h-4 w-4 text-[var(--accent)]" />
              Start focus timer
            </Command.Item>
            <Command.Item
              value="Open calculator quick utility math"
              onSelect={() => run("/utilities?tool=calculator", "utilities")}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
            >
              <Calculator className="h-4 w-4 text-[var(--accent)]" />
              Open calculator
            </Command.Item>
          </Command.Group>

          {(favoriteCommands.length > 0 || recentCommands.length > 0) && (
            <Command.Group heading="Pinned & recent" className="section-label px-3 py-2">
              {[...favoriteCommands, ...recentCommands].map((cmd, index) => {
                if (!cmd) return null;
                const Icon = favoriteTools.includes(cmd.id) ? Star : cmd.icon;
                return (
                  <Command.Item
                    key={`${cmd.href}-${index}`}
                    value={`${cmd.label} ${cmd.keywords} recent favorite pinned`}
                    onSelect={() => run(cmd.href, cmd.id)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
                  >
                    <Icon className="h-4 w-4 text-[var(--accent)]" />
                    {cmd.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
          )}

          <Command.Group heading="Navigate" className="section-label px-3 py-2">
            {commands.map((cmd) => (
              <Command.Item
                key={cmd.href}
                value={`${cmd.label} ${cmd.keywords}`}
                onSelect={() => run(cmd.href, cmd.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors",
                  "aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
                )}
              >
                <cmd.icon className="h-4 w-4 text-[var(--accent)]" />
                {cmd.label}
              </Command.Item>
            ))}
          </Command.Group>

          {notes.length > 0 && (
            <Command.Group heading="Notes" className="section-label px-3 py-2">
              {notes.slice(0, 8).map((note) => (
                <Command.Item
                  key={note.id}
                  value={`${note.title} ${note.content} ${note.folder} ${note.tags.join(" ")}`}
                  onSelect={() => run(`/notes?id=${note.id}`, "notes")}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
                >
                  <StickyNote className="h-4 w-4 text-[var(--accent)]" />
                  <span className="truncate">{note.title || "Untitled note"}</span>
                  <span className="ml-auto text-[10px] text-[var(--muted)]">{note.folder}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {tasks.length > 0 && (
            <Command.Group heading="Tasks" className="section-label px-3 py-2">
              {tasks.slice(0, 8).map((task) => (
                <Command.Item
                  key={task.id}
                  value={`${task.title} ${task.category} ${task.status} ${task.priority}`}
                  onSelect={() => run("/tasks", "tasks")}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[var(--foreground-soft)] transition-colors aria-selected:bg-white/[0.06] aria-selected:text-[var(--foreground)]"
                >
                  <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
                  <span className="truncate">{task.title}</span>
                  <span className="ml-auto text-[10px] text-[var(--muted)]">{task.status.replace("_", " ")}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
