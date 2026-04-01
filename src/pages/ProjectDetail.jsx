import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ProgressBar from '../components/ProgressBar';
import EditProjectModal from '../components/EditProjectModal';
import { ArrowLeft, Target, CheckCircle2, Clock, Layers, Calendar, AlertTriangle, MapPin, Users, Pencil } from 'lucide-react';

const stageColors = {
  'TODO': '#94a3b8', 'In Progress': '#3b82f6', 'UAT': '#f97316', 'Pilot': '#a855f7', 'LIVE': '#22c55e',
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, loading, refetch } = useApi(`/api/projects/${id}`);
  const [editing, setEditing] = useState(false);

  if (loading || !project) return <div className="page-header"><h2>Loading...</h2></div>;

  const assignedTeams = project.teams || [];
  const remaining = project.totalStoryPoints - project.completedStoryPoints;
  const pct = Math.round((project.completedStoryPoints / project.totalStoryPoints) * 100);
  const isAtRisk = project.status === 'Red' || project.status === 'Yellow';

  const statCards = [
    { label: 'Total Story Points', value: project.totalStoryPoints, icon: Target, iconBg: '#eff6ff', iconColor: '#3b82f6' },
    { label: 'Completed', value: project.completedStoryPoints, sub: `${pct}% done`, icon: CheckCircle2, iconBg: '#f0fdf4', iconColor: '#22c55e', valueColor: '#16a34a' },
    { label: 'Remaining', value: remaining, icon: Clock, iconBg: remaining > 0 ? '#fffbeb' : '#f0fdf4', iconColor: remaining > 0 ? '#f59e0b' : '#22c55e', valueColor: remaining > 0 ? '#ca8a04' : '#16a34a' },
    { label: 'Stage', value: project.kanbanStage, icon: Layers, iconBg: '#faf5ff', iconColor: stageColors[project.kanbanStage] || '#a855f7', isStage: true },
  ];

  return (
    <>
      <Link to="/projects" className="back-link"><ArrowLeft size={14} /> Back to Projects</Link>

      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
            <h2>{project.name}</h2>
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
            <button className="btn btn-secondary" style={{ marginLeft: 8, padding: '5px 12px', fontSize: 12 }} onClick={() => setEditing(true)}>
              <Pencil size={13} style={{ marginRight: 4 }} /> Edit
            </button>
          </div>
          <p style={{ maxWidth: 600 }}>{project.description}</p>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div className="stat-card" key={card.label}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="stat-label" style={{ marginBottom: 0 }}>{card.label}</div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color={card.iconColor} strokeWidth={2} />
                </div>
              </div>
              <div className="stat-value" style={{ ...(card.valueColor ? { color: card.valueColor } : {}), ...(card.isStage ? { fontSize: 18 } : {}) }}>
                {card.isStage ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: stageColors[project.kanbanStage] || '#94a3b8', flexShrink: 0 }} />
                    {card.value}
                  </span>
                ) : card.value}
              </div>
              {card.sub && <div className="stat-sub">{card.sub}</div>}
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        <div className="card" style={isAtRisk ? { borderLeft: `3px solid ${project.status === 'Red' ? '#ef4444' : '#f59e0b'}` } : undefined}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isAtRisk && <AlertTriangle size={15} color={project.status === 'Red' ? '#ef4444' : '#f59e0b'} />}
              <span>{isAtRisk ? 'Status & Blockers' : 'Status'}</span>
            </div>
          </div>
          <div className="card-body">
            <div className={`status-note note-${project.status.toLowerCase()}`}>{project.statusNote}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={15} color="var(--primary)" />
              <span>Timeline</span>
            </div>
          </div>
          <div className="card-body">
            <div className="date-display">
              <div className="date-item">
                <span className="date-label">UAT Target</span>
                <span className="date-value">{project.uatDate}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Production / LIVE</span>
                <span className="date-value">{project.prodDate}</span>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Overall Progress</div>
              <ProgressBar completed={project.completedStoryPoints} total={project.totalStoryPoints} />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={15} color="var(--primary)" />
            <span>Assigned Teams ({assignedTeams.length})</span>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Team</th><th>Location</th><th>Engineering Manager</th><th>Product Manager</th><th>Members</th><th>Sprint Capacity</th></tr>
            </thead>
            <tbody>
              {assignedTeams.map(t => (
                <tr key={t.id}>
                  <td><Link to={`/teams/${t.id}`} className="team-link" style={{ fontWeight: 600 }}>{t.name}</Link></td>
                  <td><span className="location-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> {t.location}</span></td>
                  <td>{t.engineeringManager}</td>
                  <td>{t.productManager}</td>
                  <td>{t.members}</td>
                  <td>{t.sprintCapacity} SP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <EditProjectModal project={project} onClose={() => setEditing(false)} onSaved={refetch} />}
    </>
  );
}
