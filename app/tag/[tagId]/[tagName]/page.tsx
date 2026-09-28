"use client";

import { useParams } from "next/navigation";

export default function TagPage() {
  const { tagId, tagName } = useParams<{ tagId: string; tagName: string }>();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground">Tag</h1>
      <p className="text-foreground-muted">
        tagId: <span className="text-accent">{tagId}</span> · tagName:{" "}
        <span className="text-accent">{tagName}</span>
      </p>
    </div>
  );
}
