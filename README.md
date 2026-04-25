# Ka'Ayuda Tracker MVP

Ka'Ayuda Tracker is a simple two-side web app for managing ayuda announcements.
It has an admin side for encoding and publishing projects, and a user side for browsing active announcements, checking schedules, and viewing location details.

## Overview

This project is built as a single deployable app:

- A Flask backend provides API endpoints and serves static frontend files.
- A React + TypeScript frontend contains two views.
- Admin view (`/`) for creating, editing, publishing, and archiving ayuda projects.
- User view (`/user`) for searching/filtering published projects and viewing location/distance details.
- MySQL stores project records, schedules, requirements, eligibility, location, dependencies, and publish state.

Core capabilities:

- Project lifecycle: draft to published, plus status transitions (`upcoming`, `active`, `archived`).
- Schedule and beneficiary tracking for each ayuda project.
- Location support using Google Maps links/embeds.
- Distance display on the user side through browser geolocation.
- Mock data seeding for quick local testing and demo runs.

## Project Structure

- `backend/server/`: Flask app, DB access layer, schema setup, and seed/verification scripts.
- `backend/requirements.txt`: Python dependencies.
- `backend/.env.example`: sample backend environment variables.
- `frontend/src/`: React UI, shared project logic, map/location helpers, and unit tests.
- `frontend/dist/`: built frontend output served by Flask.
- `frontend/package.json`: frontend scripts and dependencies.

## Tech Stack

- Backend: Python 3.11+, Flask, PyMySQL, python-dotenv
- Frontend: React 19, TypeScript, Vite, lucide-react
- Testing: Vitest (frontend utility/unit tests)
- Database: MySQL (commonly run via XAMPP in local setup)

## How To Run

### 1) Install dependencies

```bash
python -m pip install -r backend/requirements.txt
npm install --prefix frontend
```

### 2) Configure environment

Create `backend/.env` (copy from `backend/.env.example`) with:

```bash
API_PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ayuda
```

Optional frontend env (`frontend/.env.local`) for Google Maps:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### 3) Prepare database

Make sure MySQL is running, then seed data:

```bash
python -m backend.server.seed
```

Optional verification:

```bash
python -m backend.server.verify_seed
python -m backend.server.verify_seed --repeat=25
```

### 4) Build frontend

```bash
npm --prefix frontend run build
```

### 5) Start backend (serves API + built frontend)

```bash
python -m backend.server.app
```

App URLs:

- Admin: `http://127.0.0.1:3001/`
- User side: `http://127.0.0.1:3001/user`
- API health: `http://127.0.0.1:3001/api/health`

Default mock admin credentials:

- Username: `admin`
- Password: `admin123`

## Development Commands

- Frontend dev server (admin): `npm --prefix frontend run dev`
- Frontend dev server (user): `npm --prefix frontend run dev:user`
- Frontend tests: `npm --prefix frontend test`
- Frontend tests (single run): `npm --prefix frontend run test:run`
- Frontend production build: `npm --prefix frontend run build`
- Backend app: `python -m backend.server.app`

## Credits

Frameworks and libraries used in this project:

- Flask: backend web framework and API routing.
- React: component-based frontend UI.
- TypeScript: static typing for frontend code.
- Vite and `@vitejs/plugin-react`: fast frontend build/dev pipeline.
- Vitest: frontend unit testing framework.
- PyMySQL: Python MySQL database driver.
- python-dotenv: environment variable loading for local config.
- lucide-react: icon set used in admin and user interfaces.

Tools and platforms used:

- Python and pip: backend runtime and dependency management.
- Node.js and npm: frontend runtime and package management.
- MySQL: relational data storage.
- XAMPP (local setup): convenient local MySQL environment.

External resources and APIs referenced:

- Google Maps URLs and embeds for location display.
- Google Maps JavaScript API (`places` library) for place search/map interactions on admin location input.
- Browser Geolocation API for user-side distance calculations.

## Notes

- Backend runtime is Flask only.
- Frontend assets are built into `frontend/dist/` and served by Flask.
