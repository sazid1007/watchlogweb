# WatchLog

WatchLog is a small movie & TV tracking web app (Next.js App Router + TypeScript + Tailwind).

What it does:
- Discover trending and searchable movies/TV from TMDB.
- View detail pages with metadata, cast, trailers and similar suggestions.
- Save titles to a local Journal (watchlist + rated entries) stored in `localStorage`.

Quickstart

```bash
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_TMDB_API_KEY in .env.local (see https://www.themoviedb.org/settings/api)
npm run dev
```

Production build

```bash
npm run build
npm start
```

Env

- `NEXT_PUBLIC_TMDB_API_KEY` — required for live data (set in `.env.local`).

Storage

- All user data (watchlist, ratings, reviews) is stored in the browser's `localStorage` under the key `watchlog:journal`.

Routes

- `/` → Discover (home)
- `/detail/[movie|tv]/[id]` → Detail pages
- `/journal` → Your watchlist and rated items
- `/settings` → Appearance, export/import, and data management

Notes

- No server-side user data — everything is local to the browser.
- The app requires a TMDB API key for live results; without it the UI will show graceful errors or empty states.

