"use client";

import { useParams } from "next/navigation";

export default function ActorPage() {
  const { personId, personName } = useParams<{
    personId: string;
    personName: string;
  }>();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground">Actor</h1>
      <p className="text-foreground-muted">
        personId: <span className="text-accent">{personId}</span> · personName:{" "}
        <span className="text-accent">{personName}</span>
      </p>
    </div>
  );
}
