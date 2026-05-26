import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.06] bg-white/[0.02] px-8 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-2xl shadow-[0_0_32px_-8px_var(--glow)]">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium tracking-tight text-[var(--foreground)]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--foreground-soft)]">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
