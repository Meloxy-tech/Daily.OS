"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

const quotes = [
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Unknown" },
];

export function QuotesWidget() {
  const [idx, setIdx] = useState(0);
  const q = quotes[idx % quotes.length];

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <p className="text-sm leading-relaxed text-white/80">&ldquo;{q.text}&rdquo;</p>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-white/40">— {q.author}</p>
        <button
          onClick={() => setIdx((i) => i + 1)}
          className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
