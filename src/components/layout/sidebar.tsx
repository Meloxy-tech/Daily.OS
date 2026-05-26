"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  StickyNote,
  Timer,
  CheckSquare,
  Target,
  Wrench,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

const nav = [
  {
    title: "Home",
    items: [{ id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Daily tools",
    items: [
      { id: "notes", href: "/notes", label: "Notes", icon: StickyNote },
      { id: "focus", href: "/focus", label: "Focus", icon: Timer },
      { id: "tasks", href: "/tasks", label: "Tasks", icon: CheckSquare },
      { id: "habits", href: "/habits", label: "Habits", icon: Target },
      { id: "utilities", href: "/utilities", label: "Utilities", icon: Wrench },
    ],
  },
  {
    title: "Review",
    items: [
      { id: "analytics", href: "/analytics", label: "Analytics", icon: BarChart3 },
      { id: "settings", href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const flatNav = nav.flatMap((group) => group.items);

export function Sidebar() {
  const pathname = usePathname();
  const open = useAppStore((s) => s.sidebarOpen);
  const setOpen = useAppStore((s) => s.setSidebarOpen);
  const user = useAppStore((s) => s.user);
  const accent = useAppStore((s) => s.accentColor);
  const favoriteTools = useAppStore((s) => s.favoriteTools);
  const recentTools = useAppStore((s) => s.recentTools);
  const toggleFavoriteTool = useAppStore((s) => s.toggleFavoriteTool);
  const recordToolUse = useAppStore((s) => s.recordToolUse);
  const favoriteItems = favoriteTools
    .map((id) => flatNav.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4);
  const recentItems = recentTools
    .map((id) => flatNav.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 248 : 76 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="sticky top-0 z-10 hidden h-screen flex-col border-r border-[var(--border-soft)] bg-[var(--background-elevated)]/64 shadow-[12px_0_48px_-36px_rgba(0,0,0,0.8)] backdrop-blur-2xl md:flex"
    >
      <div className="flex h-[4.25rem] items-center gap-3 px-5">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-semibold text-[#0e0d12] transition-transform duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(145deg, ${accent}, #b8a4d4)`,
            boxShadow: `0 4px 24px -4px ${accent}50`,
          }}
        >
          D
        </div>
        {open && (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">DailyOS</p>
            <p className="text-[11px] text-[var(--muted)]">Your calm space</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {open && favoriteItems.length > 0 && (
          <div>
            <p className="section-label mb-2 px-3">Pinned</p>
            <div className="space-y-1">
              {favoriteItems.map((item) => {
                if (!item) return null;
                const active = pathname === item.href;
                return (
                  <Link
                    key={`fav-${item.href}`}
                    href={item.href}
                    onClick={() => recordToolUse(item.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-300",
                      active
                        ? "bg-white/[0.07] text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,248,240,0.06),0_0_24px_-8px_var(--glow)]"
                        : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground-soft)]"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", active && "text-[var(--accent)]")} />
                    <span className="tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {nav.map((group) => (
          <div key={group.title}>
            {open && <p className="section-label mb-2 px-3">{group.title}</p>}
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const favorite = favoriteTools.includes(item.id);
                return (
                  <div
                    key={item.href}
                    className={cn(
                      "group/nav flex items-center rounded-xl text-sm transition-all duration-300",
                      active
                        ? "bg-white/[0.07] text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,248,240,0.06),0_0_24px_-8px_var(--glow)]"
                        : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--foreground-soft)]"
                    )}
                  >
                    <Link
                      href={item.href}
                      title={!open ? item.label : undefined}
                      onClick={() => recordToolUse(item.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-2.5"
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active && "text-[var(--accent)]"
                        )}
                      />
                      {open && (
                        <span className="min-w-0 flex-1 tracking-wide">
                          {item.label}
                        </span>
                      )}
                    </Link>
                    {open && (
                      <button
                        type="button"
                        onClick={() => toggleFavoriteTool(item.id)}
                        className={cn(
                          "mr-2 rounded-md p-1 opacity-0 transition group-hover/nav:opacity-100 focus-visible:opacity-100",
                          favorite && "opacity-100 text-[var(--accent-warm)]"
                        )}
                        aria-label={favorite ? `Unpin ${item.label}` : `Pin ${item.label}`}
                      >
                        <Star className="h-3.5 w-3.5" fill={favorite ? "currentColor" : "none"} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {open && recentItems.length > 0 && (
          <div>
            <p className="section-label mb-2 px-3">Recent</p>
            <div className="grid grid-cols-2 gap-2 px-1">
              {recentItems.map((item) => {
                if (!item) return null;
                return (
                  <Link
                    key={`recent-${item.href}`}
                    href={item.href}
                    onClick={() => recordToolUse(item.id)}
                    className="flex items-center gap-2 rounded-xl bg-white/[0.025] px-3 py-2 text-xs text-[var(--foreground-soft)] transition hover:bg-white/[0.05]"
                  >
                    <item.icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-[var(--border-soft)] p-4">
        {user && open && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] px-3.5 py-3 transition-colors hover:bg-white/[0.05]">
            <span className="text-xl">{user.avatar}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{user.name}</p>
              <p className="text-[10px] text-[var(--muted)]">
                {user.isGuest ? "Guest · local" : "Synced workspace"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[var(--muted)] transition-all duration-300 hover:bg-white/[0.04] hover:text-[var(--foreground-soft)]"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const recordToolUse = useAppStore((s) => s.recordToolUse);
  const items = flatNav.filter((item) =>
    ["dashboard", "notes", "focus", "tasks", "utilities"].includes(item.id)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex gap-1 border-t border-[var(--border-soft)] bg-[var(--background-elevated)]/90 px-2.5 py-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-16px_48px_-28px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => recordToolUse(item.id)}
            className={cn(
              "flex min-h-[3.65rem] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[9px] transition-all duration-300 min-[380px]:text-[10px]",
              active
                ? "bg-white/[0.06] text-[var(--accent)] shadow-[0_0_20px_-8px_var(--glow)]"
                : "text-[var(--muted)] active:scale-95"
            )}
            aria-label={item.label}
          >
            <item.icon className={cn("h-5 w-5", active && "drop-shadow-[0_0_8px_var(--glow)]")} />
            <span className="max-w-full truncate font-medium leading-none tracking-wide">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
