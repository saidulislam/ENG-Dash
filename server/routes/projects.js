import { Router } from 'express';
import db, { toCamel } from '../db.js';

const router = Router();

// GET /api/projects — all projects with teamIds
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY id').all();
  const projects = rows.map(row => {
    const proj = toCamel(row);
    proj.teamIds = db.prepare('SELECT team_id FROM project_teams WHERE project_id = ?')
      .all(row.id).map(r => r.team_id);
    return proj;
  });
  res.json(projects);
});

// GET /api/projects/:id — single project + assigned team objects
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Project not found' });

  const project = toCamel(row);
  project.teamIds = db.prepare('SELECT team_id FROM project_teams WHERE project_id = ?')
    .all(row.id).map(r => r.team_id);

  const teams = db.prepare(`
    SELECT t.* FROM teams t
    JOIN project_teams pt ON t.id = pt.team_id
    WHERE pt.project_id = ?
    ORDER BY t.id
  `).all(req.params.id).map(toCamel);

  res.json({ ...project, teams });
});

// PUT /api/projects/:id — update project fields
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const { status, statusNote, completedStoryPoints, kanbanStage, uatDate, prodDate, totalStoryPoints, priority } = req.body;

  db.prepare(`
    UPDATE projects SET
      status = COALESCE(?, status),
      status_note = COALESCE(?, status_note),
      completed_story_points = COALESCE(?, completed_story_points),
      kanban_stage = COALESCE(?, kanban_stage),
      uat_date = COALESCE(?, uat_date),
      prod_date = COALESCE(?, prod_date),
      total_story_points = COALESCE(?, total_story_points),
      priority = COALESCE(?, priority)
    WHERE id = ?
  `).run(
    status ?? null,
    statusNote ?? null,
    completedStoryPoints ?? null,
    kanbanStage ?? null,
    uatDate ?? null,
    prodDate ?? null,
    totalStoryPoints ?? null,
    priority ?? null,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  const proj = toCamel(updated);
  proj.teamIds = db.prepare('SELECT team_id FROM project_teams WHERE project_id = ?')
    .all(updated.id).map(r => r.team_id);
  res.json(proj);
});

export default router;
