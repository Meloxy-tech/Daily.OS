"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { AVATARS } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle2, Download, Keyboard, Palette, Sparkles } from "lucide-react";

const accents = ["#22d3ee", "#a78bfa", "#f472b6", "#34d399", "#fbbf24"];

export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const accentColor = useAppStore((s) => s.accentColor);
  const setAccentColor = useAppStore((s) => s.setAccentColor);
  const notes = useAppStore((s) => s.notes);
  const tasks = useAppStore((s) => s.tasks);
  const habits = useAppStore((s) => s.habits);

  const exportData = () => {
    const data = { notes, tasks, habits, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dailyos-export.json";
    a.click();
    toast.success("Data exported");
  };

  return (
    <AppShell title="Settings">
      <div className="mx-auto max-w-2xl space-y-6">
        <GlassPanel className="p-6">
          <h3 className="font-medium">Profile</h3>
          {user && (
            <div className="mt-4">
              <p className="text-sm text-white/50">Avatar</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setUser({ ...user, avatar: a })}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                      user.avatar === a ? "ring-2 ring-cyan-400" : "bg-white/5"
                    }`}
                    aria-label={`Use ${a} avatar`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm">
                {user.name} · {user.isGuest ? "Guest account" : user.email}
              </p>
            </div>
          )}
        </GlassPanel>

        <GlassPanel className="p-6">
          <h3 className="flex items-center gap-2 font-medium">
            <Palette className="h-4 w-4 text-[var(--accent)]" />
            Theme
          </h3>
          <p className="mt-1 text-xs text-white/50">Accent color</p>
          <div className="mt-3 flex gap-2">
            {accents.map((c) => (
              <button
                key={c}
                onClick={() => setAccentColor(c)}
                className="h-10 w-10 rounded-full ring-offset-2 ring-offset-[#07070d] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
                style={{
                  background: c,
                  outline: accentColor === c ? `2px solid ${c}` : "none",
                }}
                aria-label={`Use accent color ${c}`}
              />
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h3 className="flex items-center gap-2 font-medium">
            <Download className="h-4 w-4 text-[var(--accent)]" />
            Data
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Keep a local backup of your notes, tasks, and habits whenever you want.
          </p>
          <Button variant="secondary" className="mt-4 gap-2" onClick={exportData}>
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </GlassPanel>

        <GlassPanel className="p-6 border-[var(--accent)]/20">
          <h3 className="flex items-center gap-2 font-medium">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Daily setup
          </h3>
          <p className="mt-1 text-sm text-white/50">
            DailyOS is free. Tune the app around the shortcuts and tools you use most.
          </p>
          <div className="mt-4 grid gap-2 text-sm text-[var(--foreground-soft)] sm:grid-cols-2">
            <div className="rounded-xl bg-white/[0.03] p-3">
              <Keyboard className="mb-2 h-4 w-4 text-[var(--accent)]" />
              Press Cmd/Ctrl + K to jump anywhere.
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3">
              <CheckCircle2 className="mb-2 h-4 w-4 text-[var(--accent)]" />
              Pin tools from the sidebar for muscle memory.
            </div>
          </div>
        </GlassPanel>

        {!user?.isGuest && (
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Switch account
            </Button>
          </Link>
        )}
      </div>
    </AppShell>
  );
}
