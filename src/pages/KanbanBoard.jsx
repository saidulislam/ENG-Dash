import { Link } from 'react-router-dom';
import { kanbanStages } from '../data/constants';
import useApi from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { Users, Calendar } from 'lucide-react';

const stageStyles = {
  'TODO': { border: '#94a3b8', headerBg: '#f1f5f9', countBg: '#e2e8f0' },
  'In Progress': { border: '#3b82f6', headerBg: '#eff6ff', countBg: '#dbeafe' },
  'UAT': { border: '#f97316', headerBg: '#fff7ed', countBg: '#fed7aa' },
  'Pilot': { border: '#a855f7', headerBg: '#faf5ff', countBg: '#e9d5ff' },
  'LIVE': { border: '#22c55e', headerBg: '#f0fdf4', countBg: '#bbf7d0' },
};

export default function KanbanBoard() {
  const { data: teams, loading: tLoading } = useApi('/api/teams');
  const { data: projects, loading: pLoading } = useApi('/api/projects');

  if (tLoading || pLoading || !teams || !projects) {
    return <div className="page-header"><h2>Loading...</h2></div>;
  }

  const getTeamNames = (teamIds) => teamIds.map(id => teams.find(t => t.id === id)?.name).filter(Boolean);

  return (
    <>
      <div className="page-header">
        <h2>Kanban Board</h2>
        <p>Project pipeline from TODO to LIVE</p>
      </div>

      <div className="kanban-container">
        {kanbanStages.map(stage => {
          const stageProjects = projects.filter(p => p.kanbanStage === stage);
          const style = stageStyles[stage];
          return (
            <div key={stage} className="kanban-column" style={{ borderTop: `3px solid ${style.border}` }}>
              <div className="kanban-column-header" style={{ background: style.headerBg }}>
                {stage}
                <span className="kanban-count" style={{ background: style.countBg, color: style.border, fontWeight: 700 }}>
                  {stageProjects.length}
                </span>
              </div>
              <div className="kanban-cards">
                {stageProjects.map(p => {
                  const pct = Math.round((p.completedStoryPoints / p.totalStoryPoints) * 100);
                  const teamNames = getTeamNames(p.teamIds);
                  return (
                    <Link to={`/projects/${p.id}`} key={p.id} className="kanban-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h4>{p.name}</h4>
                      <div className="kanban-meta">
                        <StatusBadge status={p.status} />
                        <PriorityBadge priority={p.priority} />
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <div className="progress-bar">
                          <div className={`progress-fill ${pct >= 75 ? 'green' : pct >= 40 ? 'blue' : 'yellow'}`}
                            style={{
                              width: `${pct}%`,
                              background: pct >= 75 ? 'linear-gradient(90deg, #10b981, #34d399)' : pct >= 40 ? 'linear-gradient(90deg, #6366f1, #818cf8)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                          <span style={{ fontSize: 11, color: '#64748b', fontVariantNumeric: 'tabular-nums' }}>{p.completedStoryPoints}/{p.totalStoryPoints} SP</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: pct >= 75 ? '#10b981' : pct >= 40 ? '#6366f1' : '#f59e0b' }}>{pct}%</span>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Users size={11} color="#94a3b8" />
                          <span className="kanban-teams">{teamNames.join(', ')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Calendar size={11} color="#94a3b8" />
                          <span style={{ fontSize: 11, color: 'var(--text-light)' }}>LIVE {p.prodDate}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
