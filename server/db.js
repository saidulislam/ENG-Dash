import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'eng-dash.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS teams (
    id                  INTEGER PRIMARY KEY,
    name                TEXT NOT NULL,
    location            TEXT NOT NULL,
    engineering_manager TEXT NOT NULL,
    product_manager     TEXT NOT NULL,
    sprint_capacity     INTEGER NOT NULL,
    current_utilization INTEGER NOT NULL,
    members             INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id                     INTEGER PRIMARY KEY,
    name                   TEXT NOT NULL,
    description            TEXT,
    total_story_points     INTEGER NOT NULL,
    completed_story_points INTEGER NOT NULL DEFAULT 0,
    status                 TEXT NOT NULL CHECK(status IN ('Red', 'Yellow', 'Green')),
    status_note            TEXT,
    uat_date               TEXT,
    prod_date              TEXT,
    kanban_stage           TEXT NOT NULL CHECK(kanban_stage IN ('TODO', 'In Progress', 'UAT', 'Pilot', 'LIVE')),
    priority               TEXT NOT NULL CHECK(priority IN ('Critical', 'High', 'Medium', 'Low'))
  );

  CREATE TABLE IF NOT EXISTS project_teams (
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    team_id    INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, team_id)
  );
`);

// Auto-seed if empty
const count = db.prepare('SELECT COUNT(*) as c FROM teams').get().c;
if (count === 0) {
  console.log('Database empty — seeding from mockData...');
  const { teams, projects } = await import('../src/data/mockData.js');

  const insertTeam = db.prepare(`
    INSERT INTO teams (id, name, location, engineering_manager, product_manager, sprint_capacity, current_utilization, members)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProject = db.prepare(`
    INSERT INTO projects (id, name, description, total_story_points, completed_story_points, status, status_note, uat_date, prod_date, kanban_stage, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProjectTeam = db.prepare(`
    INSERT INTO project_teams (project_id, team_id) VALUES (?, ?)
  `);

  const seedAll = db.transaction(() => {
    for (const t of teams) {
      insertTeam.run(t.id, t.name, t.location, t.engineeringManager, t.productManager, t.sprintCapacity, t.currentUtilization, t.members);
    }
    for (const p of projects) {
      insertProject.run(p.id, p.name, p.description, p.totalStoryPoints, p.completedStoryPoints, p.status, p.statusNote, p.uatDate, p.prodDate, p.kanbanStage, p.priority);
      for (const teamId of p.teamIds) {
        insertProjectTeam.run(p.id, teamId);
      }
    }
  });

  seedAll();
  console.log(`Seeded ${teams.length} teams and ${projects.length} projects.`);
}

// Helper: convert snake_case row to camelCase
export function toCamel(row) {
  if (!row) return null;
  const out = {};
  for (const [key, val] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] = val;
  }
  return out;
}

export default db;
