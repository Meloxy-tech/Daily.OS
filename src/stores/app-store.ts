"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppUser,
  HabitItem,
  LayoutItem,
  NoteItem,
  TaskItem,
} from "@/types";
import { DEFAULT_LAYOUT } from "@/types";
import { generateId } from "@/lib/utils";

interface AppState {
  user: AppUser | null;
  layout: LayoutItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  habits: HabitItem[];
  accentColor: string;
  sidebarOpen: boolean;
  commandOpen: boolean;
  focusMode: boolean;
  timerSeconds: number;
  timerRunning: boolean;
  timerMode: "pomodoro" | "countdown" | "stopwatch";
  pomodoroPhase: "work" | "break";
  sessionsToday: number;
  favoriteTools: string[];
  recentTools: string[];

  setUser: (user: AppUser | null) => void;
  setLayout: (layout: LayoutItem[]) => void;
  setAccentColor: (color: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setFocusMode: (on: boolean) => void;

  addNote: (note?: Partial<NoteItem>) => NoteItem;
  updateNote: (id: string, data: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  addTask: (task?: Partial<TaskItem>) => void;
  updateTask: (id: string, data: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskItem["status"]) => void;

  addHabit: (habit?: Partial<HabitItem>) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;

  setTimer: (seconds: number) => void;
  setTimerRunning: (running: boolean) => void;
  setTimerMode: (mode: "pomodoro" | "countdown" | "stopwatch") => void;
  setPomodoroPhase: (phase: "work" | "break") => void;
  incrementSessions: () => void;
  toggleFavoriteTool: (id: string) => void;
  recordToolUse: (id: string) => void;

  initGuest: (name?: string, avatar?: string) => void;
  seedDemoData: () => void;
}

const demoNotes: NoteItem[] = [
  {
    id: "demo-1",
    title: "Daily focus",
    content: "## Today\n\n- Ship the landing page\n- Review PRs\n- 25min deep work blocks",
    folder: "Work",
    tags: ["focus", "work"],
    color: "#22d3ee",
    isPinned: true,
    isFavorite: true,
    isArchived: false,
    isChecklist: false,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Grocery list",
    content: "",
    folder: "Personal",
    tags: ["home"],
    color: "#a78bfa",
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    isChecklist: true,
    checklist: [
      { id: "1", text: "Oats", done: true },
      { id: "2", text: "Berries", done: false },
      { id: "3", text: "Coffee beans", done: false },
    ],
    updatedAt: new Date().toISOString(),
  },
];

const demoTasks: TaskItem[] = [
  {
    id: "t1",
    title: "Design dashboard widgets",
    status: "IN_PROGRESS",
    priority: "HIGH",
    category: "Work",
    order: 0,
  },
  {
    id: "t2",
    title: "Write release notes",
    status: "TODO",
    priority: "MEDIUM",
    category: "Work",
    order: 1,
  },
  {
    id: "t3",
    title: "Evening walk",
    status: "TODO",
    priority: "LOW",
    category: "Health",
    order: 2,
  },
];

const demoHabits: HabitItem[] = [
  {
    id: "h1",
    name: "Morning meditation",
    icon: "🧘",
    color: "#22d3ee",
    streak: 12,
    bestStreak: 21,
    xp: 340,
    completedToday: true,
    weekLog: [true, true, true, true, false, true, true],
  },
  {
    id: "h2",
    name: "Read 20 pages",
    icon: "📚",
    color: "#a78bfa",
    streak: 5,
    bestStreak: 14,
    xp: 120,
    completedToday: false,
    weekLog: [true, false, true, true, true, false, false],
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      layout: DEFAULT_LAYOUT,
      notes: [],
      tasks: [],
      habits: [],
      accentColor: "#9bb8c4",
      sidebarOpen: true,
      commandOpen: false,
      focusMode: false,
      timerSeconds: 25 * 60,
      timerRunning: false,
      timerMode: "pomodoro",
      pomodoroPhase: "work",
      sessionsToday: 0,
      favoriteTools: ["notes", "focus", "calculator"],
      recentTools: ["dashboard", "notes", "focus"],

      setUser: (user) => set({ user }),
      setLayout: (layout) => set({ layout }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setFocusMode: (focusMode) => set({ focusMode }),

      addNote: (partial) => {
        const note: NoteItem = {
          id: generateId(),
          title: partial?.title ?? "Untitled",
          content: partial?.content ?? "",
          folder: partial?.folder ?? "Inbox",
          tags: partial?.tags ?? [],
          color: partial?.color ?? "#6366f1",
          isPinned: partial?.isPinned ?? false,
          isFavorite: partial?.isFavorite ?? false,
          isArchived: partial?.isArchived ?? false,
          isChecklist: partial?.isChecklist ?? false,
          checklist: partial?.checklist,
          updatedAt: new Date().toISOString(),
        };
        set({ notes: [note, ...get().notes] });
        return note;
      },
      updateNote: (id, data) =>
        set({
          notes: get().notes.map((n) =>
            n.id === id
              ? { ...n, ...data, updatedAt: new Date().toISOString() }
              : n
          ),
        }),
      deleteNote: (id) =>
        set({ notes: get().notes.filter((n) => n.id !== id) }),

      addTask: (partial) => {
        const task: TaskItem = {
          id: generateId(),
          title: partial?.title ?? "New task",
          description: partial?.description,
          status: partial?.status ?? "TODO",
          priority: partial?.priority ?? "MEDIUM",
          category: partial?.category ?? "General",
          dueDate: partial?.dueDate,
          order: get().tasks.length,
        };
        set({ tasks: [...get().tasks, task] });
      },
      updateTask: (id, data) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }),
      deleteTask: (id) =>
        set({ tasks: get().tasks.filter((t) => t.id !== id) }),
      moveTask: (id, status) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
        }),

      addHabit: (partial) => {
        const habit: HabitItem = {
          id: generateId(),
          name: partial?.name ?? "New habit",
          icon: partial?.icon ?? "✨",
          color: partial?.color ?? "#22d3ee",
          streak: 0,
          bestStreak: 0,
          xp: 0,
          completedToday: false,
          weekLog: [false, false, false, false, false, false, false],
        };
        set({ habits: [...get().habits, habit] });
      },
      toggleHabit: (id) =>
        set({
          habits: get().habits.map((h) => {
            if (h.id !== id) return h;
            const completed = !h.completedToday;
            return {
              ...h,
              completedToday: completed,
              streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1),
              bestStreak: completed
                ? Math.max(h.bestStreak, h.streak + 1)
                : h.bestStreak,
              xp: completed ? h.xp + 15 : h.xp,
              weekLog: [...h.weekLog.slice(0, 6), completed],
            };
          }),
        }),
      deleteHabit: (id) =>
        set({ habits: get().habits.filter((h) => h.id !== id) }),

      setTimer: (timerSeconds) => set({ timerSeconds }),
      setTimerRunning: (timerRunning) => set({ timerRunning }),
      setTimerMode: (timerMode) => set({ timerMode }),
      setPomodoroPhase: (pomodoroPhase) => set({ pomodoroPhase }),
      incrementSessions: () =>
        set({ sessionsToday: get().sessionsToday + 1 }),
      toggleFavoriteTool: (id) =>
        set({
          favoriteTools: get().favoriteTools.includes(id)
            ? get().favoriteTools.filter((tool) => tool !== id)
            : [id, ...get().favoriteTools].slice(0, 6),
        }),
      recordToolUse: (id) =>
        set({
          recentTools: [id, ...get().recentTools.filter((tool) => tool !== id)].slice(
            0,
            6
          ),
        }),

      initGuest: (name, avatar) => {
        const user: AppUser = {
          id: `guest-${generateId()}`,
          name: name ?? "Guest",
          avatar: avatar ?? "🚀",
          isGuest: true,
        };
        set({ user });
        if (
          process.env.NODE_ENV === "development" &&
          get().notes.length === 0
        ) {
          get().seedDemoData();
        }
      },

      seedDemoData: () =>
        set({
          notes: demoNotes,
          tasks: demoTasks,
          habits: demoHabits,
        }),
    }),
    { name: "dailyos-storage" }
  )
);
