import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Square, Type, Shield, AlertTriangle, Play, Loader2, CheckCircle2, Pencil } from 'lucide-react';
import { useCases } from '@/context/CaseContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DEMO_TRANSCRIPT, formatTimer, type RecordingState } from '@/services/speechService';
import { generateCaseSummary } from '@/services/aiService';
import type { CaseSummary } from '@/types';
import { SafetyDisclaimer } from '@/components/SafetyBanner';
import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

type InputMode = 'voice' | 'text';

export default function PatientInput() {
  const navigate = useNavigate();
  const { addCase } = useCases();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<InputMode>('voice');
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [emergencyCheck, setEmergencyCheck] = useState<CaseSummary | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    setRecordingState('recording');
    setSeconds(0);
    setTranscript('');
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    setRecordingState('transcribing');
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      setTranscript(DEMO_TRANSCRIPT);
      setRecordingState('done');
    }, 2500);
  };

  const useDemoCase = () => {
    setMode('text');
    setTextInput(DEMO_TRANSCRIPT);
    setRecordingState('idle');
    setTranscript('');
  };

  const handleSubmit = async () => {
    const input = mode === 'voice' ? transcript.trim() : textInput.trim();
    if (!input) {
      setError(mode === 'voice' ? 'Please record or use a demo transcript first.' : 'Please describe what you are experiencing.');
      return;
    }
    if (!consent) {
      setError('Please provide consent before submitting.');
      return;
    }

    setError('');

    const summary = await generateCaseSummary(input);
    setEmergencyCheck(summary);

    if (summary.emergencyFlag) {
      setShowEmergencyModal(true);
      return;
    }

    await submitCase(input);
  };

  const submitCase = async (input: string) => {
    setShowEmergencyModal(false);
    navigate('/patient/processing', { state: { input, inputType: mode, consent } });
  };

  const handleEmergencyContinue = async () => {
    const input = mode === 'voice' ? transcript.trim() : textInput.trim();
    await submitCase(input);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 animate-fade-in-down">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink-900">Just Talk. Curera Listens.</h1>
        <p className="text-ink-500 mt-2">Explain what's happening naturally. No complicated forms.</p>
        {user && (
          <Link to="/my-cases" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 mt-3 transition-colors">
            <FolderOpen className="w-4 h-4" />
            View My Cases
          </Link>
        )}
      </div>

      {/* Mode toggle */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="inline-flex items-center bg-white rounded-xl border border-ink-200 shadow-soft p-1">
          <button
            onClick={() => { setMode('voice'); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'voice' ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice
          </button>
          <button
            onClick={() => { setMode('text'); setError(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              mode === 'text' ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
        </div>
      </div>

      {mode === 'voice' ? (
        <VoiceInput
          recordingState={recordingState}
          seconds={seconds}
          transcript={transcript}
          setTranscript={setTranscript}
          startRecording={startRecording}
          stopRecording={stopRecording}
          useDemoCase={useDemoCase}
        />
      ) : (
        <TextInput
          textInput={textInput}
          setTextInput={setTextInput}
          useDemoCase={useDemoCase}
        />
      )}

      {/* Consent */}
      <div className="mt-6 card p-5 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-brand-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-ink-900">Your Privacy Matters</h3>
            <p className="text-xs text-ink-500 mt-1 leading-relaxed">
              Your information is used to organize your healthcare communication for professional review.
            </p>
            <label className="flex items-start gap-2.5 mt-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-ink-300 text-brand-600 focus:ring-brand-400 cursor-pointer"
              />
              <span className="text-xs text-ink-600 leading-relaxed group-hover:text-ink-800 transition-colors">
                I consent to sharing the information I provide for professional review.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSubmit}
          disabled={!consent || (mode === 'voice' && recordingState !== 'done' && !transcript) || (mode === 'text' && !textInput.trim())}
          className="btn-primary flex-1"
        >
          <CheckCircle2 className="w-4.5 h-4.5" />
          Continue
        </button>
        <button onClick={useDemoCase} className="btn-secondary">
          Use Demo Case
        </button>
      </div>

      <div className="mt-6">
        <SafetyDisclaimer />
      </div>

      {/* Emergency modal */}
      {showEmergencyModal && emergencyCheck?.emergencyFlag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" />
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-float border border-red-200 animate-scale-in overflow-hidden">
            <div className="bg-red-50 px-6 pt-5 pb-4 border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900">Please Seek Immediate Professional Help</h3>
                  <p className="text-xs text-red-600 mt-0.5">This is not a diagnosis</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-ink-700 leading-relaxed">
                This information may require urgent medical attention. Please contact local emergency services or seek immediate professional care.
              </p>
              <p className="text-xs text-ink-500 mt-3">
                You can still submit this case for professional review. CURERA AI does not diagnose conditions.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button onClick={handleEmergencyContinue} className="btn-primary flex-1">
                  Continue to Submit
                </button>
                <button onClick={() => setShowEmergencyModal(false)} className="btn-secondary">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VoiceInput({
  recordingState,
  seconds,
  transcript,
  setTranscript,
  startRecording,
  stopRecording,
  useDemoCase,
}: {
  recordingState: RecordingState;
  seconds: number;
  transcript: string;
  setTranscript: (v: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
  useDemoCase: () => void;
}) {
  const isRecording = recordingState === 'recording';
  const isTranscribing = recordingState === 'transcribing';
  const isDone = recordingState === 'done' && transcript;

  return (
    <div className="card p-6 sm:p-8 animate-fade-in-up">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-semibold text-ink-600 mb-6">Tell us what's bothering you.</p>

        {/* Mic visualization */}
        <div className="relative mb-6">
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping-slow" />
              <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping-slow" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          <div
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? 'bg-red-500 shadow-lg shadow-red-500/30 scale-110'
                : isTranscribing
                ? 'bg-brand-500 shadow-lg shadow-brand-500/30'
                : 'bg-brand-600 shadow-soft'
            }`}
          >
            {isTranscribing ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8 text-white" fill="white" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Timer */}
        {isRecording && (
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-lg font-mono font-semibold text-ink-800">{formatTimer(seconds)}</span>
          </div>
        )}

        {/* States */}
        {recordingState === 'idle' && (
          <p className="text-xs text-ink-400 mb-4">Demo Mode: recording is simulated</p>
        )}
        {isTranscribing && (
          <p className="text-sm text-brand-600 font-medium mb-4 animate-pulse-soft">Transcribing your speech...</p>
        )}
        {isDone && (
          <div className="w-full flex items-center justify-center gap-2 mb-4 text-emerald-600 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Transcript ready</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          {!isRecording && !isTranscribing && (
            <button onClick={startRecording} className="btn-primary flex-1">
              <Mic className="w-4.5 h-4.5" />
              Start Recording
            </button>
          )}
          {isRecording && (
            <button onClick={stopRecording} className="btn-danger flex-1">
              <Square className="w-4 h-4" fill="currentColor" />
              Stop Recording
            </button>
          )}
          {isTranscribing && (
            <button disabled className="btn-secondary flex-1">
              <Loader2 className="w-4 h-4 animate-spin" />
              Transcribing...
            </button>
          )}
          <button onClick={useDemoCase} className="btn-secondary">
            <Play className="w-4 h-4" />
            Demo
          </button>
        </div>

        {/* Transcript */}
        {isDone && (
          <div className="w-full mt-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Pencil className="w-3.5 h-3.5 text-ink-400" />
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Editable Transcript</label>
            </div>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="input min-h-[100px] resize-y"
              readOnly={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TextInput({
  textInput,
  setTextInput,
  useDemoCase,
}: {
  textInput: string;
  setTextInput: (v: string) => void;
  useDemoCase: () => void;
}) {
  return (
    <div className="card p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Type className="w-4 h-4 text-ink-500" />
        <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Describe Your Symptoms</label>
      </div>
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Describe what you're experiencing in your own words..."
        className="input min-h-[180px] resize-y text-sm leading-relaxed"
      />
      <button onClick={useDemoCase} className="btn-ghost mt-3 text-xs">
        <Play className="w-3.5 h-3.5" />
        Use Demo Case
      </button>
    </div>
  );
}
