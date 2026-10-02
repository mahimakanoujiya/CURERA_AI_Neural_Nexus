import { Link } from 'react-router-dom';
import { useCases } from '@/context/CaseContext';
import StatusBadge from '@/components/StatusBadge';
import { Clock, AlertCircle, FileText, CalendarClock, ArrowRight, Mic, Type, Activity } from 'lucide-react';
import type { Case, CaseStatus } from '@/types';

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ProfessionalDashboard() {
  const { cases } = useCases();

  const stats: { label: string; value: number; icon: typeof Clock; color: string; bg: string }[] = [
    { label: 'New Cases', value: cases.filter((c) => c.status === 'NEW').length, icon: FileText, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Pending Review', value: cases.filter((c) => c.status === 'UNDER_REVIEW').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Awaiting Patient Info', value: cases.filter((c) => c.status === 'AWAITING_PATIENT_INFO').length, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Scheduled', value: cases.filter((c) => c.status === 'APPOINTMENT_SCHEDULED').length, icon: CalendarClock, color: 'text-accent-600', bg: 'bg-accent-50' },
  ];

  const sortedCases = [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 animate-fade-in-down">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-brand-600" />
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink-900">Professional Dashboard</h1>
        </div>
        <p className="text-sm text-ink-500">Review and manage patient cases submitted through CURERA AI.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card p-4 sm:p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-ink-500">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display text-ink-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cases */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold font-display text-ink-900">All Cases</h2>
        <span className="text-xs text-ink-400">{cases.length} total</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedCases.map((caseData, i) => (
          <CaseCard key={caseData.id} caseData={caseData} index={i} />
        ))}
      </div>

      {cases.length === 0 && (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500">No cases yet. Submit a case from the patient page to see it here.</p>
        </div>
      )}
    </div>
  );
}

function CaseCard({ caseData, index }: { caseData: Case; index: number }) {
  return (
    <Link
      to={`/professional/case/${caseData.id}`}
      className="card p-5 hover:shadow-float hover:border-brand-300 transition-all duration-200 group animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-mono font-semibold text-ink-400">{caseData.id}</span>
          <p className="text-xs text-ink-400 mt-0.5">{caseData.patientId}</p>
        </div>
        <StatusBadge status={caseData.status} size="sm" />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-ink-400 mb-3">
        <Clock className="w-3.5 h-3.5" />
        {formatRelativeTime(caseData.createdAt)}
        <span className="mx-1">·</span>
        {caseData.inputType === 'voice' ? <Mic className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
        <span className="capitalize">{caseData.inputType}</span>
      </div>

      <p className="text-sm font-semibold text-ink-800 leading-snug mb-2 line-clamp-2">
        {caseData.mainConcern}
      </p>

      <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
        <Clock className="w-3.5 h-3.5" />
        <span>{caseData.duration}</span>
      </div>

      {caseData.symptomsMentioned.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {caseData.symptomsMentioned.slice(0, 3).map((s, i) => (
            <span key={i} className="badge bg-brand-50 text-brand-700 text-[11px] px-2 py-0.5">
              {s}
            </span>
          ))}
          {caseData.symptomsMentioned.length > 3 && (
            <span className="text-[11px] text-ink-400 px-1">
              +{caseData.symptomsMentioned.length - 3} more
            </span>
          )}
        </div>
      )}

      {caseData.emergencyFlag && (
        <div className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5 mb-3">
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          <span className="text-[11px] font-semibold text-red-700">Urgent language detected</span>
        </div>
      )}

      <div className="flex items-center justify-end pt-2 border-t border-ink-100">
        <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2 transition-all">
          Review Case
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
