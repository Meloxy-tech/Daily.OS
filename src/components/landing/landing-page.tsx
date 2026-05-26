"use client";

import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Timer,
  StickyNote,
  Shield,
  Zap,
  CheckSquare,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";

const features = [
  {
    icon: LayoutDashboard,
    title: "Custom dashboard",
    desc: "Drag, resize, and arrange widgets. Your command center, your way.",
  },
  {
    icon: StickyNote,
    title: "Smart notes",
    desc: "Markdown, folders, tags, checklists, and AI summaries.",
  },
  {
    icon: Timer,
    title: "Focus tools",
    desc: "Pomodoro, stopwatch, focus mode, and session tracking.",
  },
  {
    icon: Sparkles,
    title: "AI assistant",
    desc: "Plan your day, rewrite notes, and get instant insights.",
  },
];

const faqs = [
  {
    q: "Is DailyOS free?",
    a: "Yes. DailyOS is a free daily utility app for notes, timers, tasks, habits, and quick tools.",
  },
  {
    q: "Can I use it offline?",
    a: "Guest mode and PWA support let you use notes and timers offline.",
  },
  {
    q: "Where is my data stored?",
    a: "Signed-in users sync via Supabase + Postgres. Guests use encrypted local storage.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b border-[var(--border-soft)] bg-[var(--background)]/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 text-sm">
              D
            </span>
            DailyOS
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm text-[var(--foreground-soft)] md:flex"
            aria-label="Primary"
          >
            <a href="#features" className="hover:text-[var(--foreground)]">
              Features
            </a>
            <a href="#daily" className="hover:text-[var(--foreground)]">
              Daily use
            </a>
            <a href="#faq" className="hover:text-[var(--foreground)]">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="gap-1">
                Open app <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative grid-bg px-4 pb-24 pt-32">
        <div className="mx-auto max-w-6xl text-center">
          <div className="animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-4 py-1.5 text-xs text-[var(--accent)]">
              <Zap className="h-3 w-3" /> Your daily productivity OS
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Everything useful.
              <br />
              <span className="text-gradient">One beautiful place.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--foreground-soft)]">
              Notes, timers, tasks, habits, and utilities — designed like Linear
              meets Notion, built for how you actually work every day.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/login?guest=1">
                <Button size="lg" className="gap-2">
                  Start free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#daily">
                <Button variant="outline" size="lg">
                  See daily flow
                </Button>
              </Link>
            </div>
          </div>

          <div className="animate-fade-up-delay relative mx-auto mt-16 max-w-4xl">
            <GlassPanel glow className="overflow-hidden p-1">
              <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-[#0f0f18] to-[#12121f] p-6">
                <div className="grid h-full grid-cols-3 gap-3">
                  {["09:41:22", "25:00", "3 tasks"].map((label, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left"
                    >
                      <p className="text-[10px] uppercase text-white/30">
                        {["Clock", "Pomodoro", "Tasks"][i]}
                      </p>
                      <p className="mt-2 font-mono text-xl text-cyan-300/90">
                        {label}
                      </p>
                    </div>
                  ))}
                  <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left">
                    <p className="text-[10px] uppercase text-white/30">Notes</p>
                    <p className="mt-2 text-sm text-white/70">
                      ## Daily focus — Plan the day, 4 pomodoros...
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-left">
                    <p className="text-[10px] uppercase text-white/30">Habits</p>
                    <p className="mt-2 text-sm">🔥 12 day streak</p>
                  </div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      <section id="features" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">Built for daily rituals</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[var(--foreground-soft)]">
            Every tool you reach for, unified without clutter.
          </p>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title}>
                <GlassPanel className="h-full p-6 transition-transform duration-300 hover:-translate-y-0.5">
                  <f.icon className="h-8 w-8 text-[var(--accent)]" />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-[var(--foreground-soft)]">{f.desc}</p>
                </GlassPanel>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="daily" className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold">One place for everyday utility</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[var(--foreground-soft)]">
            Open DailyOS, hit one shortcut, and get to the tiny actions that keep the day moving.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {[
              { icon: StickyNote, title: "Capture", text: "Start notes instantly and keep ideas linked to the day." },
              { icon: Timer, title: "Focus", text: "Launch timers and fullscreen focus in one move." },
              { icon: CheckSquare, title: "Finish", text: "Check tasks, habits, and progress without hunting." },
              { icon: Calculator, title: "Calculate", text: "Use small utilities without opening another app." },
            ].map((item) => (
              <GlassPanel key={item.title} className="p-6">
                <item.icon className="h-7 w-7 text-[var(--accent)]" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--foreground-soft)]">{item.text}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-4 py-24">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-center text-3xl font-bold">FAQ</h2>
          {faqs.map((f) => (
            <GlassPanel key={f.q} className="p-6">
              <h4 className="font-medium">{f.q}</h4>
              <p className="mt-2 text-sm text-[var(--foreground-soft)]">{f.a}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--border-soft)] px-4 py-16 text-center">
        <Shield className="mx-auto h-8 w-8 text-[var(--accent)]/60" aria-hidden />
        <p className="mt-4 text-[var(--foreground-soft)]">
          Install as PWA · Works on mobile & desktop
        </p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button>Open DailyOS</Button>
        </Link>
      </section>

      <footer className="border-t border-[var(--border-soft)] py-8 text-center text-xs text-[var(--muted)]">
        © {new Date().getFullYear()} DailyOS · MIT License
      </footer>
    </div>
  );
}
