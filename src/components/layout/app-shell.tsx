"use client";

import { Sidebar, MobileNav } from "./sidebar";
import { CommandPalette } from "./command-palette";
import { AIAssistant } from "@/components/ai/assistant-panel";
import { Button } from "@/components/ui/button";
import { Calculator, CheckSquare, Download, Play, Plus, Search, Sparkles, StickyNote } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

export function AppShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const setCommandOpen = useAppStore((s) => s.setCommandOpen);
  const addNote = useAppStore((s) => s.addNote);
  const addTask = useAppStore((s) => s.addTask);
  const setTimerRunning = useAppStore((s) => s.setTimerRunning);
  const recordToolUse = useAppStore((s) => s.recordToolUse);
  const [aiOpen, setAiOpen] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("ai") === "1") {
      setAiOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    const id = pathname.split("/")[1] || "dashboard";
    recordToolUse(id);
  }, [pathname, recordToolUse]);

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  const quickActions = [
    {
      label: "New note",
      icon: StickyNote,
      action: () => {
        const note = addNote({ title: "Untitled note" });
        recordToolUse("notes");
        router.push(`/notes?id=${note.id}`);
      },
    },
    {
      label: "Start timer",
      icon: Play,
      action: () => {
        setTimerRunning(true);
        recordToolUse("focus");
        router.push("/focus");
      },
    },
    {
      label: "Calculator",
      icon: Calculator,
      action: () => {
        recordToolUse("utilities");
        router.push("/utilities?tool=calculator");
      },
    },
    {
      label: "New task",
      icon: CheckSquare,
      action: () => {
        addTask({ title: "New task" });
        recordToolUse("tasks");
        router.push("/tasks");
      },
    },
  ];

  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="relative z-[1] flex min-w-0 flex-1 flex-col pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <header className="sticky top-0 z-40 flex h-[3.75rem] items-center justify-between border-b border-[var(--border-soft)] bg-[var(--background)]/78 px-4 backdrop-blur-2xl md:px-8">
          <h1 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {title ?? "DailyOS"}
          </h1>
          <div className="flex items-center gap-2">
            {installPrompt && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-2 lg:flex"
                onClick={async () => {
                  await installPrompt.prompt();
                  setInstallPrompt(null);
                }}
              >
                <Download className="h-4 w-4 opacity-70" />
                Install
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="hidden gap-2 sm:flex"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="h-4 w-4 opacity-60" />
              <span className="text-xs text-[var(--muted)]">⌘K</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAiOpen(true)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              <span className="hidden sm:inline">AI</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-4 py-5 sm:px-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-[1680px]">{children}</div>
        </main>
      </div>
      <div className="fixed bottom-[5.5rem] right-4 z-40 flex flex-col gap-2 md:bottom-5 md:right-5">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-2xl shadow-[var(--glow)]/30 md:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Open quick launcher"
          title="Quick launcher"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <div className="hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--background-elevated)]/82 p-1.5 shadow-2xl shadow-black/30 backdrop-blur-2xl md:flex md:gap-1">
          {quickActions.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="group flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-white/[0.06] hover:text-[var(--foreground)] active:scale-95"
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="h-4 w-4 transition group-hover:text-[var(--accent)]" />
            </button>
          ))}
        </div>
      </div>
      <MobileNav />
      <CommandPalette />
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
