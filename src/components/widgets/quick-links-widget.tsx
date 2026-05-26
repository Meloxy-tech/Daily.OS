"use client";

const links = [
  { label: "GitHub", url: "https://github.com", emoji: "💻" },
  { label: "Notion", url: "https://notion.so", emoji: "📝" },
  { label: "Calendar", url: "/utilities", emoji: "📅" },
  { label: "Focus", url: "/focus", emoji: "🎯" },
];

export function QuickLinksWidget() {
  return (
    <div className="grid h-full grid-cols-2 gap-2 p-3">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          target={l.url.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center rounded-xl bg-white/5 text-center transition hover:bg-white/10"
        >
          <span className="text-xl">{l.emoji}</span>
          <span className="mt-1 text-[10px] text-white/60">{l.label}</span>
        </a>
      ))}
    </div>
  );
}
