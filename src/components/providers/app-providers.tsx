"use client";

import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { AmbientBackground } from "@/components/ui/ambient-background";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const seedDemoData = useAppStore((s) => s.seedDemoData);
  const notes = useAppStore((s) => s.notes);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && notes.length === 0) {
      seedDemoData();
    }
  }, [notes.length, seedDemoData]);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  return (
    <>
      <AmbientBackground />
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(20, 19, 26, 0.92)",
            border: "1px solid rgba(255, 248, 240, 0.08)",
            color: "#ece8e4",
            borderRadius: "14px",
            boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)",
          },
        }}
      />
    </>
  );
}
