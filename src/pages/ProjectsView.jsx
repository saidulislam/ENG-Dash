import { Link, useNavigate } from 'react-router-dom';
import { kanbanStages } from '../data/constants';
import useApi from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ProgressBar from '../components/ProgressBar';
import { FolderKanban, AlertTriangle } from 'lucide-react';

const stageColors = {
  'TODO': '#94a3b8',
  'In Progress': '#3b82f6',
  'UAT': '#f97316',
  'Pilot': '#a855f7',
  'LIVE': '#22c55e',
};

export default function ProjectsView() {
  const navigate = useNavigate();
  const { data: teams, loading: tLoading } = useApi('/api/teams');
  const { data: projects, loading: pLoading } = useApi('/api/projects');

  if (tLoading || pLoading || !teams || !projects) {
    return <div className="page-header"><h2>Loading...</h2></div>;
  }

  const getTeamNames = (teamIds) => teamIds.map(id => teams.find(t => t.id === id)?.name).filter(Boolean);
  const redCount = projects.filter(p => p.status === 'Red').length;
  const yellowCount = projects.filter(p => p.status === 'Yellow').length;

  return (
    <>
      <div className="page-header">
        <h2>Projects & Initiatives</h2>
        <p>{projects.length} projects across the portfolio</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {kanbanStages.map(stage => {
          const count = projects.filter(p => p.kanbanStage === stage).length;
          return (
            <div key={stage} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 20,
              fontSize: 12, fontWeight: 500, color: 'var(--text)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: stageColors[stage], flexShrink: 0 }} />
              {stage}
              <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{count}</span>
            </div>
          );
        })}
        {(redCount > 0 || yellowCount > 0) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: '#fef2f2', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 20,
            fontSize: 12, fontWeight: 600, color: '#ef4444', marginLeft: 'auto',
          }}>
            <AlertTriangle size={13} />
            {redCount + yellowCount} need attention
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderKanban size={16} color="var(--primary)" />
            <span>All Projects</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project</th><th>Priority</th><th>Status</th><th>Stage</th>
                <th>Teams</th><th>Progress</th><th>UAT</th><th>LIVE</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                  <td>
                    <Link to={`/projects/${p.id}`} className="project-link" style={{ fontWeight: 600 }} onClick={e => e.stopPropagation()}>
                      {p.name}
                    </Link>
                    {p.status === 'Red' && <AlertTriangle size={12} color="#ef4444" style={{ marginLeft: 6, verticalAlign: 'middle' }} />}
                  </td>
                  <td><PriorityBadge priority={p.priority} /></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>
                    <span className="tag" style={{ borderLeft: `3px solid ${stageColors[p.kanbanStage] || '#94a3b8'}`, borderRadius: '2px 4px 4px 2px' }}>
                      {p.kanbanStage}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {getTeamNames(p.teamIds).map(name => (
                        <span key={name} className="location-badge" style={{ fontSize: 11 }}>{name}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ minWidth: 160 }}><ProgressBar completed={p.completedStoryPoints} total={p.totalStoryPoints} /></td>
                  <td style={{ fontSize: 12, whiteSpace: 'nowrap', color: 'var(--text-light)' }}>{p.uatDate}</td>
                  <td style={{ fontSize: 12, whiteSpace: 'nowrap', color: 'var(--text-light)' }}>{p.prodDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
