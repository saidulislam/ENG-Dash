# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ENG Dash is an Engineering Portfolio Dashboard — a React SPA for executive-level visibility into engineering teams, projects/initiatives, sprint capacity, and delivery pipeline status across a multi-location organization.

## Commands

- **Dev server:** `npm run dev` (Vite, runs on localhost:5173)
- **Build:** `npm run build` (outputs to `dist/`)
- **Preview production build:** `npm run preview`

## Tech Stack

- React 19 + Vite
- React Router v7 for client-side routing
- Lucide React for icons
- Plain CSS (no CSS framework) — all styles in `src/App.css` and `src/index.css`

## Architecture

### Data Layer
All data lives in `src/data/mockData.js` as exported arrays/constants. Currently static — no backend. Teams and projects are cross-referenced via `teamIds` arrays on project objects. Key exports: `teams`, `projects`, `kanbanStages`, `locations`.

### Routing (`src/App.jsx`)
| Route | Page | Purpose |
|---|---|---|
| `/` | Dashboard | Executive summary: stats, attention items (Red/Yellow), pipeline counts, all-projects table |
| `/teams` | TeamsView | Teams grouped by location with EM, PM, capacity, utilization |
| `/teams/:id` | TeamDetail | Single team's stats, assigned projects |
| `/projects` | ProjectsView | All projects table with status, priority, progress, dates |
| `/projects/:id` | ProjectDetail | Single project: status/blockers, timeline, assigned teams |
| `/kanban` | KanbanBoard | Visual pipeline: TODO → In Progress → UAT → Pilot → LIVE |
| `/capacity` | CapacityView | Per-team sprint capacity with utilization bars and project links |

### Component Structure
- `src/components/Layout.jsx` — Sidebar navigation + main content wrapper
- `src/components/StatusBadge.jsx` — Red/Yellow/Green status pills
- `src/components/PriorityBadge.jsx` — Critical/High/Medium/Low badges
- `src/components/ProgressBar.jsx` — Story point completion bars

### CSS Conventions
- CSS variables defined in `:root` in `index.css` for colors, spacing, shadows
- Status colors: `--green`, `--yellow`, `--red` with matching `-bg` variants
- Class naming: `.status-green`, `.priority-high`, `.kanban-card`, etc. (flat, not BEM)
- All component/page styles are in `App.css` (single file, not CSS modules)

### Key Domain Concepts
- **Status**: Red/Yellow/Green — project health indicator set by EMs
- **Kanban Stages**: TODO → In Progress → UAT → Pilot → LIVE
- **Story Points (SP)**: `totalStoryPoints` and `completedStoryPoints` per project
- **Sprint Capacity**: per-team `sprintCapacity` vs `currentUtilization` in story points
- **Teams have**: id, name, location, engineeringManager, productManager, sprintCapacity, currentUtilization, members
- **Projects have**: id, name, description, teamIds, story points, status, statusNote, uatDate, prodDate, kanbanStage, priority

## Workflow

### Plan Before Building
- Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Write detailed specs upfront to reduce ambiguity

### Verification Before Done
- Never mark a task complete without proving it works — run the dev server, check the browser
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"

### Task Management
1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

### Self-Improvement
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Review lessons at session start for this project

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Minimal code impact.
- **No Temporary Fixes**: Find root causes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Demand Elegance (Balanced)**: For non-trivial changes, pause and ask "is there a more elegant way?" Skip this for simple, obvious fixes — don't over-engineer.
- **Autonomous Bug Fixing**: When given a bug report, just fix it. Point at logs, errors, failing tests — then resolve them. Zero context switching required from the user.
