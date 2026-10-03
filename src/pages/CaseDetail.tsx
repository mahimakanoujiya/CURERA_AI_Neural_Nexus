import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  CalendarClock,
  User,
  Clock,
  AlertCircle,
  Send,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import { useCases } from '@/context/CaseContext';
import { useToast } from '@/context/ToastContext';
import StatusBadge from '@/components/StatusBadge';
import CaseSummaryCard from '@/components/CaseSummaryCard';
import PatientAnswersDisplay from '@/components/PatientAnswersDisplay';
import Timeline from '@/components/Timeline';
import Modal from '@/components/Modal';
import type { CaseSummary } from '@/types';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCase, acceptCaseById, requestMoreInfoById, scheduleAppointmentById, markUnderReviewById } = useCases();
  const { showToast } = useToast();

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptType, setApptType] = useState('Initial consultation');
  const [apptNote, setApptNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const caseData = id ? getCase(id) : undefined;

  useEffect(() => {
    if (caseData && caseData.status === 'NEW') {
      markUnderReviewById(caseData.id);
    }
  }, [caseData?.id]);

  if (!caseData) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-ink-500 mb-4">Case not found.</p>
        <button onClick={() => navigate('/professional')} className="btn-primary">
          Back to Dashboard
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

  const handleAccept = () => {
    acceptCaseById(caseData.id);
    setShowAcceptModal(false);
    showToast('Case accepted successfully', 'success');
  };

  const handleRequestInfo = () => {
    if (!infoMessage.trim()) {
      setErrors({ info: 'Please enter a message for the patient.' });
      return;
    }
    requestMoreInfoById(caseData.id, infoMessage.trim());
    setShowInfoModal(false);
    setInfoMessage('');
    setErrors({});
    showToast('Information request sent to patient', 'success');
  };

  const handleSchedule = () => {
    const errs: Record<string, string> = {};
    if (!apptDate) errs.date = 'Please select a date.';
    if (!apptTime) errs.time = 'Please select a time.';
    if (!apptType.trim()) errs.type = 'Please specify appointment type.';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    scheduleAppointmentById(caseData.id, apptDate, apptTime, apptType, apptNote.trim() || undefined);
    setShowScheduleModal(false);
    setApptDate(''); setApptTime(''); setApptType('Initial consultation'); setApptNote('');
    setErrors({});
    showToast('Appointment scheduled successfully', 'success');
  };

  const isActionDisabled = caseData.status === 'ACCEPTED' || caseData.status === 'APPOINTMENT_SCHEDULED' || caseData.status === 'COMPLETED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/professional')}
        className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 animate-fade-in-down">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-mono font-semibold text-ink-400">{caseData.id}</span>
            <StatusBadge status={caseData.status} size="sm" />
          </div>
          <h1 className="text-2xl font-bold font-display text-ink-900">Case Review</h1>
        </div>
        {caseData.emergencyFlag && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">Urgent language flagged</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Case info + AI summary */}
        <div className="lg:col-span-2 space-y-5">
          {/* Patient info */}
          <div className="card p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ink-100 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-ink-600" />
              </div>
              <h3 className="text-sm font-bold font-display text-ink-900">Patient Information</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <InfoItem label="Patient ID" value={caseData.patientId} />
              <InfoItem label="Patient Email" value={caseData.userEmail || 'Not signed in'} />
              <InfoItem label="Submitted" value={new Date(caseData.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })} />
              <InfoItem label="Input Type" value={caseData.inputType === 'voice' ? 'Voice' : 'Text'} />
              <div>
                <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Consent</p>
                <div className={`flex items-center gap-1.5 mt-0.5 ${caseData.consentGiven ? 'text-emerald-600' : 'text-red-600'}`}>
                  {caseData.consentGiven ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-semibold">Given</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-semibold">Not given</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Original input */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">Patient's Original Description</h3>
            <p className="text-sm text-ink-700 leading-relaxed bg-ink-50 rounded-lg p-3.5 italic">
              "{caseData.originalInput}"
            </p>
          </div>

          {/* AI Summary */}
          <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
            <CaseSummaryCard summary={summary} />
          </div>

          {/* Patient-provided additional answers */}
          {caseData.patientAnswers.length > 0 && (
            <div className="animate-fade-in-up" style={{ animationDelay: '140ms' }}>
              <PatientAnswersDisplay answers={caseData.patientAnswers} />
            </div>
          )}

          {/* Clarification requests */}
          {caseData.clarificationRequests.length > 0 && (
            <div className="card p-5 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4.5 h-4.5 text-orange-500" />
                <h3 className="text-sm font-bold font-display text-ink-900">Clarification Requests</h3>
              </div>
              <div className="space-y-3">
                {caseData.clarificationRequests.map((req) => (
                  <div key={req.id} className="rounded-lg bg-orange-50 border border-orange-200 px-4 py-3">
                    <p className="text-sm text-ink-700">{req.message}</p>
                    <p className="text-xs text-ink-400 mt-1.5">
                      {new Date(req.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointment info */}
          {caseData.appointment && (
            <div className="card p-5 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="w-4.5 h-4.5 text-accent-600" />
                <h3 className="text-sm font-bold font-display text-ink-900">Scheduled Appointment</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Date" value={caseData.appointment.date} />
                <InfoItem label="Time" value={caseData.appointment.time} />
                <InfoItem label="Type" value={caseData.appointment.type} />
                {caseData.appointment.note && <InfoItem label="Note" value={caseData.appointment.note} />}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions + Timeline */}
        <div className="space-y-5">
          {/* Action panel */}
          <div className="card p-5 lg:sticky lg:top-20 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="w-4 h-4 text-accent-600" />
              <h3 className="text-sm font-bold font-display text-ink-900">Professional Actions</h3>
            </div>
            <p className="text-[11px] text-ink-400 mb-4">Demo Account — Healthcare Professional</p>
            <div className="space-y-2.5">
              <button
                onClick={() => setShowAcceptModal(true)}
                disabled={isActionDisabled}
                className="w-full flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left hover:bg-emerald-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Accept Case</p>
                  <p className="text-xs text-emerald-600">Accept for follow-up</p>
                </div>
              </button>

              <button
                onClick={() => setShowInfoModal(true)}
                disabled={isActionDisabled}
                className="w-full flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-left hover:bg-orange-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <HelpCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-800">Request More Info</p>
                  <p className="text-xs text-orange-600">Ask patient for clarification</p>
                </div>
              </button>

              <button
                onClick={() => setShowScheduleModal(true)}
                disabled={isActionDisabled}
                className="w-full flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 px-4 py-3 text-left hover:bg-accent-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <CalendarClock className="w-5 h-5 text-accent-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-accent-800">Schedule Appointment</p>
                  <p className="text-xs text-accent-600">Set date and time</p>
                </div>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-ink-100">
              <p className="text-[11px] text-ink-400 leading-relaxed text-center">
                AI assists. Healthcare professionals decide. No diagnosis or treatment is prescribed by CURERA AI.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '140ms' }}>
            <h3 className="text-sm font-bold font-display text-ink-900 mb-4">Case Timeline</h3>
            <Timeline events={caseData.timeline} />
          </div>
        </div>
      </div>

      {/* Accept modal */}
      <Modal open={showAcceptModal} onClose={() => setShowAcceptModal(false)} title="Accept Case" subtitle="Confirm acceptance for professional follow-up">
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Accept this case for follow-up?</p>
              <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                This confirms you have reviewed the AI-generated summary and will handle the case. No diagnosis or treatment is being prescribed.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAccept} className="btn-success flex-1">
              <CheckCircle2 className="w-4.5 h-4.5" />
              Accept Case
            </button>
            <button onClick={() => setShowAcceptModal(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Request info modal */}
      <Modal open={showInfoModal} onClose={() => setShowInfoModal(false)} title="Request More Info" subtitle="Ask the patient for additional clarification">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-2 block">
              Message to Patient
            </label>
            <textarea
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              placeholder="Please clarify any additional information you need..."
              className="input min-h-[120px] resize-y"
            />
            {errors.info && <p className="text-xs text-red-600 mt-1.5">{errors.info}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={handleRequestInfo} className="btn-warning flex-1">
              <Send className="w-4.5 h-4.5" />
              Send Request
            </button>
            <button onClick={() => setShowInfoModal(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Schedule modal */}
      <Modal open={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Appointment" subtitle="Demo scheduling flow — no real booking is made">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">Date</label>
              <input type="date" value={apptDate} onChange={(e) => setApptDate(e.target.value)} className="input" min={new Date().toISOString().split('T')[0]} />
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">Time</label>
              <input type="time" value={apptTime} onChange={(e) => setApptTime(e.target.value)} className="input" />
              {errors.time && <p className="text-xs text-red-600 mt-1">{errors.time}</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">Appointment Type</label>
            <select value={apptType} onChange={(e) => setApptType(e.target.value)} className="input">
              <option>Initial consultation</option>
              <option>Follow-up</option>
              <option>Specialist referral</option>
              <option>Telehealth appointment</option>
              <option>Routine check-up</option>
            </select>
            {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">Optional Note</label>
            <textarea value={apptNote} onChange={(e) => setApptNote(e.target.value)} placeholder="Add a note for the appointment..." className="input min-h-[60px] resize-y" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSchedule} className="btn-primary flex-1">
              <Calendar className="w-4.5 h-4.5" />
              Confirm Appointment
            </button>
            <button onClick={() => setShowScheduleModal(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-ink-800 mt-0.5">{value}</p>
    </div>
  );
}
