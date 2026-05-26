import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="section-label">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--foreground-soft)]">
        This route does not exist. Head back to your dashboard or the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard">
          <Button>Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Home</Button>
        </Link>
      </div>
    </div>
  );
}
