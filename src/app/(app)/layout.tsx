"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/stores/app-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.user);
  const initGuest = useAppStore((s) => s.initGuest);
  const pathname = usePathname();

  useEffect(() => {
    if (!user && pathname !== "/login") {
      const stored = localStorage.getItem("dailyos-storage");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.state?.user) return;
        } catch {
          /* ignore */
        }
      }
      initGuest("Explorer", "🚀");
    }
  }, [user, pathname, initGuest]);

  return <>{children}</>;
}
