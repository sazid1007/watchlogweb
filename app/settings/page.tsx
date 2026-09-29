"use client";

import { useRef } from "react";
import useTheme from "@/hooks/useTheme";
import {
  clearWatchlist,
  clearRatings,
  cleanup,
  exportEntries,
  importEntries,
} from "@/lib/journal";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClearWatchlist = () => {
    clearWatchlist();
    cleanup();
  };

  const handleClearRatings = () => {
    clearRatings();
    cleanup();
  };

  const handleExport = () => {
    const json = exportEntries();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "watchlog.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file?: File | null) => {
    const f = file ?? fileRef.current?.files?.[0];
    if (!f) return;
    try {
      const text = await f.text();
      importEntries(text);
    } catch (e) {
      // no-op: invalid file
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-28">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <section className="mt-6">
        <h2 className="text-accent font-semibold">Appearance</h2>

        <div className="mt-3 bg-surface rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="font-medium">Dark Theme</div>
            <div className="text-foreground-muted text-sm">Enable dark mode across the app</div>
          </div>
          <div>
            <button
              type="button"
              onClick={toggle}
              className="px-3 py-2 bg-glass border border-glass-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              aria-pressed={theme === "dark"}
            >
              {theme === "dark" ? "On" : "Off"}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-accent font-semibold">Data Management</h2>

        <div className="mt-3 space-y-3">
          <div className="bg-surface rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Watchlist</div>
              <div className="text-foreground-muted text-sm">Clear all items marked as "To Watch"</div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleClearWatchlist}
                className="px-3 py-2 bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Clear watchlist"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Ratings & Reviews</div>
              <div className="text-foreground-muted text-sm">Reset all your personal reviews</div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleClearRatings}
                className="px-3 py-2 bg-red-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Clear ratings"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-accent font-semibold">Data Portability</h2>

        <div className="mt-3 space-y-3">
          <div className="bg-surface rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Export Journal</div>
              <div className="text-foreground-muted text-sm">Download your journal as JSON</div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleExport}
                className="px-3 py-2 bg-glass border border-glass-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Export journal"
              >
                Export
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">Import Journal</div>
              <div className="text-foreground-muted text-sm">Restore entries from a JSON file</div>
            </div>
            <div>
              <input
                ref={fileRef}
                aria-label="Import journal file"
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => handleImport(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-2 bg-glass border border-glass-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Import journal"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
