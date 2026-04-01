import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { AlertTriangle, Users, Zap, TrendingUp, Battery } from 'lucide-react';

export default function CapacityView() {
  const { data: teams, loading: tLoading } = useApi('/api/teams');
  const { data: projects, loading: pLoading } = useApi('/api/projects');

  if (tLoading || pLoading || !teams || !projects) {
    return <div className="page-header"><h2>Loading...</h2></div>;
  }

  const totalCapacity = teams.reduce((s, t) => s + t.sprintCapacity, 0);
  const totalUsed = teams.reduce((s, t) => s + t.currentUtilization, 0);
  const totalEngineers = teams.reduce((s, t) => s + t.members, 0);
  const overloadedTeams = teams.filter(t => t.currentUtilization >= t.sprintCapacity);

  const statCards = [
    { label: 'Total Org Capacity', value: `${totalCapacity} SP`, icon: Battery, iconBg: '#eff6ff', iconColor: '#3b82f6' },
    { label: 'Utilized', value: `${totalUsed} SP`, sub: `${Math.round(totalUsed / totalCapacity * 100)}% of total`, icon: Zap, iconBg: '#fff7ed', iconColor: '#f97316' },
    { label: 'Available', value: `${totalCapacity - totalUsed} SP`, icon: TrendingUp, iconBg: '#f0fdf4', iconColor: '#22c55e', valueColor: '#16a34a' },
    { label: 'Total Engineers', value: totalEngineers, icon: Users, iconBg: '#faf5ff', iconColor: '#a855f7' },
  ];

  return (
    <>
      <div className="page-header">
        <h2>Sprint Capacity</h2>
        <p>Per-team sprint capacity utilization across the organization</p>
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

      {overloadedTeams.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          background: '#fef2f2', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 8,
          marginBottom: 20, fontSize: 13, color: '#b91c1c', fontWeight: 500,
        }}>
          <AlertTriangle size={16} color="#ef4444" />
          <span>
            {overloadedTeams.length} {overloadedTeams.length === 1 ? 'team is' : 'teams are'} at 100% capacity:{' '}
            <strong>{overloadedTeams.map(t => t.name).join(', ')}</strong>
          </span>
        </div>
      )}

      <div className="card">
        <div className="card-header">Team Sprint Capacity</div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Team</th><th>Location</th><th>EM</th><th>PM</th><th>Members</th>
                <th>Capacity</th><th>Utilized</th><th>Available</th><th style={{ minWidth: 220 }}>Utilization</th><th>Projects</th>
              </tr>
            </thead>
            <tbody>
              {teams.map(team => {
                const available = team.sprintCapacity - team.currentUtilization;
                const utilPct = Math.round((team.currentUtilization / team.sprintCapacity) * 100);
                const teamProjects = projects.filter(p => p.teamIds.includes(team.id));
                const isOverloaded = utilPct >= 100;
                const barGradient = utilPct >= 95 ? 'linear-gradient(90deg, #ef4444, #f87171)' : utilPct >= 80 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #10b981, #34d399)';

                return (
                  <tr key={team.id} style={isOverloaded ? { background: 'rgba(239, 68, 68, 0.03)' } : undefined}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isOverloaded && <AlertTriangle size={13} color="#ef4444" />}
                        <Link to={`/teams/${team.id}`} className="team-link">{team.name}</Link>
                      </div>
                    </td>
                    <td><span className="location-badge">{team.location}</span></td>
                    <td style={{ fontSize: 12 }}>{team.engineeringManager}</td>
                    <td style={{ fontSize: 12 }}>{team.productManager}</td>
                    <td>{team.members}</td>
                    <td style={{ fontWeight: 600 }}>{team.sprintCapacity} SP</td>
                    <td>{team.currentUtilization} SP</td>
                    <td style={{ fontWeight: 600, color: available === 0 ? '#dc2626' : '#16a34a' }}>{available} SP</td>
                    <td>
                      <div className="capacity-bar-wrapper">
                        <div className="capacity-bar">
                          <div className="capacity-used" style={{ width: `${Math.min(utilPct, 100)}%`, background: barGradient, borderRadius: 10 }} />
                        </div>
                        <span className="capacity-label" style={{ color: utilPct >= 95 ? '#ef4444' : utilPct >= 80 ? '#f59e0b' : '#64748b', fontWeight: utilPct >= 95 ? 700 : 600 }}>
                          {utilPct}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {teamProjects.map(p => (
                          <Link key={p.id} to={`/projects/${p.id}`} className="tag" style={{ textDecoration: 'none' }}>
                            {p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name}
                          </Link>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
