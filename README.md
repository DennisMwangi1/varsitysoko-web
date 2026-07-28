# VarsitySoko marketing site

Public marketing site for [VarsitySoko](https://varsitysoko.co.ke) — the verified campus marketplace for Kenyan university students.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Client-side routing via `history.pushState` (see `App.tsx`)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Lead forms

Waitlist and inquiry forms POST to `VITE_LEAD_FORM_URL` when set (Formspree, Getform, or any JSON endpoint).

```bash
# .env.local
VITE_LEAD_FORM_URL=https://formspree.io/f/your-id
```

If unset, submit opens a `mailto:` to `hello@varsitysoko.co.ke` so leads are never silently dropped.

## Deploy

Static build:

```bash
npm run build
```

`dist/` is the publish folder. SPA deep links are covered by:

- `vercel.json` (Vercel)
- `public/_redirects` (Netlify)

Set the live origin in `constants.ts` (`BRAND.siteUrl`) and keep `index.html` OG/Twitter image URLs in sync.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
