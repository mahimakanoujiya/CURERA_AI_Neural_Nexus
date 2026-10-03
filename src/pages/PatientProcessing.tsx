import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Ear, Brain, FileText, ClipboardCheck } from 'lucide-react';
import { useCases } from '@/context/CaseContext';

interface ProcessingState {
  input: string;
  inputType: 'voice' | 'text';
  consent?: boolean;
}

const STEPS = [
  { icon: Ear, label: 'Listening', desc: 'Capturing patient input' },
  { icon: Brain, label: 'Understanding', desc: 'Analyzing the description' },
  { icon: FileText, label: 'Structuring', desc: 'Organizing information' },
  { icon: ClipboardCheck, label: 'Preparing for Professional Review', desc: 'Finalizing case summary' },
];

export default function PatientProcessing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCase } = useCases();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(false);

  const state = location.state as ProcessingState | null;

  useEffect(() => {
    if (!state?.input) {
      navigate('/patient');
      return;
    }

    let cancelled = false;
    let stepIdx = 0;

    const advance = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return;
        stepIdx = i;
        setCurrentStep(i);
        await new Promise((r) => setTimeout(r, 1200));
      }
      if (cancelled) return;

      try {
        const newCase = await addCase(state.input, state.inputType, state.consent ?? true);
        navigate(`/patient/summary/${newCase.id}`);
      } catch {
        setError(true);
      }
    };

    advance();

    return () => {
      cancelled = true;
    };
  }, [state, addCase, navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-red-600 font-semibold mb-4">Something went wrong while processing your case.</p>
        <button onClick={() => navigate('/patient')} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="text-center mb-10 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold font-display text-ink-900">CURERA AI is processing</h1>
        <p className="text-sm text-ink-500 mt-1">Organizing your information for professional review</p>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all duration-500 ${
                isActive
                  ? 'bg-white border-brand-300 shadow-card scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white/50 border-ink-200/40 opacity-50'
              }`}
              style={{
                opacity: idx <= currentStep ? 1 : 0.4,
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-soft'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-ink-100 text-ink-400'
                }`}
              >
                {isDone ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <Icon className="w-5 h-5 animate-pulse" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isActive ? 'text-brand-700' : isDone ? 'text-emerald-700' : 'text-ink-500'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-ink-400 mt-0.5">{step.desc}</p>
              </div>
              {isActive && (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-ink-400 mt-8 animate-pulse-soft">
        AI assists communication. Healthcare professionals decide.
      </p>
    </div>
  );
}
