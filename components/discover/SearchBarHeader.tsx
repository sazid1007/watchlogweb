"use client";

/* --------------------------------------------------------------------------
   SearchBarHeader — rounded pill search field pinned at the top of Discover.
   -------------------------------------------------------------------------- */

interface SearchBarHeaderProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBarHeader({ value, onChange }: SearchBarHeaderProps) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search movies & shows"
        aria-label="Search movies & shows"
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full rounded-full border border-glass-border bg-glass pl-11 pr-4 text-base text-foreground placeholder:text-foreground-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
    </svg>
  );
}
