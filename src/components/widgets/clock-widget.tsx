"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

export function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <p className="timer-display text-3xl md:text-[2.5rem]">
        {format(now, "HH:mm:ss")}
      </p>
      <p className="mt-3 text-sm tracking-wide text-[var(--foreground-soft)]">
        {format(now, "EEEE, MMMM d")}
      </p>
      <div className="mt-5 flex gap-4 text-[10px] tracking-widest text-[var(--muted)]">
        <span>Local time</span>
        <span className="opacity-40">·</span>
        <span>{format(now, "zzz")}</span>
      </div>
    </div>
  );
}
