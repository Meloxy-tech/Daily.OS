"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CalculatorWidget() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);

  const input = (v: string) => {
    if (v === "C") {
      setDisplay("0");
      setPrev(null);
      setOp(null);
      return;
    }
    if (["+", "-", "×", "÷"].includes(v)) {
      setPrev(parseFloat(display));
      setOp(v);
      setDisplay("0");
      return;
    }
    if (v === "=" && prev !== null && op) {
      const cur = parseFloat(display);
      let r = cur;
      if (op === "+") r = prev + cur;
      if (op === "-") r = prev - cur;
      if (op === "×") r = prev * cur;
      if (op === "÷") r = prev / cur;
      setDisplay(String(Math.round(r * 1e10) / 1e10));
      setPrev(null);
      setOp(null);
      return;
    }
    setDisplay(display === "0" ? v : display + v);
  };

  const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "C", "0", "=", "+"];

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-2 rounded-lg bg-black/30 px-3 py-2 text-right font-mono text-xl">
        {display}
      </div>
      <div className="grid flex-1 grid-cols-4 gap-1">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => input(k)}
            className={cn(
              "rounded-lg text-xs font-medium transition",
              k === "=" ? "bg-cyan-500/30 text-cyan-200" : "bg-white/5 hover:bg-white/10",
              k === "C" && "text-red-300"
            )}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
