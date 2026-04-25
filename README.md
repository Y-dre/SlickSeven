# Ayuda Tracker MVP

MVP for creating, publishing, browsing, and tracking ayuda announcements.

## Local Setup

```bash
npm.cmd install
npm.cmd run dev:admin
npm.cmd run dev:user
```

Admin runs at `http://127.0.0.1:5173/`.
User side runs at `http://127.0.0.1:5174/`.

Default mock credentials:

- Username: `admin`
- Password: `admin123`

Google Maps is enabled by adding `VITE_GOOGLE_MAPS_API_KEY` to `.env.local`. Without it, the location field falls back to manual address entry.
