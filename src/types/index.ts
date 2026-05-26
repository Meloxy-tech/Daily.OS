export type WidgetType =
  | "clock"
  | "notes"
  | "timer"
  | "pomodoro"
  | "stopwatch"
  | "calculator"
  | "tasks"
  | "habits"
  | "goals"
  | "weather"
  | "quotes"
  | "quicklinks"
  | "calendar";

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  type: WidgetType;
}

export interface GuestUser {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  isGuest: true;
}

export interface AppUser {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  isGuest: boolean;
  supabaseId?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isChecklist: boolean;
  checklist?: { id: string; text: string; done: boolean }[];
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  dueDate?: string;
  order: number;
}

export interface HabitItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  bestStreak: number;
  xp: number;
  completedToday: boolean;
  weekLog: boolean[];
}

export const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: "clock-1", x: 0, y: 0, w: 3, h: 2, type: "clock", minW: 2, minH: 2 },
  { i: "pomodoro-1", x: 3, y: 0, w: 3, h: 3, type: "pomodoro", minW: 2, minH: 2 },
  { i: "tasks-1", x: 6, y: 0, w: 3, h: 3, type: "tasks", minW: 2, minH: 2 },
  { i: "notes-1", x: 0, y: 2, w: 4, h: 3, type: "notes", minW: 3, minH: 2 },
  { i: "habits-1", x: 4, y: 3, w: 3, h: 2, type: "habits", minW: 2, minH: 2 },
  { i: "quotes-1", x: 7, y: 3, w: 2, h: 2, type: "quotes", minW: 2, minH: 2 },
];

export const AVATARS = ["🚀", "🌙", "⚡", "🎯", "🧠", "✨", "🔮", "🌊"];
