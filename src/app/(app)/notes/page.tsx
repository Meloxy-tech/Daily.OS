"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pin,
  Star,
  Search,
  Archive,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Suspense } from "react";
import { EmptyState } from "@/components/ui/empty-state";

const MarkdownPreview = dynamic(
  () =>
    import("@/components/notes/markdown-preview").then((m) => m.MarkdownPreview),
  {
    loading: () => <div className="skeleton-cozy min-h-[200px] rounded-lg" />,
  }
);

const COLORS = ["#9bb8c4", "#b8a4d4", "#d4b896", "#8eb8a8", "#c9a87c"];

function NotesContent() {
  const params = useSearchParams();
  const notes = useAppStore((s) => s.notes);
  const addNote = useAppStore((s) => s.addNote);
  const updateNote = useAppStore((s) => s.updateNote);
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<string | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    params.get("id") ?? notes[0]?.id ?? null
  );
  const [preview, setPreview] = useState(false);

  const filtered = useMemo(() => {
    return notes
      .filter((n) => !n.isArchived)
      .filter((n) => folder === "all" || n.folder === folder)
      .filter(
        (n) =>
          !search ||
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }, [notes, search, folder]);

  const selected = notes.find((n) => n.id === selectedId) ?? filtered[0];
  const folders = ["all", ...new Set(notes.map((n) => n.folder))];

  const summarize = async () => {
    if (!selected) return;
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Summarize this note in 3 bullet points:\n\n${selected.content}`,
      }),
    });
    const data = await res.json();
    toast.message("AI Summary", { description: data.reply?.slice(0, 200) });
  };

  return (
    <AppShell title="Notes">
      <div className="flex min-h-[calc(100vh-9rem)] flex-col gap-5 lg:h-[calc(100vh-9rem)] lg:flex-row">
        <aside className="cozy-surface flex w-full flex-col lg:w-72">
          <div className="border-b border-[var(--border-soft)] p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                placeholder="Search notes..."
              />
            </div>
            <div className="mobile-scroll-row mt-2 flex gap-1 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={cn(
                    "shrink-0 rounded-lg px-2.5 py-1.5 text-[10px] transition",
                    folder === f
                      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground-soft)]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              className="mt-3 w-full gap-1"
              onClick={() => {
                const n = addNote();
                setSelectedId(n.id);
              }}
            >
              <Plus className="h-3 w-3" /> New note
            </Button>
          </div>
          <ul className="max-h-64 flex-1 space-y-1 overflow-y-auto p-3 lg:max-h-none">
            {filtered.map((note) => (
              <li key={note.id}>
                <button
                  onClick={() => setSelectedId(note.id)}
                  className={cn(
                    "mb-0.5 min-h-12 w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition-all duration-300",
                    selected?.id === note.id
                      ? "bg-white/[0.07] shadow-[0_0_20px_-12px_var(--glow)]"
                      : "hover:bg-white/[0.04]"
                  )}
                  style={{ borderLeft: `3px solid ${note.color}` }}
                >
                  <div className="flex items-center gap-1">
                    {note.isPinned && <Pin className="h-3 w-3 text-[var(--accent)]" />}
                    {note.isFavorite && <Star className="h-3 w-3 text-[var(--accent-warm)]" />}
                    <span className="truncate font-medium">{note.title}</span>
                  </div>
                    <p className="truncate text-[10px] text-[var(--muted)]">{note.folder}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {selected ? (
          <div className="cozy-surface flex min-h-[32rem] flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-soft)] px-5 py-4">
              <Input
                value={selected.title}
                onChange={(e) =>
                  updateNote(selected.id, { title: e.target.value })
                }
                className="max-w-md border-0 bg-transparent text-lg font-semibold focus-visible:ring-0"
              />
              <div className="ml-auto flex gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateNote(selected.id, { color: c })}
                    className="h-7 w-7 rounded-full ring-offset-2 ring-offset-[var(--background-elevated)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
                    style={{ background: c }}
                    aria-label={`Set note color ${c}`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="sm" aria-label={selected.isPinned ? "Unpin note" : "Pin note"} onClick={() => updateNote(selected.id, { isPinned: !selected.isPinned })}>
                <Pin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label={selected.isFavorite ? "Remove favorite" : "Favorite note"} onClick={() => updateNote(selected.id, { isFavorite: !selected.isFavorite })}>
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" aria-label="Summarize note" onClick={summarize}>
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Archive note"
                onClick={() => updateNote(selected.id, { isArchived: true })}
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPreview(!preview)}>
                {preview ? "Edit" : "Preview"}
              </Button>
            </div>
            <div className="flex flex-1 flex-col overflow-hidden p-5 md:p-6">
              {selected.tags.length > 0 && (
                <div className="mb-2 flex gap-1">
                  {selected.tags.map((t) => (
                    <Badge key={t} variant="secondary">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
              {preview ? (
                <article className="prose prose-invert prose-cozy max-w-none flex-1 overflow-y-auto text-sm">
                  <MarkdownPreview content={selected.content} />
                </article>
              ) : (
                <Textarea
                  value={selected.content}
                  onChange={(e) =>
                    updateNote(selected.id, { content: e.target.value })
                  }
                  className="min-h-[300px] flex-1 resize-none font-mono text-sm"
                  placeholder="A quiet place for your thoughts..."
                />
              )}
              <p className="mt-3 text-[10px] text-[var(--muted)]">
                Saved softly · Markdown welcome
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            className="flex-1"
            icon="📝"
            title="Your journal awaits"
            description="Pick a note from the left, or start fresh — no pressure."
            action={
              <Button
                size="sm"
                onClick={() => {
                  const n = addNote();
                  setSelectedId(n.id);
                }}
              >
                <Plus className="h-3 w-3" /> New note
              </Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}

export default function NotesPage() {
  return (
    <Suspense>
      <NotesContent />
    </Suspense>
  );
}
