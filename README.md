# ENG Dash — Engineering Portfolio Dashboard

Executive-level dashboard for visibility into engineering teams, projects/initiatives, sprint capacity, and delivery pipeline status across a multi-location organization.

## Quick Start

```bash
# Clone the repo
git clone <your-repo-url>
cd ENG-Dash

# Install dependencies
npm install

# Start development (runs both frontend + backend)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The SQLite database is automatically created and seeded with demo data on first run.

## Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Lucide React icons
- **Backend**: Express.js, better-sqlite3
- **Database**: SQLite (auto-created at `data/eng-dash.db`)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend (5173) and backend (3001) |
| `npm run dev:client` | Start Vite frontend only |
| `npm run dev:server` | Start Express backend only |
| `npm run build` | Build frontend for production |
| `npm start` | Production mode (serves built frontend from Express) |

## Features

- **Dashboard**: Executive summary with KPIs, attention alerts (Red/Yellow), pipeline counts
- **Teams View**: All teams grouped by location with EM, PM, capacity utilization
- **Team Detail**: Drill-down with editable team info (EM, PM, size, capacity)
- **Projects View**: All projects with status, priority, progress, timeline
- **Project Detail**: Drill-down with editable status, blockers, story points, dates
- **Kanban Board**: Visual pipeline (TODO > In Progress > UAT > Pilot > LIVE)
- **Sprint Capacity**: Per-team utilization with color-coded bars and warnings

## Editing Data

Engineering managers can update data via Edit buttons on:
- **Team Detail** pages: Engineering Manager, Product Manager, Team Size, Sprint Capacity, Utilization
- **Project Detail** pages: Status (R/G/Y), Blockers, Story Points, Kanban Stage, Priority, UAT/LIVE Dates

All changes are persisted to SQLite and survive restarts.

## Resetting Data

To reset the database to the original demo data:

```bash
rm data/eng-dash.db
npm run dev
```

The database will be re-seeded automatically on next startup.
