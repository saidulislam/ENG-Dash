import { Link, useNavigate } from 'react-router-dom';
import { Users, FolderKanban, Target, Gauge, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { kanbanStages } from '../data/constants';
import useApi from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';

const stageColors = {
  'TODO': { bg: '#f1f5f9', border: '#94a3b8', text: '#475569' },
  'In Progress': { bg: '#eff6ff', border: '#3b82f6', text: '#1d4ed8' },
  'UAT': { bg: '#fff7ed', border: '#f97316', text: '#c2410c' },
  'Pilot': { bg: '#faf5ff', border: '#a855f7', text: '#7e22ce' },
  'LIVE': { bg: '#f0fdf4', border: '#22c55e', text: '#15803d' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: teams, loading: tLoading } = useApi('/api/teams');
  const { data: projects, loading: pLoading } = useApi('/api/projects');

  if (tLoading || pLoading || !teams || !projects) {
    return <div className="page-header"><h2>Loading...</h2></div>;
  }

  const totalCapacity = teams.reduce((s, t) => s + t.sprintCapacity, 0);
  const totalUtilization = teams.reduce((s, t) => s + t.currentUtilization, 0);
  const totalStoryPoints = projects.reduce((s, p) => s + p.totalStoryPoints, 0);
  const completedStoryPoints = projects.reduce((s, p) => s + p.completedStoryPoints, 0);
  const redProjects = projects.filter(p => p.status === 'Red');
  const yellowProjects = projects.filter(p => p.status === 'Yellow');

  const stageCount = kanbanStages.reduce((acc, stage) => {
    acc[stage] = projects.filter(p => p.kanbanStage === stage).length;
    return acc;
  }, {});

  const statCards = [
    {
      label: 'Teams',
      value: teams.length,
      sub: `${new Set(teams.map(t => t.location)).size} locations`,
      icon: Users,
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
    },
    {
      label: 'Active Projects',
      value: projects.length,
      sub: `${projects.filter(p => p.kanbanStage === 'In Progress').length} in progress`,
      icon: FolderKanban,
      iconBg: '#faf5ff',
      iconColor: '#a855f7',
    },
    {
      label: 'Total Story Points',
      value: totalStoryPoints.toLocaleString(),
      sub: `${completedStoryPoints.toLocaleString()} completed (${Math.round(completedStoryPoints / totalStoryPoints * 100)}%)`,
      icon: Target,
      iconBg: '#f0fdf4',
      iconColor: '#22c55e',
    },
    {
      label: 'Sprint Capacity',
      value: `${totalCapacity} SP`,
      sub: `${totalUtilization} utilized (${Math.round(totalUtilization / totalCapacity * 100)}%), ${totalCapacity - totalUtilization} available`,
      icon: Gauge,
      iconBg: '#fff7ed',
      iconColor: '#f97316',
    },
  ];

  return (
    <>
      <div className="page-header">
        <h2>Engineering Portfolio Dashboard</h2>
        <p>Overview of all teams, projects, and capacity across the organization</p>
      </div>

      <div className="stats-grid">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div className="stat-card" key={card.label}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="stat-label" style={{ marginBottom: 0 }}>{card.label}</div>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: card.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color={card.iconColor} strokeWidth={2} />
                </div>
              </div>
              <div className="stat-value">{card.value}</div>
              <div className="stat-sub">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {(redProjects.length > 0 || yellowProjects.length > 0) && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #ef4444' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} color="#ef4444" strokeWidth={2.5} />
              <span>Attention Needed</span>
              <span style={{
                fontSize: 11, fontWeight: 600, background: '#fef2f2', color: '#ef4444',
                padding: '2px 8px', borderRadius: 10, marginLeft: 4,
              }}>
                {redProjects.length + yellowProjects.length}
              </span>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {[...redProjects, ...yellowProjects].map(p => (
              <div key={p.id} style={{
                padding: '14px 20px', borderBottom: '1px solid var(--border-light)',
                background: p.status === 'Red' ? 'rgba(239, 68, 68, 0.02)' : 'rgba(245, 158, 11, 0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <AlertTriangle size={14} color={p.status === 'Red' ? '#ef4444' : '#f59e0b'} />
                  <StatusBadge status={p.status} />
                  <Link to={`/projects/${p.id}`} className="project-link" style={{ fontWeight: 600 }}>{p.name}</Link>
                  <ArrowRight size={13} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                </div>
                <div className={`status-note note-${p.status.toLowerCase()}`}>{p.statusNote}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--primary)" />
            <span>Pipeline Summary</span>
          </div>
          <Link to="/kanban" style={{ fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            View Kanban <ArrowRight size={12} />
          </Link>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12 }}>
            {kanbanStages.map(stage => {
              const colors = stageColors[stage];
              return (
                <div key={stage} style={{
                  flex: 1, textAlign: 'center', padding: '16px 8px', background: colors.bg,
                  borderRadius: 8, borderTop: `3px solid ${colors.border}`,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: colors.text }}>{stageCount[stage]}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.text, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">All Projects</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Stage</th>
                <th>Progress</th>
                <th>Story Points</th>
                <th>UAT</th>
                <th>LIVE</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                  <td><Link to={`/projects/${p.id}`} className="project-link" onClick={e => e.stopPropagation()}>{p.name}</Link></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><span className="tag">{p.kanbanStage}</span></td>
                  <td style={{ minWidth: 140 }}><ProgressBar completed={p.completedStoryPoints} total={p.totalStoryPoints} /></td>
                  <td>{p.completedStoryPoints} / {p.totalStoryPoints}</td>
                  <td style={{ fontSize: 12 }}>{p.uatDate}</td>
                  <td style={{ fontSize: 12 }}>{p.prodDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
