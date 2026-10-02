import type { CaseSummary } from '@/types';
import { AlertTriangle, Clock, ListChecks, MessageSquare, Info, HelpCircle } from 'lucide-react';
import SafetyBanner from './SafetyBanner';

interface CaseSummaryCardProps {
  summary: CaseSummary;
  showEmergency?: boolean;
}

export default function CaseSummaryCard({ summary, showEmergency = true }: CaseSummaryCardProps) {
  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center">
            <span className="text-accent-600 font-bold text-sm">AI</span>
          </div>
          <h3 className="text-lg font-bold font-display text-ink-900">AI Case Summary</h3>
        </div>
        <span className="badge bg-accent-50 text-accent-700 border border-accent-200">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse-soft" />
          AI-Generated
        </span>
      </div>

      {showEmergency && summary.emergencyFlag && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">Please Seek Immediate Professional Help</h4>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                This information may require urgent medical attention. Please contact local emergency services or seek immediate professional care.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SummaryField icon={<Info className="w-4 h-4" />} label="Main Concern" value={summary.mainConcern} />

        <SummaryField icon={<Clock className="w-4 h-4" />} label="Duration" value={summary.duration} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="w-4 h-4 text-ink-500" />
            <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Symptoms Mentioned</h4>
          </div>
          {summary.symptomsMentioned.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {summary.symptomsMentioned.map((symptom, i) => (
                <span
                  key={i}
                  className="badge bg-brand-50 text-brand-700 border border-brand-200 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {symptom}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400 italic">No specific symptoms explicitly mentioned by patient.</p>
          )}
        </div>

        <SummaryField icon={<MessageSquare className="w-4 h-4" />} label="Relevant Information" value={summary.relevantInformation} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-ink-500" />
            <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Additional Questions</h4>
          </div>
          <ul className="space-y-2">
            {summary.additionalQuestions.map((q, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 rounded-lg bg-ink-50 border border-ink-200/60 px-3 py-2.5 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-ink-700 leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SafetyBanner />
    </div>
  );
}

function SummaryField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-ink-500">{icon}</span>
        <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">{label}</h4>
      </div>
      <p className="text-sm text-ink-800 leading-relaxed pl-6">{value}</p>
    </div>
  );
}
