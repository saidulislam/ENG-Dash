const dotColors = {
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
};

export default function StatusBadge({ status }) {
  const key = status.toLowerCase();
  const cls = `status-badge status-${key}`;
  return (
    <span className={cls}>
      <span style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: dotColors[key] || '#94a3b8',
        display: 'inline-block',
        flexShrink: 0,
        boxShadow: `0 0 0 2px ${(dotColors[key] || '#94a3b8') + '25'}`,
      }} />
      {status}
    </span>
  );
}
