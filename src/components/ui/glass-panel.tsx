import { cn } from "@/lib/utils";

export function GlassPanel({
  className,
  children,
  glow = false,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "cozy-surface relative overflow-hidden rounded-[var(--radius-lg)] backdrop-blur-2xl",
        glow &&
          "shadow-[0_0_48px_-16px_var(--glow),0_8px_32px_-12px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_0%,rgba(155,184,196,0.07),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(201,168,124,0.05),transparent_40%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
