import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import EditTeamModal from '../components/EditTeamModal';
import { ArrowLeft, MapPin, User, Briefcase, Users, Gauge, Zap, FolderKanban, AlertTriangle, Pencil } from 'lucide-react';

export default function TeamDetail() {
  const { id } = useParams();
  const { data: team, loading, refetch } = useApi(`/api/teams/${id}`);
  const [editing, setEditing] = useState(false);

  if (loading || !team) return <div className="page-header"><h2>Loading...</h2></div>;

  const teamProjects = team.projects || [];
  const available = team.sprintCapacity - team.currentUtilization;
  const utilPct = Math.round((team.currentUtilization / team.sprintCapacity) * 100);
  const isOverloaded = available === 0;

  const statCards = [
    { label: 'Sprint Capacity', value: `${team.sprintCapacity} SP`, icon: Gauge, iconBg: '#eff6ff', iconColor: '#3b82f6' },
    { label: 'Utilized', value: `${team.currentUtilization} SP`, sub: `${utilPct}% of capacity`, icon: Zap, iconBg: '#fff7ed', iconColor: '#f97316' },
    { label: 'Available', value: `${available} SP`, icon: isOverloaded ? AlertTriangle : Gauge, iconBg: isOverloaded ? '#fef2f2' : '#f0fdf4', iconColor: isOverloaded ? '#ef4444' : '#22c55e', valueColor: isOverloaded ? '#dc2626' : '#16a34a' },
    { label: 'Active Projects', value: teamProjects.length, icon: FolderKanban, iconBg: '#faf5ff', iconColor: '#a855f7' },
  ];

  return (
    <>
      <Link to="/teams" className="back-link"><ArrowLeft size={14} /> Back to Teams</Link>

      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h2>{team.name}</h2>
            {isOverloaded && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#ef4444', background: '#fef2f2', padding: '3px 10px', borderRadius: 20 }}>
                <AlertTriangle size={12} /> At Capacity
              </span>
            )}
            <button className="btn btn-secondary" style={{ marginLeft: 8, padding: '5px 12px', fontSize: 12 }} onClick={() => setEditing(true)}>
              <Pencil size={13} style={{ marginRight: 4 }} /> Edit
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-light)' }}>
            <MapPin size={14} /><span>{team.location}</span>
          </div>
        </div>
        <div className="detail-meta">
          <div className="meta-item">
            <span className="meta-label"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} /> Engineering Manager</span></span>
            <span className="meta-value">{team.engineeringManager}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={11} /> Product Manager</span></span>
            <span className="meta-value">{team.productManager}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> Team Size</span></span>
            <span className="meta-value">{team.members} members</span>
          </div>
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
              <div className="stat-value" style={card.valueColor ? { color: card.valueColor } : undefined}>{card.value}</div>
              {card.sub && <div className="stat-sub">{card.sub}</div>}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">Capacity Utilization</div>
        <div className="card-body">
          <div className="capacity-bar-wrapper">
            <div className="capacity-bar" style={{ height: 24 }}>
              <div className="capacity-used" style={{
                width: `${Math.min(utilPct, 100)}%`,
                background: utilPct >= 95 ? 'linear-gradient(90deg, #ef4444, #f87171)' : utilPct >= 80 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #10b981, #34d399)',
                borderRadius: 10,
              }} />
            </div>
            <span className="capacity-label" style={{ fontSize: 14, fontWeight: 700, color: utilPct >= 95 ? '#ef4444' : utilPct >= 80 ? '#f59e0b' : '#10b981' }}>{utilPct}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--text-light)' }}>
            <span>{team.currentUtilization} SP utilized</span>
            <span>{available} SP available of {team.sprintCapacity} SP total</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span>Projects Assigned ({teamProjects.length})</span></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Project</th><th>Status</th><th>Stage</th><th>Progress</th><th>Story Points</th><th>UAT</th><th>LIVE</th></tr>
            </thead>
            <tbody>
              {teamProjects.map(p => (
                <tr key={p.id}>
                  <td><Link to={`/projects/${p.id}`} className="project-link">{p.name}</Link></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><span className="tag">{p.kanbanStage}</span></td>
                  <td style={{ minWidth: 160 }}><ProgressBar completed={p.completedStoryPoints} total={p.totalStoryPoints} /></td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.completedStoryPoints} / {p.totalStoryPoints}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.uatDate}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-light)' }}>{p.prodDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && <EditTeamModal team={team} onClose={() => setEditing(false)} onSaved={refetch} />}
    </>
  );
}
