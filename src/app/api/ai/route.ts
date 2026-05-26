import { NextResponse } from "next/server";
import OpenAI from "openai";
import { isOpenAIConfigured } from "@/lib/openai";

const NOT_CONFIGURED_REPLY =
  "AI isn't set up yet. Add a valid OPENAI_API_KEY to .env.local (get one at platform.openai.com). You can still use notes, timers, and all other tools.";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message =
      typeof body?.message === "string" ? body.message.trim() : "";
    const context =
      typeof body?.context === "string" ? body.context.trim() : undefined;

    if (!message) {
      return NextResponse.json(
        { reply: "Please enter a message." },
        { status: 400 }
      );
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json({ reply: NOT_CONFIGURED_REPLY });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are DailyOS, a concise productivity assistant. Help with planning, note summaries, and focus. Keep responses under 200 words unless asked otherwise.",
        },
        ...(context ? [{ role: "user" as const, content: `Context: ${context}` }] : []),
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI error:", error);

    const err = error as { status?: number; code?: string };
    if (err.status === 401 || err.code === "invalid_api_key") {
      return NextResponse.json({
        reply:
          "Your OpenAI API key looks invalid. Update OPENAI_API_KEY in .env.local with a real key from platform.openai.com.",
      });
    }

    return NextResponse.json({
      reply: "Something went wrong reaching AI. Please try again in a moment.",
    });
  }
}
