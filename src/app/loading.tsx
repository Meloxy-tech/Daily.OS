export default function RootLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gradient-to-br from-cyan-500/40 to-violet-500/40" />
        <div className="skeleton-cozy h-3 w-24 rounded-full" />
      </div>
    </div>
  );
}
