export type CaseStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'AWAITING_PATIENT_INFO'
  | 'ACCEPTED'
  | 'APPOINTMENT_SCHEDULED'
  | 'COMPLETED';

export type InputType = 'voice' | 'text';

export type TimelineEventType =
  | 'patient_submitted'
  | 'ai_summary_generated'
  | 'professional_reviewed'
  | 'case_accepted'
  | 'info_requested'
  | 'appointment_scheduled'
  | 'patient_info_provided'
  | 'case_completed';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  label: string;
  timestamp: string;
  detail?: string;
}

export interface ClarificationRequest {
  id: string;
  message: string;
  timestamp: string;
}

export interface Appointment {
  date: string;
  time: string;
  type: string;
  note?: string;
  timestamp: string;
}

export type AnswerType = 'yes_no' | 'scale' | 'text';

export interface ClarificationQuestion {
  id: string;
  question: string;
  answerType: AnswerType;
}

export interface PatientAnswer {
  questionId: string;
  question: string;
  answerType: AnswerType;
  answer: string | number;
  additionalDetails?: string;
}

export interface CaseSummary {
  mainConcern: string;
  duration: string;
  symptomsMentioned: string[];
  relevantInformation: string;
  additionalQuestions: ClarificationQuestion[];
  emergencyFlag: boolean;
}

export interface Case {
  id: string;
  patientId: string;
  createdAt: string;
  inputType: InputType;
  originalInput: string;
  transcription: string;
  mainConcern: string;
  duration: string;
  symptomsMentioned: string[];
  relevantInformation: string;
  additionalQuestions: ClarificationQuestion[];
  patientAnswers: PatientAnswer[];
  emergencyFlag: boolean;
  status: CaseStatus;
  professionalNotes: string;
  clarificationRequests: ClarificationRequest[];
  appointment: Appointment | null;
  timeline: TimelineEvent[];
}

export type Role = 'patient' | 'professional';
