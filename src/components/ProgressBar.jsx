const gradients = {
  green: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
  blue: 'linear-gradient(90deg, #6366f1 0%, #818cf8 100%)',
  yellow: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
};

export default function ProgressBar({ completed, total, showLabel = true }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const colorKey = pct >= 75 ? 'green' : pct >= 40 ? 'blue' : 'yellow';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="progress-bar" style={{ flex: 1 }}>
        <div
          className={`progress-fill ${colorKey}`}
          style={{
            width: `${pct}%`,
            background: gradients[colorKey],
          }}
        />
      </div>
      {showLabel && (
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#64748b',
          minWidth: 70,
          textAlign: 'right',
          whiteSpace: 'nowrap',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <span style={{ color: '#0f172a' }}>{completed}</span>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span>{total}</span>
          <span style={{ color: '#94a3b8', marginLeft: 3, fontSize: 11 }}>{pct}%</span>
        </span>
      )}
    </div>
  );
}
