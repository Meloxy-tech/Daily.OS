"use client";

import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { Pin } from "lucide-react";

export function NotesWidget() {
  const notes = useAppStore((s) => s.notes);
  const pinned = notes.filter((n) => n.isPinned && !n.isArchived).slice(0, 3);
  const recent = notes.filter((n) => !n.isArchived).slice(0, 4);

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">Quick Notes</span>
        <Link href="/notes" className="text-[10px] text-cyan-400 hover:underline">
          View all
        </Link>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {(pinned.length ? pinned : recent).map((note) => (
          <Link
            key={note.id}
            href={`/notes?id=${note.id}`}
            className="block rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 transition hover:bg-white/5"
            style={{ borderLeftColor: note.color, borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-1">
              {note.isPinned && <Pin className="h-3 w-3 text-cyan-400" />}
              <p className="truncate text-xs font-medium">{note.title}</p>
            </div>
            <p className="mt-0.5 line-clamp-1 text-[10px] text-white/40">
              {note.content.replace(/[#*`]/g, "").slice(0, 60) || "Empty note"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
