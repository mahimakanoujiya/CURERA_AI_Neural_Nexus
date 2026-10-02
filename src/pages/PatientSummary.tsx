import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Send, CheckCircle2 } from 'lucide-react';
import { useCases } from '@/context/CaseContext';
import { useToast } from '@/context/ToastContext';
import CaseSummaryCard from '@/components/CaseSummaryCard';
import AnswerForm from '@/components/AnswerForm';
import type { CaseSummary, PatientAnswer } from '@/types';

export default function PatientSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCase, savePatientAnswersById } = useCases();
  const { showToast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [editInput, setEditInput] = useState('');

  const caseData = id ? getCase(id) : undefined;

  useEffect(() => {
    if (caseData) {
      setEditInput(caseData.originalInput);
    }
  }, [caseData?.id]);

  if (!caseData) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-ink-500 mb-4">Case not found.</p>
        <button onClick={() => navigate('/patient')} className="btn-primary">
          Back to Patient
        </button>
      </div>
    );
  }

  const summary: CaseSummary = {
    mainConcern: caseData.mainConcern,
    duration: caseData.duration,
    symptomsMentioned: caseData.symptomsMentioned,
    relevantInformation: caseData.relevantInformation,
    additionalQuestions: caseData.additionalQuestions,
    emergencyFlag: caseData.emergencyFlag,
  };

  const handleSaveAnswers = (answers: PatientAnswer[]) => {
    savePatientAnswersById(caseData.id, answers);
    showToast('Additional information saved', 'success');
  };

  const handleSubmitForReview = (answers: PatientAnswer[]) => {
    savePatientAnswersById(caseData.id, answers);
    showToast('Case submitted for professional review', 'success');
    setTimeout(() => navigate('/professional'), 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <button
        onClick={() => navigate('/patient')}
        className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patient
      </button>

      <div className="mb-6 animate-fade-in-down">
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-accent-50 text-accent-700 border border-accent-200">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Case {caseData.id}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-ink-900">Your Case Summary</h1>
        <p className="text-sm text-ink-500 mt-1">Review the organized summary before submitting for professional review.</p>
      </div>

      {/* Original input */}
      <div className="card p-5 mb-5 animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide">
            {caseData.inputType === 'voice' ? 'Voice Input' : 'Text Input'}
          </h3>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium">
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>
        {editMode ? (
          <div>
            <textarea
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              className="input min-h-[100px] resize-y text-sm"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setEditMode(false); showToast('Information updated', 'success'); }}
                className="btn-primary text-xs px-4 py-2"
              >
                Save Changes
              </button>
              <button onClick={() => { setEditMode(false); setEditInput(caseData.originalInput); }} className="btn-secondary text-xs px-4 py-2">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-700 leading-relaxed bg-ink-50 rounded-lg p-3.5 italic">
            "{editInput || caseData.originalInput}"
          </p>
        )}
      </div>

      {/* AI Summary */}
      <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <CaseSummaryCard summary={summary} />
      </div>

      {/* Additional Information (Interactive Answers) */}
      {caseData.additionalQuestions.length > 0 && (
        <div className="card p-6 mb-5 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold font-display text-ink-900">Additional Information</h3>
          </div>
          <AnswerForm
            questions={caseData.additionalQuestions}
            initialAnswers={caseData.patientAnswers}
            onSave={handleSaveAnswers}
            onSubmit={handleSubmitForReview}
          />
        </div>
      )}

      {/* Fallback submit button if no questions */}
      {caseData.additionalQuestions.length === 0 && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <button onClick={() => handleSubmitForReview([])} className="btn-primary flex-1">
            <Send className="w-4.5 h-4.5" />
            Submit for Professional Review
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-400">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        <span>Ready for professional review</span>
      </div>
    </div>
  );
}
