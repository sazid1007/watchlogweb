"use client";

import { useState } from "react";
import type { MediaResult } from "@/lib/types";

export default function DetailActions({ media, title }: { media: MediaResult; title: string }) {
  const { id } = media;
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(0);

  function saveForLater() {
    const list = JSON.parse(localStorage.getItem("watchlog-list") ?? "[]") as MediaResult[];
    const next = list.some((item) => item.id === id) ? list.filter((item) => item.id !== id) : [media, ...list];
    localStorage.setItem("watchlog-list", JSON.stringify(next));
    setSaved(next.some((item) => item.id === id));
    window.dispatchEvent(new Event("watchlog-list-change"));
  }

  return <div className="detail-actions"><button type="button" className={`action-button ${saved ? "action-button-active" : ""}`} onClick={saveForLater}>{saved ? "Saved to My List" : "Save to watch later"}</button><label className="rating-control">Rate <select aria-label={`Rate ${title}`} value={rating} onChange={(event) => setRating(Number(event.target.value))}><option value={0}>—</option>{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}/10</option>)}</select></label></div>;
}