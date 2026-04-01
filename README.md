# ENG Dash — Engineering Portfolio Dashboard

Executive-level dashboard for visibility into engineering teams, projects/initiatives, sprint capacity, and delivery pipeline status across a multi-location organization.

## Quick Start

```bash
git clone https://github.com/saidulislam/ENG-Dash.git
cd ENG-Dash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The SQLite database is automatically created and seeded with demo data on first run. No additional setup required.

### Prerequisites

- **Node.js** v18 or later
- **npm** (comes with Node.js)

That's it — no external database servers, no Docker, no environment variables.

## Tech Stack

- **Frontend**: React 19, Vite 8, React Router 7, Lucide React icons
- **Backend**: Express.js 5, better-sqlite3
- **Database**: SQLite (auto-created at `data/eng-dash.db`)
- **Styling**: Plain CSS with design system inspired by Linear/Vercel/Stripe

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend (port 5173) and backend (port 3001) concurrently |
| `npm run dev:client` | Start Vite frontend only |
| `npm run dev:server` | Start Express backend only |
| `npm run build` | Build frontend for production (outputs to `dist/`) |
| `npm start` | Production mode — Express serves the built frontend + API on port 3001 |

### Production Deployment

```bash
npm run build
npm start
```

Then open [http://localhost:3001](http://localhost:3001). Express serves both the API and the built React app from a single process.

## Features

### Views & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Executive summary: KPIs, attention alerts (Red/Yellow projects), pipeline counts, all-projects table |
| Teams | `/teams` | All 11 teams grouped by location (Austin TX, New York NY, Bangalore, Pune, Virtual Consultants) |
| Team Detail | `/teams/:id` | Single team's capacity, utilization bar, assigned projects. **Editable.** |
| Projects | `/projects` | All projects with status, priority, progress bars, timeline dates |
| Project Detail | `/projects/:id` | Status/blockers, timeline, assigned teams. **Editable.** |
| Kanban Board | `/kanban` | Visual pipeline: TODO > In Progress > UAT > Pilot > LIVE |
| Sprint Capacity | `/capacity` | Per-team utilization with color-coded bars and overload warnings |

### Editing Data

Engineering managers can update data via **Edit** buttons on detail pages:

**Team Detail** (click Edit on any team):
- Engineering Manager name
- Product Manager name
- Team Size (members)
- Sprint Capacity (story points)
- Current Utilization (story points)

**Project Detail** (click Edit on any project):
- Status: Green / Yellow / Red
- Priority: Critical / High / Medium / Low
- Kanban Stage: TODO / In Progress / UAT / Pilot / LIVE
- Status Note / Blockers (free text)
- Completed Story Points
- Total Story Points
- UAT Target Date
- Production / LIVE Date

All changes are persisted to SQLite and survive server restarts.

### Status Indicators

- **Red / Yellow / Green** — project health (shown as colored badges with dot indicators)
- **Critical / High / Medium / Low** — priority (shown with directional arrow icons)
- **Capacity warnings** — teams at 100% utilization are highlighted with alert icons

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams` | List all teams |
| GET | `/api/teams/:id` | Single team with its assigned projects |
| PUT | `/api/teams/:id` | Update team fields |
| GET | `/api/projects` | List all projects (includes `teamIds` arrays) |
| GET | `/api/projects/:id` | Single project with assigned team objects |
| PUT | `/api/projects/:id` | Update project fields |

## Project Structure

```
ENG-Dash/
├── server/                   # Express backend
│   ├── index.js              # Entry point, mounts routes
│   ├── db.js                 # SQLite connection, schema, auto-seed
│   └── routes/
│       ├── teams.js          # /api/teams endpoints
│       └── projects.js       # /api/projects endpoints
├── src/                      # React frontend
│   ├── components/           # Shared UI components
│   │   ├── Layout.jsx        # Sidebar navigation + user profile
│   │   ├── StatusBadge.jsx   # Red/Yellow/Green badges
│   │   ├── PriorityBadge.jsx # Priority with icons
│   │   ├── ProgressBar.jsx   # Story point progress bars
│   │   ├── EditTeamModal.jsx # Team edit form modal
│   │   └── EditProjectModal.jsx # Project edit form modal
│   ├── pages/                # Route page components
│   │   ├── Dashboard.jsx
│   │   ├── TeamsView.jsx
│   │   ├── TeamDetail.jsx
│   │   ├── ProjectsView.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── KanbanBoard.jsx
│   │   └── CapacityView.jsx
│   ├── hooks/useApi.js       # Data fetching hook
│   ├── data/
│   │   ├── mockData.js       # Seed data (used on first DB creation)
│   │   └── constants.js      # Kanban stages, status options
│   ├── App.jsx               # Router configuration
│   ├── App.css               # Component styles
│   └── index.css             # Design system (colors, typography, shadows)
├── data/                     # SQLite database (gitignored, auto-created)
├── package.json
└── vite.config.js            # Vite config with API proxy
```

## Resetting Data

To reset the database to the original demo data:

```bash
rm data/eng-dash.db
npm run dev
```

The database will be re-seeded automatically on next startup.
