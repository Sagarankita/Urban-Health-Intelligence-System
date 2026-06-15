# Urban Health Intelligence System

Expo (React Native) mobile app + Express backend + PostgreSQL + Python analytics pipeline (`backend/models/untitled10.py`).

## Prerequisites

- **Node.js** (recommended: 18+)
- **PostgreSQL** (14+)
- **Python** (3.10+) with the Windows `py` launcher available (`py --version`)
- Android emulator or a physical device with Expo Go

## Repo structure

- `app/`: Expo Router app (mobile UI)
- `services/api.js`: Axios client used by the app
- `backend/`: Express + Postgres backend
- `backend/migrations/`: SQL schema
- `backend/seed/`: SQL seed data
- `backend/models/untitled10.py`: pipeline used by `/api/outbreaks/heatmap`

## Environment variables

### Mobile app (`.env` at repo root)

Create/verify:

```bash
EXPO_PUBLIC_API_URL="http://<YOUR_LAN_IP>:5000"
```

- **Android Emulator**: set to `http://10.0.2.2:5000`
- **Physical device**: set to your PC’s LAN IP (example: `http://192.168.0.114:5000`)

### Backend (`backend/.env`)

Create/verify:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=healthsys
DB_USER=postgres
DB_PASSWORD=your_password
```

Notes:
- If you created the DB as `healthSys` with quotes, use that exact case; otherwise Postgres DB names are typically lowercase.
- `DB_PASSWORD` is trimmed in code, so accidental leading spaces won’t break auth.

## Setup

### 1) Install dependencies

From repo root:

```bash
npm install
```

Backend deps:

```bash
cd backend
npm install
```

Python deps:

```bash
pip install -r backend/requirements.txt
```

### 2) Create the database

Create a Postgres DB named `healthsys` (or your chosen name in `backend/.env`).

### 3) Run migrations + seed data

From `backend/`:

```bash
npm run db:init
```

This will:
- apply SQL migrations
- seed hospitals/resources
- seed ward/city lists (Maharashtra)
- seed `ward_data` and `reports` used by the `untitled10` pipeline

### 4) Start the backend

From `backend/`:

```bash
npm run dev
```

Backend listens on `http://0.0.0.0:5000`.

### 5) Start the Expo app

From repo root:

```bash
npx expo start -c
```

## Key API endpoints

- **Outbreak/heatmap (runs Python + returns JSON)**: `GET /api/outbreaks/heatmap`
- **Force refresh** (recompute + persist snapshot): `POST /api/outbreaks/refresh`
- **Advisories**
  - list: `GET /api/advisories?city_id=...` or `GET /api/advisories?ward_id=...`
  - create: `POST /api/advisories`
  - delete: `DELETE /api/advisories/:id`
- **Geo dropdown data**
  - cities (Maharashtra): `GET /api/geo/cities?state=Maharashtra`
  - wards for a city: `GET /api/geo/cities/:cityId/wards`

## Common troubleshooting

### Axios “Network Error” in the app

- Ensure backend is reachable from the device:
  - Emulator: use `EXPO_PUBLIC_API_URL="http://10.0.2.2:5000"`
  - Physical device: use your PC LAN IP and allow port **5000** in Windows Firewall
- Restart Metro after changing `.env`:

```bash
npx expo start -c
```

### “Port 8081/8083 already in use”

Kill the existing Expo/Metro process, or start on a new port:

```bash
npx expo start --port 8084
```

