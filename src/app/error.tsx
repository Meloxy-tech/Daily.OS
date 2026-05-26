"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="section-label">Something went wrong</p>
      <h1 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
        DailyOS hit an unexpected error
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--foreground-soft)]">
        Your local data is safe. Try again or return to the dashboard.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href="/dashboard">
          <Button variant="outline">Go to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
