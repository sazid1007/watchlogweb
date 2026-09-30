"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/tv", label: "TV Shows" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand-mark"><span>WL</span> WatchLog</Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
          {NAV_ITEMS.map((item) => <Link key={item.href} href={item.href} className={`nav-link ${isActive(pathname, item.href) ? "nav-link-active" : ""}`}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">{pathname === "/" ? <form action="/" className="search-form"><input name="q" aria-label="Search titles" placeholder="Search" /><span aria-hidden="true">⌕</span></form> : null}<Link href="/journal" className="journal-button">My List</Link></div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 pb-16 pt-8 sm:px-8 lg:px-12">{children}</main>
      <footer className="site-footer">2026 Copyright WatchLog</footer>
    </>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
