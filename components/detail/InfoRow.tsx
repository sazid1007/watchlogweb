import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: ReactNode;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-glass-border py-2 last:border-b-0">
      <span className="text-sm text-foreground-muted">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
