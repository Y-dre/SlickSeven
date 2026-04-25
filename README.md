# Ayuda Tracker MVP

Ayuda Tracker is a simple two-side web app for managing ayuda announcements.
It has an admin side for encoding and publishing projects, and a user side for browsing active announcements, checking schedules, and viewing location details.

## Overview

This project is built as a single deployable app:

- A Flask backend provides API endpoints and serves static frontend files.
- A React + TypeScript frontend contains two views:
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

- `server/`: Flask app, DB access layer, schema setup, and seed/verification scripts.
- `src/`: React UI, shared project logic, map/location helpers, and unit tests.
- `dist/`: built frontend output served by Flask.

## Tech Stack

- Backend: Python 3.11+, Flask, PyMySQL, python-dotenv
- Frontend: React 19, TypeScript, Vite, lucide-react
- Testing: Vitest (frontend utility/unit tests)
- Database: MySQL (commonly run via XAMPP in local setup)

## Local Setup

1. Install Python dependencies:

```bash
python -m pip install -r requirements.txt
```

2. Install frontend dependencies:

```bash
npm install
```

3. Create `.env` in project root:

```bash
API_PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ayuda
```

4. Seed mock database records:

```bash
python -m server.seed
```

5. Build frontend assets:

```bash
npm run build
```

6. Optional DB verification checks:

```bash
python -m server.verify_seed
python -m server.verify_seed --repeat=25
```

7. Run the app:

```bash
python -m server.app
```

App URLs:

- Admin: `http://127.0.0.1:3001/`
- User side: `http://127.0.0.1:3001/user`
- API health: `http://127.0.0.1:3001/api/health`

Default mock admin credentials:

- Username: `admin`
- Password: `admin123`

## Development Commands

- Frontend dev server (admin route): `npm run dev`
- Frontend dev server (user route): `npm run dev:user`
- Frontend tests: `npm test`
- Frontend tests (single run): `npm run test:run`
- Frontend production build: `npm run build`

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
- Frontend assets are built into `dist/` and served by Flask.
