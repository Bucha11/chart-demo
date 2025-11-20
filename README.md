# Data Processing Dashboard

Lightweight full-stack project for uploading CSV/JSON datasets, parsing and analyzing them, visualizing results, and storing upload history.

## Overview

This repository contains a backend (Node + Express + TypeScript + Prisma) and a frontend (React + Vite + TypeScript). The backend parses CSV/JSON files (up to 10MB), computes summary statistics, grouping and per-day aggregations, and caches results by SHA-256 file hash (Redis or in-memory fallback). Upload metadata is stored in PostgreSQL via Prisma.

Architecture (ASCII):

[Browser]
   |
   v
[React Frontend] --(HTTP)--> [Express API] --(Prisma)--> [PostgreSQL]
                                        \
                                         -> [Redis/in-memory cache]

## Requirements

- Node.js (>=16)
- npm
- PostgreSQL (for persistence; optional for cache)
- Redis (optional)

## Backend: Setup

1. Change to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` (see `.env.example`) and set `DATABASE_URL`.

4. Initialize Prisma and run migration:

```bash
npx prisma generate
npx prisma migrate dev --name init_uploads
```

5. Run in development:

```bash
npm run dev
```

6. Run tests:

```bash
npm test
```

## Frontend: Setup (summary)

The frontend scaffold is planned in this repository structure. To initialize a Vite React app and run it:

```bash
cd frontend
npm install
npm run dev
```

## Data processing approach

- Files are validated for size (10MB) and parsed differently for CSV (csv-parse) and JSON.
- Normalization converts numeric strings to numbers and empty strings to `null`.
- Analysis produces `summary` (count, avg, min, max for numeric fields), `groupBy` counts (by `category`), and `perDay` counts (from `timestamp`).
- Caching: SHA-256 file hash used as cache key, TTL default 300s. Uses Redis if `REDIS_URL` provided, otherwise in-memory Map fallback.
- Upload history: metadata saved into `Upload` model in PostgreSQL.

## Sample Data

Sample CSVs are in `sample-data/`:

- `sales-small.csv` – small sample (5 rows).
- `sales-medium.csv` – larger sample (~60 rows for demonstration).

## Testing

From `backend` run `npm test` to execute unit tests for parsing and analysis.

## Known limitations

- No authentication/authorization.
- History stores only metadata, not full tables.
- Files larger than 10MB are rejected.
- Frontend filtering operates on `rawPreview` only (not full dataset on server).

## Time tracking (example)

Task	Time spent
Backend setup (Express, TS, Prisma)	2h
Data parsing & analysis	2h
Frontend UI & charts	3h
Tests + README + polish	2h
