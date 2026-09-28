"use client";

import { useParams } from "next/navigation";

export default function DetailPage() {
  const { mediaType, mediaId } = useParams<{
    mediaType: string;
    mediaId: string;
  }>();

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground">Detail</h1>
      <p className="text-foreground-muted">
        mediaType: <span className="text-accent">{mediaType}</span> · mediaId:{" "}
        <span className="text-accent">{mediaId}</span>
      </p>
    </div>
  );
}
