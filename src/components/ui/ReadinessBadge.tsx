import React from 'react';
import { ReadinessLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface ReadinessBadgeProps {
  level?: ReadinessLevel;
  readiness?: ReadinessLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ReadinessBadge: React.FC<ReadinessBadgeProps> = ({
  level,
  readiness,
  size = 'md',
  showIcon = true,
}) => {
  const activeLevel: ReadinessLevel = level || readiness || 'Low';

  const getStyles = () => {
    switch (activeLevel) {
      case 'High':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          dot: 'bg-emerald-600',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />,
          label: 'Data Readiness: High',
          short: 'High',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          dot: 'bg-amber-600',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />,
          label: 'Data Readiness: Medium',
          short: 'Medium',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-900',
          dot: 'bg-orange-600',
          icon: <AlertCircle className="w-3.5 h-3.5 text-orange-700 shrink-0" />,
          label: 'Data Readiness: Low',
          short: 'Low',
        };
    }
  };

  const style = getStyles();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-xs font-medium gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-medium gap-2',
  };

  return (
    <span
      id={`readiness-badge-${String(activeLevel).toLowerCase()}`}
      className={`inline-flex items-center rounded-full border ${style.bg} ${sizeClasses[size]}`}
    >
      {showIcon && style.icon}
      <span className="whitespace-nowrap">{style.label}</span>
    </span>
  );
};
