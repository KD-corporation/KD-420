# GameCraft — Frontend

Next.js web client for **Game Craft**, an interactive game for learning SQL through play.

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** GSAP, Framer Motion
- **HTTP:** Axios
- **Port:** `3000`

---

## Prerequisites

| Tool     | Notes                                            |
| -------- | ------------------------------------------------ |
| Node 20+ | https://nodejs.org (tested on Node 24)           |
| Make     | Optional — all steps can be run with npm too     |

The **backend must be running** (default `http://localhost:3001`) — see the
`GameCraft-backend` README.

---

## Quick start

```bash
cd gamecraft-frontend
make setup   # create .env.local + npm install
make dev     # start dev server on http://localhost:3000
```

Open http://localhost:3000 and log in with the seeded backend account:

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Email    | `demo@gamecraft.dev` (or username `demo`) |
| Password | `password123`                            |

---

## What `make setup` does

1. **`env`** — copies `.env.example` → `.env.local` (if missing).
2. **`install`** — runs `npm install`.

Run `make help` to see every target.

---

## Manual setup (without Make)

```bash
cp .env.example .env.local   # if .env.local doesn't exist
npm install
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve an existing build
npm run lint    # ESLint
```

---

## Configuration (`.env.local`)

| Variable                    | Default                 | Purpose                              |
| --------------------------- | ----------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL`       | `http://localhost:3001` | Backend base URL (most pages)        |
| `NEXT_PUBLIC_API_BASE_URL`  | `http://localhost:3001` | Backend base URL (Adduestions page)  |

Both names are set because different pages read different variables. Point them
at your backend if it isn't on `localhost:3001`.

> `NEXT_PUBLIC_*` values are inlined at **build time** — restart `npm run dev`
> (or rebuild) after changing them.

---

## Project structure

```
gamecraft-frontend/
├── src/app/                 # App Router pages
│   ├── page.tsx             # landing page
│   ├── auth/                # login, signup, OTP verification
│   ├── question/            # question list/detail
│   ├── Game/                # game modules (maze, arrange, scenario…)
│   ├── Adduestions/         # contribute tables/questions
│   ├── User-Profile/        # profile + update
│   ├── features/, about/    # static pages
│   └── components/          # shared UI (navbar, modals, forms)
├── public/                  # static assets
├── Makefile                 # setup / dev helpers
├── .env.example             # copy to .env.local
└── next.config.ts
```

---

## Troubleshooting

**`ECONNREFUSED localhost:3001` / API calls fail**
The backend isn't running — start it (`make run` in `GameCraft-backend`) or
point `NEXT_PUBLIC_API_URL` at the right address.

**Env changes don't take effect**
`NEXT_PUBLIC_*` vars are baked in at build time — restart the dev server.

**Port 3000 already in use**
```bash
lsof -ti:3000 | xargs kill -9
```

**Dependencies out of sync**
```bash
rm -rf node_modules package-lock.json && npm install
```
