"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import type { Layout as RGLayout } from "react-grid-layout";
import { useAppStore } from "@/stores/app-store";
import { WidgetContent } from "@/components/widgets/widget-registry";
import { CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LayoutItem, WidgetType } from "@/types";
import { generateId } from "@/lib/utils";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ReactGridLayout = dynamic(
  () => import("react-grid-layout/legacy").then((mod) => mod.default),
  { ssr: false }
);

const WIDGET_LABELS: Record<WidgetType, string> = {
  clock: "Clock",
  notes: "Notes",
  timer: "Timer",
  pomodoro: "Pomodoro",
  stopwatch: "Stopwatch",
  calculator: "Calculator",
  tasks: "Tasks",
  habits: "Habits",
  goals: "Goals",
  weather: "Weather",
  quotes: "Quotes",
  quicklinks: "Links",
  calendar: "Calendar",
};

export function DashboardGrid() {
  const layout = useAppStore((s) => s.layout);
  const setLayout = useAppStore((s) => s.setLayout);
  const [width, setWidth] = useState(1200);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const el = document.getElementById("dashboard-container");
      if (el) setWidth(el.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onLayoutChange = useCallback(
    (newLayout: RGLayout) => {
      const merged: LayoutItem[] = [...newLayout].map((l) => {
        const existing = layout.find((x) => x.i === l.i);
        return {
          i: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
          minW: existing?.minW,
          minH: existing?.minH,
          type: existing?.type ?? "clock",
        };
      });
      setLayout(merged);
    },
    [layout, setLayout]
  );

  const addWidget = (type: WidgetType) => {
    const item: LayoutItem = {
      i: `${type}-${generateId().slice(0, 6)}`,
      x: 0,
      y: Infinity,
      w: 3,
      h: 2,
      type,
      minW: 2,
      minH: 2,
    };
    setLayout([...layout, item]);
  };

  if (!mounted) {
    return (
      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-cozy h-52 rounded-[var(--radius-lg)]" />
        ))}
      </div>
    );
  }

  const addableWidgets: WidgetType[] = ["calculator", "pomodoro", "quicklinks", "quotes"];

  if (width < 720) {
    return (
      <div id="dashboard-container">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="section-label">Dashboard widgets</h2>
          <span className="text-[10px] text-[var(--muted)]">Tap to add</span>
        </div>
        <div className="mobile-scroll-row mb-4 flex gap-2 overflow-x-auto pb-1">
          {addableWidgets.map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addWidget(type)}
              className="shrink-0 gap-1 text-xs"
            >
              <Plus className="h-3 w-3" />
              {WIDGET_LABELS[type]}
            </Button>
          ))}
        </div>
        <div className="grid gap-4">
          {layout.map((item) => (
            <div key={item.i} className="widget-card min-h-56">
              <div className="flex items-center justify-between border-b border-[var(--border-soft)] px-5 py-3">
                <CardTitle>{WIDGET_LABELS[item.type]}</CardTitle>
                <span className="text-[10px] text-[var(--muted)]">Widget</span>
              </div>
              <div className="min-h-48 p-1">
                <WidgetContent type={item.type} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-container">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="section-label">Dashboard widgets</h2>
        <span className="text-xs text-[var(--muted)]">Drag cards to rearrange</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {addableWidgets.map(
          (type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => addWidget(type)}
              className="gap-1 text-xs"
            >
              <Plus className="h-3 w-3" />
              {WIDGET_LABELS[type]}
            </Button>
          )
        )}
      </div>

      <ReactGridLayout
        className="layout"
        layout={layout.map(({ i, x, y, w, h, minW, minH }) => ({
          i,
          x,
          y,
          w,
          h,
          minW,
          minH,
        }))}
        cols={9}
        rowHeight={80}
        width={width}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag"
        compactType="vertical"
        margin={[14, 14]}
        containerPadding={[0, 0]}
        isBounded
      >
        {layout.map((item) => (
          <div key={item.i} className="group/widget">
            <div className="widget-card flex h-full flex-col">
              <div className="widget-drag flex cursor-grab items-center border-b border-[var(--border-soft)] px-5 py-3 active:cursor-grabbing">
                <CardTitle>{WIDGET_LABELS[item.type]}</CardTitle>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden p-1">
                <WidgetContent type={item.type} />
              </div>
            </div>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}
