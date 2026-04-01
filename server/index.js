import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize DB (creates tables + seeds if empty)
import './db.js';

import teamsRouter from './routes/teams.js';
import projectsRouter from './routes/projects.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/teams', teamsRouter);
app.use('/api/projects', projectsRouter);

// In production, serve the built frontend
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ENG Dash API running on http://localhost:${PORT}`);
});
