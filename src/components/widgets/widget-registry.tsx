"use client";

import type { WidgetType } from "@/types";
import { ClockWidget } from "./clock-widget";
import { NotesWidget } from "./notes-widget";
import { PomodoroWidget } from "./pomodoro-widget";
import { TasksWidget } from "./tasks-widget";
import { HabitsWidget } from "./habits-widget";
import { QuotesWidget } from "./quotes-widget";
import { CalculatorWidget } from "./calculator-widget";
import { QuickLinksWidget } from "./quick-links-widget";
import { GoalsWidget } from "./goals-widget";
import { EmptyState } from "@/components/ui/empty-state";

export function WidgetContent({ type }: { type: WidgetType }) {
  switch (type) {
    case "clock":
      return <ClockWidget />;
    case "notes":
      return <NotesWidget />;
    case "pomodoro":
    case "timer":
      return <PomodoroWidget />;
    case "stopwatch":
      return <PomodoroWidget mode="stopwatch" />;
    case "tasks":
      return <TasksWidget />;
    case "habits":
      return <HabitsWidget />;
    case "quotes":
      return <QuotesWidget />;
    case "calculator":
      return <CalculatorWidget />;
    case "quicklinks":
      return <QuickLinksWidget />;
    case "goals":
      return <GoalsWidget />;
    default:
      return (
        <EmptyState
          className="h-full border-none bg-transparent py-8"
          title="Widget unavailable"
          description="Remove this card from your dashboard or replace it with a supported widget."
        />
      );
  }
}
