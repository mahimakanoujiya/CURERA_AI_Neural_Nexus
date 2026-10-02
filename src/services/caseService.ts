import type { Case, TimelineEvent, CaseStatus, PatientAnswer } from '@/types';
import { generateCaseId, generatePatientId, generateCaseSummary } from './aiService';

function nowISO(): string {
  return new Date().toISOString();
}

function makeTimelineEvent(
  type: TimelineEvent['type'],
  label: string,
  detail?: string
): TimelineEvent {
  return {
    id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    label,
    timestamp: nowISO(),
    detail,
  };
}

export async function createCaseFromInput(
  input: string,
  inputType: 'voice' | 'text'
): Promise<Case> {
  const summary = await generateCaseSummary(input);
  const now = nowISO();

  const timeline: TimelineEvent[] = [
    makeTimelineEvent('patient_submitted', 'Patient submitted case', `Input type: ${inputType}`),
    makeTimelineEvent('ai_summary_generated', 'AI summary generated'),
  ];

  return {
    id: generateCaseId(),
    patientId: generatePatientId(),
    createdAt: now,
    inputType,
    originalInput: input,
    transcription: input,
    mainConcern: summary.mainConcern,
    duration: summary.duration,
    symptomsMentioned: summary.symptomsMentioned,
    relevantInformation: summary.relevantInformation,
    additionalQuestions: summary.additionalQuestions,
    patientAnswers: [],
    emergencyFlag: summary.emergencyFlag,
    status: 'NEW',
    professionalNotes: '',
    clarificationRequests: [],
    appointment: null,
    timeline,
  };
}

export function addTimelineEvent(
  caseData: Case,
  type: TimelineEvent['type'],
  label: string,
  detail?: string
): Case {
  return {
    ...caseData,
    timeline: [...caseData.timeline, makeTimelineEvent(type, label, detail)],
  };
}

export function updateCaseStatus(caseData: Case, status: CaseStatus): Case {
  return { ...caseData, status };
}

export function acceptCase(caseData: Case): Case {
  const updated = updateCaseStatus(caseData, 'ACCEPTED');
  return addTimelineEvent(updated, 'case_accepted', 'Case accepted by professional', 'Case accepted for follow-up. No diagnosis or treatment has been prescribed.');
}

export function requestMoreInfo(caseData: Case, message: string): Case {
  const request = {
    id: `req-${Date.now()}`,
    message,
    timestamp: nowISO(),
  };
  const updated = updateCaseStatus(caseData, 'AWAITING_PATIENT_INFO');
  return {
    ...updated,
    clarificationRequests: [...updated.clarificationRequests, request],
    timeline: addTimelineEvent(updated, 'info_requested', 'More information requested', message).timeline,
  };
}

export function scheduleAppointment(
  caseData: Case,
  date: string,
  time: string,
  type: string,
  note?: string
): Case {
  const appointment = {
    date,
    time,
    type,
    note,
    timestamp: nowISO(),
  };
  const updated = updateCaseStatus(caseData, 'APPOINTMENT_SCHEDULED');
  return {
    ...updated,
    appointment,
    timeline: addTimelineEvent(
      updated,
      'appointment_scheduled',
      'Appointment scheduled',
      `${type} appointment on ${date} at ${time}${note ? ' — ' + note : ''}`
    ).timeline,
  };
}

export function markUnderReview(caseData: Case): Case {
  if (caseData.status !== 'NEW') return caseData;
  const updated = updateCaseStatus(caseData, 'UNDER_REVIEW');
  return addTimelineEvent(updated, 'professional_reviewed', 'Professional opened case for review');
}

export function savePatientAnswers(caseData: Case, answers: PatientAnswer[]): Case {
  const updated = addTimelineEvent(
    caseData,
    'patient_info_provided',
    'Patient provided additional information',
    `${answers.length} question(s) answered by patient`
  );
  return { ...updated, patientAnswers: answers };
}
