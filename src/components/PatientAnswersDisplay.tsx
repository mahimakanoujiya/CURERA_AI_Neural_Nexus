import { UserCircle, CheckCircle2, XCircle, MinusCircle, HelpCircle } from 'lucide-react';
import type { PatientAnswer } from '@/types';

export default function PatientAnswersDisplay({ answers }: { answers: PatientAnswer[] }) {
  if (answers.length === 0) return null;

  return (
    <div className="card p-5 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
          <UserCircle className="w-4.5 h-4.5 text-brand-600" />
        </div>
        <h3 className="text-sm font-bold font-display text-ink-900">Additional Information Provided by Patient</h3>
      </div>
      <p className="text-xs text-ink-400 mb-4 pl-10">Patient-provided information</p>

      <div className="space-y-3">
        {answers.map((ans, i) => (
          <div
            key={ans.questionId}
            className="rounded-xl border border-ink-200 bg-ink-50/50 p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-2.5 mb-2">
              <HelpCircle className="w-4 h-4 text-ink-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-ink-700 leading-relaxed">{ans.question}</p>
            </div>
            <div className="pl-6">
              <AnswerDisplay answer={ans} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-ink-100">
        <p className="text-[11px] text-ink-400 leading-relaxed">
          This information was provided directly by the patient. CURERA AI does not interpret these answers as a diagnosis.
        </p>
      </div>
    </div>
  );
}

function AnswerDisplay({ answer }: { answer: PatientAnswer }) {
  const value = answer.answer;

  if (value === 'Prefer not to answer') {
    return (
      <div className="flex items-center gap-2">
        <MinusCircle className="w-4 h-4 text-ink-400" />
        <span className="text-sm text-ink-500 italic">Prefer not to answer</span>
      </div>
    );
  }

  if (answer.answerType === 'yes_no') {
    const isYes = value === 'Yes';
    return (
      <div>
        <div className="flex items-center gap-2">
          {isYes ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-ink-400" />
          )}
          <span className="text-sm font-semibold text-ink-800">{value}</span>
        </div>
        {answer.additionalDetails && (
          <p className="text-sm text-ink-600 mt-2 pl-6 leading-relaxed">
            <span className="text-xs text-ink-400 font-medium">Patient detail: </span>
            {answer.additionalDetails}
          </p>
        )}
      </div>
    );
  }

  if (answer.answerType === 'scale') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-ink-700">Reported severity:</span>
        <span className="badge bg-brand-100 text-brand-700 px-3 py-1 text-sm font-bold">
          {value}/10
        </span>
      </div>
    );
  }

  // text
  return (
    <p className="text-sm text-ink-800 leading-relaxed">{value}</p>
  );
}
