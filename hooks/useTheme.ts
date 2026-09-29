"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "watchlog:theme";

export type Theme = "dark" | "light";

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        document.documentElement.setAttribute("data-theme", stored);
        return;
      }
    } catch {
      // ignore
    }

    // default: dark
    document.documentElement.setAttribute("data-theme", "dark");
    setTheme("dark");
  }, []);

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle, setTheme } as const;
}
