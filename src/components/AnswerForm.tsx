import { useState } from 'react';
import { CheckCircle2, HelpCircle, Info } from 'lucide-react';
import type { ClarificationQuestion, PatientAnswer } from '@/types';

interface AnswerFormProps {
  questions: ClarificationQuestion[];
  initialAnswers: PatientAnswer[];
  onSave: (answers: PatientAnswer[]) => void;
  onSubmit: (answers: PatientAnswer[]) => void;
}

interface AnswerState {
  questionId: string;
  answer: string | number | null;
  additionalDetails: string;
}

export default function AnswerForm({ questions, initialAnswers, onSave, onSubmit }: AnswerFormProps) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(() => {
    const initial: Record<string, AnswerState> = {};
    for (const q of questions) {
      const existing = initialAnswers.find((a) => a.questionId === q.id);
      initial[q.id] = {
        questionId: q.id,
        answer: existing ? existing.answer : null,
        additionalDetails: existing?.additionalDetails || '',
      };
    }
    return initial;
  });
  const [saved, setSaved] = useState(initialAnswers.length > 0);

  const setAnswer = (questionId: string, answer: string | number | null) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], answer, additionalDetails: answer === null ? '' : prev[questionId].additionalDetails },
    }));
    setSaved(false);
  };

  const setDetails = (questionId: string, details: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], additionalDetails: details },
    }));
    setSaved(false);
  };

  const buildPatientAnswers = (): PatientAnswer[] => {
    const result: PatientAnswer[] = [];
    for (const q of questions) {
      const state = answers[q.id];
      if (state && state.answer !== null) {
        result.push({
          questionId: q.id,
          question: q.question,
          answerType: q.answerType,
          answer: state.answer,
          additionalDetails: state.additionalDetails || undefined,
        });
      }
    }
    return result;
  };

  const handleSave = () => {
    const built = buildPatientAnswers();
    onSave(built);
    setSaved(true);
  };

  const handleSubmit = () => {
    const built = buildPatientAnswers();
    onSubmit(built);
  };

  return (
    <div>
      <div className="flex items-start gap-2.5 mb-5 rounded-xl bg-brand-50 border border-brand-200 px-4 py-3">
        <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-brand-700 leading-relaxed font-medium">
          These questions help you provide additional information for professional review.
        </p>
      </div>

      <div className="space-y-5">
        {questions.map((q, idx) => {
          const state = answers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-xl border border-ink-200 bg-white p-4 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-start gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold text-ink-800 leading-relaxed">{q.question}</p>
              </div>

              {q.answerType === 'yes_no' && (
                <YesNoInput
                  answer={state.answer}
                  additionalDetails={state.additionalDetails}
                  onAnswer={(v) => setAnswer(q.id, v)}
                  onDetails={(v) => setDetails(q.id, v)}
                />
              )}

              {q.answerType === 'scale' && (
                <ScaleInput
                  answer={state.answer}
                  onAnswer={(v) => setAnswer(q.id, v)}
                />
              )}

              {q.answerType === 'text' && (
                <TextInput
                  answer={state.answer}
                  onAnswer={(v) => setAnswer(q.id, v)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button onClick={handleSave} className="btn-secondary flex-1">
          <CheckCircle2 className="w-4.5 h-4.5" />
          Save Additional Information
        </button>
        <button onClick={handleSubmit} className="btn-primary flex-1">
          Submit for Professional Review
        </button>
      </div>

      {saved && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-emerald-600 animate-fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Additional information saved. You can still edit before submitting.</span>
        </div>
      )}
    </div>
  );
}

function YesNoInput({
  answer,
  additionalDetails,
  onAnswer,
  onDetails,
}: {
  answer: string | number | null;
  additionalDetails: string;
  onAnswer: (v: string | null) => void;
  onDetails: (v: string) => void;
}) {
  const isYes = answer === 'Yes';
  const isNo = answer === 'No';
  const isPrefer = answer === 'Prefer not to answer';

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        <SelectButton
          label="Yes"
          selected={isYes}
          onClick={() => onAnswer(isYes ? null : 'Yes')}
          color="emerald"
        />
        <SelectButton
          label="No"
          selected={isNo}
          onClick={() => onAnswer(isNo ? null : 'No')}
          color="ink"
        />
        <SelectButton
          label="Prefer not to answer"
          selected={isPrefer}
          onClick={() => onAnswer(isPrefer ? null : 'Prefer not to answer')}
          color="gray"
        />
      </div>

      {isYes && (
        <div className="mt-3 animate-fade-in">
          <label className="text-xs font-medium text-ink-500 mb-1.5 block">Please tell us more (optional)</label>
          <textarea
            value={additionalDetails}
            onChange={(e) => onDetails(e.target.value)}
            placeholder="Type your answer..."
            className="input min-h-[70px] resize-y text-sm"
          />
        </div>
      )}
    </div>
  );
}

function ScaleInput({
  answer,
  onAnswer,
}: {
  answer: string | number | null;
  onAnswer: (v: string | number | null) => void;
}) {
  const selected = typeof answer === 'number' ? answer : null;
  const isPrefer = answer === 'Prefer not to answer';

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const isSelected = selected === n;
          return (
            <button
              key={n}
              onClick={() => onAnswer(isSelected ? null : n)}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-soft scale-110 ring-2 ring-brand-300'
                  : 'bg-ink-50 text-ink-600 border border-ink-200 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-3 flex items-center gap-2 animate-fade-in">
          <span className="text-sm font-semibold text-ink-700">Severity selected:</span>
          <span className="badge bg-brand-100 text-brand-700 px-3 py-1 text-sm">
            {selected}/10
          </span>
        </div>
      )}

      <button
        onClick={() => onAnswer(isPrefer ? null : 'Prefer not to answer')}
        className={`mt-3 text-xs font-medium transition-colors ${
          isPrefer ? 'text-ink-700 font-semibold' : 'text-ink-400 hover:text-ink-600'
        }`}
      >
        {isPrefer ? '✓ Prefer not to answer' : 'Prefer not to answer'}
      </button>
    </div>
  );
}

function TextInput({
  answer,
  onAnswer,
}: {
  answer: string | number | null;
  onAnswer: (v: string | null) => void;
}) {
  const value = typeof answer === 'string' && answer !== 'Prefer not to answer' ? answer : '';
  const isPrefer = answer === 'Prefer not to answer';

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onAnswer(e.target.value || null)}
        placeholder="Type your answer..."
        className="input min-h-[70px] resize-y text-sm"
      />
      <button
        onClick={() => onAnswer(isPrefer ? null : 'Prefer not to answer')}
        className={`mt-2 text-xs font-medium transition-colors ${
          isPrefer ? 'text-ink-700 font-semibold' : 'text-ink-400 hover:text-ink-600'
        }`}
      >
        {isPrefer ? '✓ Prefer not to answer' : 'Prefer not to answer'}
      </button>
    </div>
  );
}

function SelectButton({
  label,
  selected,
  onClick,
  color,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  color: 'emerald' | 'ink' | 'gray';
}) {
  const colorClasses: Record<string, string> = {
    emerald: selected
      ? 'bg-emerald-600 text-white border-emerald-600 shadow-soft scale-105'
      : 'bg-white text-ink-600 border-ink-200 hover:border-emerald-300 hover:text-emerald-600',
    ink: selected
      ? 'bg-ink-700 text-white border-ink-700 shadow-soft scale-105'
      : 'bg-white text-ink-600 border-ink-200 hover:border-ink-400',
    gray: selected
      ? 'bg-ink-100 text-ink-500 border-ink-300 shadow-soft'
      : 'bg-white text-ink-400 border-ink-200 hover:text-ink-600',
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${colorClasses[color]}`}
    >
      {selected && '✓ '}{label}
    </button>
  );
}
