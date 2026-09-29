/* --------------------------------------------------------------------------
   LoadingSpinner — shown while a TMDB request is in flight.
   -------------------------------------------------------------------------- */

export default function LoadingSpinner() {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-14">
      <span
        aria-hidden="true"
        className="h-7 w-7 animate-spin rounded-full border-2 border-glass-border border-t-accent"
      />
      <span className="text-sm text-foreground-muted">Loading…</span>
    </div>
  );
}
