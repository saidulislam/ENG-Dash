import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

const priorityConfig = {
  critical: { icon: AlertTriangle, size: 11 },
  high: { icon: ArrowUp, size: 11 },
  medium: { icon: Minus, size: 11 },
  low: { icon: ArrowDown, size: 11 },
};

export default function PriorityBadge({ priority }) {
  const key = priority.toLowerCase();
  const cls = `priority-badge priority-${key}`;
  const config = priorityConfig[key];
  const Icon = config?.icon;

  return (
    <span className={cls} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {Icon && <Icon size={config.size} strokeWidth={2.5} />}
      {priority}
    </span>
  );
}
