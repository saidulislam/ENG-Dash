import { Link } from 'react-router-dom';
import { locations } from '../data/constants';
import useApi from '../hooks/useApi';
import { MapPin, Users, AlertTriangle } from 'lucide-react';

export default function TeamsView() {
  const { data: teams, loading: tLoading } = useApi('/api/teams');
  const { data: projects, loading: pLoading } = useApi('/api/projects');

  if (tLoading || pLoading || !teams || !projects) {
    return <div className="page-header"><h2>Loading...</h2></div>;
  }

  const getTeamProjects = (teamId) => projects.filter(p => p.teamIds.includes(teamId));
  const totalEngineers = teams.reduce((s, t) => s + t.members, 0);

  return (
    <>
      <div className="page-header">
        <h2>Engineering Teams</h2>
        <p>{teams.length} teams across {locations.length} locations -- {totalEngineers} engineers</p>
      </div>

      {locations.map(location => {
        const locationTeams = teams.filter(t => t.location === location);
        if (locationTeams.length === 0) return null;
        const locationEngineers = locationTeams.reduce((s, t) => s + t.members, 0);

        return (
          <div key={location} className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} color="var(--primary)" />
                <span>{location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="location-badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={12} />
                  {locationEngineers} engineers
                </span>
                <span className="location-badge">
                  {locationTeams.length} {locationTeams.length === 1 ? 'team' : 'teams'}
                </span>
              </div>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Engineering Manager</th>
                    <th>Product Manager</th>
                    <th>Members</th>
                    <th>Sprint Capacity</th>
                    <th>Utilized</th>
                    <th>Available</th>
                    <th>Projects</th>
                  </tr>
                </thead>
                <tbody>
                  {locationTeams.map(team => {
                    const teamProjects = getTeamProjects(team.id);
                    const available = team.sprintCapacity - team.currentUtilization;
                    const isOverloaded = available === 0;
                    return (
                      <tr key={team.id} style={isOverloaded ? { background: 'rgba(239, 68, 68, 0.03)' } : undefined}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isOverloaded && <AlertTriangle size={13} color="#ef4444" />}
                            <Link to={`/teams/${team.id}`} className="team-link" style={{ fontWeight: 600 }}>{team.name}</Link>
                          </div>
                        </td>
                        <td>{team.engineeringManager}</td>
                        <td>{team.productManager}</td>
                        <td>{team.members}</td>
                        <td>{team.sprintCapacity} SP</td>
                        <td>{team.currentUtilization} SP</td>
                        <td style={{ fontWeight: 600, color: available === 0 ? '#dc2626' : '#16a34a' }}>
                          {available} SP
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {teamProjects.map(p => (
                              <Link key={p.id} to={`/projects/${p.id}`} className="tag" style={{ textDecoration: 'none', fontSize: 11 }}>
                                {p.name.length > 22 ? p.name.slice(0, 20) + '...' : p.name}
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
        );
      })}
    </>
  );
}
