import { NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

export async function GET(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ notes: [], source: "local" });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const notes = await prisma.note.findMany({
      where: { userId, isArchived: false },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Notes sync GET error:", error);
    return NextResponse.json(
      { error: "Failed to load notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: true, source: "local" });
  }

  try {
    const body = await req.json();
    const { userId, note } = body;

    if (!userId || !note?.id) {
      return NextResponse.json(
        { error: "userId and note.id are required" },
        { status: 400 }
      );
    }

    const saved = await prisma.note.upsert({
      where: { id: note.id },
      create: {
        id: note.id,
        userId,
        title: note.title,
        content: note.content,
        folder: note.folder,
        tags: note.tags,
        color: note.color,
        isPinned: note.isPinned,
        isFavorite: note.isFavorite,
        isArchived: note.isArchived,
        isChecklist: note.isChecklist,
        checklist: note.checklist,
      },
      update: {
        title: note.title,
        content: note.content,
        folder: note.folder,
        tags: note.tags,
        color: note.color,
        isPinned: note.isPinned,
        isFavorite: note.isFavorite,
        isArchived: note.isArchived,
        isChecklist: note.isChecklist,
        checklist: note.checklist,
      },
    });

    return NextResponse.json({ note: saved });
  } catch (error) {
    console.error("Notes sync POST error:", error);
    return NextResponse.json(
      { error: "Failed to save note" },
      { status: 500 }
    );
  }
}
