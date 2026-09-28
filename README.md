# WatchLog v0.1.0 — Shell

Next.js 14 + TypeScript + Tailwind. Dark theme `#0D0D0D` / `#1A1A1A` / `#3D5AFE`.

## Quickstart

```bash
npm install
cp .env.example .env.local
# edit .env.local -> TMDB_API_KEY=...
npm run dev
```

Open http://localhost:3000 (redirects to `/discover`).

## Env

| Var | Scope | Required |
|-----|-------|----------|
| `TMDB_API_KEY` | server-only, no `NEXT_PUBLIC_` prefix | yes for live data |

`lib/tmdb.ts` throws a clear error if missing. Discover/Detail pages render a
styled fallback + skeleton grid so layout can still be verified without a key.

## Routes

- `/` → redirects to `/discover`
- `/discover` — trending / popular / search, grid `grid-cols-2 sm:3 lg:5 xl:6`,
  cards `aspect-[2/3]`, `truncate`
- `/detail/[type]/[id]` — `type = movie | tv`, appends
  `credits,videos,keywords,similar,images,watch/providers`
- `/journal`, `/settings` — placeholders for v0.2

## Layout

- `app/layout.tsx`: WL logo (`WL` badge + `WatchLog`), top navbar desktop
  (logo left, Discover/Journal/Settings right, `max-w-7xl` centered),
  bottom nav mobile, mobile top bar. Content: `max-w-7xl mx-auto px-4 md:px-8`.
- No horizontal overflow: `overflow-x-hidden` on body, `min-w-0`,
  `truncate` / `break-words`, `max-w-full` on flexible children.

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Responsive checklist (acceptance)

Test at 360px, 1280px, 1920px:

- [ ] 360px: top mobile bar visible, bottom nav visible, desktop top nav hidden.
      Discover grid = 2 cols, no horizontal scroll. Detail hero stacked,
      backdrop `h-[280px]`, info below, no overflow.
- [ ] 1280px: desktop top navbar visible (`max-w-7xl` centered), bottom nav hidden.
      Discover grid = 5 cols. Detail hero 2-col (backdrop ~60% + info).
- [ ] 1920px: content stays `max-w-7xl` centered, no stretch. Discover grid = 6 cols.
      Images use `sizes`, no layout shift / overflow.
- [ ] discover → detail works: click any card → `/detail/movie|tv/:id` loads
      hero + cast + similar. Back link returns to `/discover`.
- [ ] No layout break: long titles truncate, overviews wrap (`break-words`),
      `min-w-0` on all flex/grid children, `overflow-hidden` on cards/hero.
- [ ] `TMDB_API_KEY` server-only: no `NEXT_PUBLIC_` usage, only imported in
      server components (`lib/tmdb.ts`, `app/discover`, `app/detail`).

## Tag / PR

```bash
git checkout feat/shell
npm run build   # must pass
git tag v0.1.0
git push origin feat/shell --tags
# open PR: feat/shell -> main, title "WatchLog v0.1.0 shell"
```
