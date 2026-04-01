import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, Columns3, BarChart3, Activity } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teams', icon: Users, label: 'Teams' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/kanban', icon: Columns3, label: 'Kanban Board' },
  { to: '/capacity', icon: BarChart3, label: 'Sprint Capacity' },
];

export default function Layout({ children }) {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.35)',
            }}>
              <Activity size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <h1>ENG Dash</h1>
              <span>Engineering Portfolio</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: '12px 16px 6px',
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: 'rgba(255,255,255,0.25)',
        }}>
          Navigation
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div style={{
          margin: '0 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }} />

        {/* User profile section */}
        <div style={{
          padding: '16px 16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.3px',
            flexShrink: 0,
          }}>
            AM
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.85)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              Alex Morgan
            </div>
            <div style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.35)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              VP of Engineering
            </div>
          </div>
        </div>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
