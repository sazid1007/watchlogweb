/* --------------------------------------------------------------------------
   EmptyState — shown when a search / category / tag has no matches.
   -------------------------------------------------------------------------- */

export default function EmptyState({ message = "No results found." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
      <svg
        className="h-8 w-8 text-foreground-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
        <path d="m8.5 8.5 5 5m0-5-5 5" />
      </svg>
      <p className="text-sm text-foreground-muted">{message}</p>
    </div>
  );
}
