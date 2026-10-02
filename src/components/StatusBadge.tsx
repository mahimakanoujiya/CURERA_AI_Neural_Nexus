import type { CaseStatus } from '@/types';
import { Clock, FileText, HelpCircle, CalendarClock, CheckCircle2, CircleDot } from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<CaseStatus, { label: string; classes: string; icon: typeof Clock }> = {
  NEW: { label: 'New', classes: 'bg-brand-50 text-brand-700 border border-brand-200', icon: CircleDot },
  UNDER_REVIEW: { label: 'Under Review', classes: 'bg-amber-50 text-amber-700 border border-amber-200', icon: Clock },
  AWAITING_PATIENT_INFO: { label: 'Awaiting Info', classes: 'bg-orange-50 text-orange-700 border border-orange-200', icon: HelpCircle },
  ACCEPTED: { label: 'Accepted', classes: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: CheckCircle2 },
  APPOINTMENT_SCHEDULED: { label: 'Scheduled', classes: 'bg-accent-50 text-accent-700 border border-accent-200', icon: CalendarClock },
  COMPLETED: { label: 'Completed', classes: 'bg-ink-100 text-ink-600 border border-ink-200', icon: FileText },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`badge ${config.classes} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
}
