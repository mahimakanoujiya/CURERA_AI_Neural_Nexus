import { useNavigate, Link } from 'react-router-dom';
import { FolderOpen, Clock, CalendarClock, ArrowRight, AlertCircle, Mic, Type, FileText, MessageSquare } from 'lucide-react';
import { useMyCases } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import { SafetyDisclaimer } from '@/components/SafetyBanner';
import type { Case } from '@/types';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function MyCases() {
  const navigate = useNavigate();
  const myCases = useMyCases();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-ink-500 mb-4">Please sign in to view your cases.</p>
        <button onClick={() => navigate('/auth')} className="btn-primary">Sign In</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 animate-fade-in-down">
        <div className="flex items-center gap-2 mb-1">
          <FolderOpen className="w-5 h-5 text-brand-600" />
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink-900">My Cases</h1>
        </div>
        <p className="text-sm text-ink-500">Your submitted cases and their current status for professional review.</p>
      </div>

      {myCases.length === 0 ? (
        <div className="card p-10 text-center animate-fade-in-up">
          <FolderOpen className="w-12 h-12 text-ink-300 mx-auto mb-3" />
          <p className="text-ink-500 mb-1 font-medium">No cases yet</p>
          <p className="text-sm text-ink-400 mb-5">Submit a case to see it here and track its status.</p>
          <Link to="/patient" className="btn-primary inline-flex">
            Submit a New Case
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myCases.map((caseData, i) => (
            <MyCaseCard key={caseData.id} caseData={caseData} index={i} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <SafetyDisclaimer />
      </div>
    </div>
  );
}

function MyCaseCard({ caseData, index }: { caseData: Case; index: number }) {
  return (
    <div
      className="card p-5 hover:shadow-float transition-all animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-ink-400">{caseData.id}</span>
          <div className="flex items-center gap-2 mt-1 text-xs text-ink-400">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(caseData.createdAt)}
            <span className="mx-1">·</span>
            {caseData.inputType === 'voice' ? <Mic className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
            <span className="capitalize">{caseData.inputType}</span>
          </div>
        </div>
        <StatusBadge status={caseData.status} size="sm" />
      </div>

      {/* AI Summary preview */}
      <div className="rounded-xl bg-accent-50/30 border border-accent-200/50 p-4 mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-bold text-accent-600">AI</span>
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Case Summary</span>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-ink-400">Main Concern</p>
            <p className="text-sm text-ink-700 mt-0.5">{caseData.mainConcern}</p>
          </div>
          <div className="flex items-start gap-2">
            <p className="text-xs font-medium text-ink-400 whitespace-nowrap">Duration:</p>
            <p className="text-sm text-ink-700">{caseData.duration}</p>
          </div>
          {caseData.symptomsMentioned.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-xs font-medium text-ink-400">Symptoms:</p>
              {caseData.symptomsMentioned.map((s, i) => (
                <span key={i} className="badge bg-brand-50 text-brand-700 text-[11px] px-2 py-0.5">{s}</span>
              ))}
            </div>
          )}
        </div>
        <p className="text-[10px] text-ink-400 mt-2">AI-generated summary · Professional review required</p>
      </div>

      {/* Professional responses */}
      {caseData.clarificationRequests.length > 0 && (
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-3.5 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Professional Requests More Info</p>
          </div>
          <div className="space-y-2">
            {caseData.clarificationRequests.map((req) => (
              <p key={req.id} className="text-sm text-ink-700 leading-relaxed">{req.message}</p>
            ))}
          </div>
        </div>
      )}

      {/* Appointment */}
      {caseData.appointment && (
        <div className="rounded-xl bg-accent-50 border border-accent-200 p-3.5 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <CalendarClock className="w-4 h-4 text-accent-600" />
            <p className="text-xs font-semibold text-accent-700 uppercase tracking-wide">Appointment Scheduled</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-ink-400">Date</p>
              <p className="font-semibold text-ink-800">{caseData.appointment.date}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Time</p>
              <p className="font-semibold text-ink-800">{caseData.appointment.time}</p>
            </div>
            <div>
              <p className="text-xs text-ink-400">Type</p>
              <p className="font-semibold text-ink-800">{caseData.appointment.type}</p>
            </div>
          </div>
          {caseData.appointment.note && (
            <p className="text-xs text-ink-500 mt-2 italic">{caseData.appointment.note}</p>
          )}
        </div>
      )}

      {/* Emergency flag */}
      {caseData.emergencyFlag && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-3">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-xs font-semibold text-red-700">Urgent language was flagged in this case</span>
        </div>
      )}

      <Link
        to={`/patient/summary/${caseData.id}`}
        className="flex items-center justify-end gap-1 text-xs font-semibold text-brand-600 hover:gap-2 transition-all pt-2 border-t border-ink-100"
      >
        View Details
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
