# Dilli Safar — Smart Delhi Transit & Discovery Engine

A tourist-facing transit navigation app for the Delhi Metro/DTC network:
fuzzy monument search, geo-proximity discovery, color-coded transit route
cards, and step-by-step interchange walkthroughs.

## Stack

- **Frontend:** React 19 (Vite), React Router v6, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **Search:** Real Elasticsearch (or any ES-compatible cluster, e.g. Elastic
  Cloud), authenticated via API key

## Quick start

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in ELASTIC_URL and ELASTIC_API_KEY
npm run seed            # one-time: creates the index + loads seed monuments
npm run dev              # or `npm start`
```

The API is live at `http://localhost:8000`. `npm run seed` (or the
server's own startup check) creates the `delhi_monuments` index with the
mapping + synonym filter defined in `src/esIndex.js` and bulk-loads the
seed monuments from `src/data/monuments.js` — safe to run repeatedly, it's
a no-op once the index exists.

Without `ELASTIC_URL`/`ELASTIC_API_KEY` set, the server still boots (so
you can hit `/api/v1/health` and the static `/api/v1/interchange` routes),
but `/search`, `/nearby`, and `/monuments/:id` will return a clear 502
until real credentials are added.

### Frontend

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Vite proxies `/api/*` requests to the
backend on port 8000 (see `vite.config.js`).

## API

| Endpoint | Description |
|---|---|
| `GET /api/v1/health` | Reports server + Elasticsearch connection status |
| `GET /api/v1/search?q=` | Fuzzy search across monument name, aliases, description |
| `GET /api/v1/nearby?lat=&lon=&radius=` | Geo-radius search, sorted by proximity |
| `GET /api/v1/monuments/:id` | Single monument detail (used by the Guide page) |
| `GET /api/v1/interchange` | List of interchange walkthroughs |
| `GET /api/v1/interchange/:slug` | Step-by-step guide for one hub |

## Data notes

Seed monuments in `backend/src/data/monuments.js` (Akshardham, Connaught
Place, India Gate, Chandni Chowk, Lotus Temple, Qutub Minar, Red Fort,
Humayun's Tomb) are cross-referenced against real DMRC station names,
coordinates, and line colors — sourced from the full station list you
provided — rather than placeholder data.

## Design system

Tokens live in `tailwind.config.js`: a night-transit-map navy base
(`ink`), warm off-white text (`paper`), a signage-amber signature accent
(`signal`), and literal DMRC line colors (`line.red`, `line.yellow`,
`line.blue`, etc.) used only for functional route indicators — never as
decoration. Display type is Space Grotesk, body is Inter, data/labels use
JetBrains Mono. The recurring signature element is the "route strip" — a
dotted horizontal rail (see `.route-strip` in `src/index.css`) used on
both the Guide transit cards and the Interchange step rail to visualize a
journey.

