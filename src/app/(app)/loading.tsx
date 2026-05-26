export default function AppLoading() {
  return (
    <div className="min-h-screen px-4 py-8 md:px-8" role="status" aria-label="Loading app">
      <div className="skeleton-cozy mb-6 h-8 w-48 rounded-lg" />
      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-cozy h-52 rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
