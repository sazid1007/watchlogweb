"use client";

/* --------------------------------------------------------------------------
   CategoryChip — one pill in the horizontal category row.
   -------------------------------------------------------------------------- */

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function CategoryChip({ label, isActive, onClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        isActive
          ? "border-accent bg-accent text-white"
          : "border-glass-border bg-glass text-foreground-muted"
      }`}
    >
      {label}
    </button>
  );
}
