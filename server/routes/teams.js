import { Router } from 'express';
import db, { toCamel } from '../db.js';

const router = Router();

// GET /api/teams — all teams
router.get('/', (req, res) => {
  const teams = db.prepare('SELECT * FROM teams ORDER BY id').all().map(toCamel);
  res.json(teams);
});

// GET /api/teams/:id — single team + its projects
router.get('/:id', (req, res) => {
  const team = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });

  const projects = db.prepare(`
    SELECT p.* FROM projects p
    JOIN project_teams pt ON p.id = pt.project_id
    WHERE pt.team_id = ?
    ORDER BY p.id
  `).all(req.params.id).map(row => {
    const proj = toCamel(row);
    proj.teamIds = db.prepare('SELECT team_id FROM project_teams WHERE project_id = ?')
      .all(row.id).map(r => r.team_id);
    return proj;
  });

  res.json({ ...toCamel(team), projects });
});

// PUT /api/teams/:id — update team fields
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Team not found' });

  const { engineeringManager, productManager, members, sprintCapacity, currentUtilization } = req.body;

  db.prepare(`
    UPDATE teams SET
      engineering_manager = COALESCE(?, engineering_manager),
      product_manager = COALESCE(?, product_manager),
      members = COALESCE(?, members),
      sprint_capacity = COALESCE(?, sprint_capacity),
      current_utilization = COALESCE(?, current_utilization)
    WHERE id = ?
  `).run(
    engineeringManager ?? null,
    productManager ?? null,
    members ?? null,
    sprintCapacity ?? null,
    currentUtilization ?? null,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM teams WHERE id = ?').get(req.params.id);
  res.json(toCamel(updated));
});

export default router;
