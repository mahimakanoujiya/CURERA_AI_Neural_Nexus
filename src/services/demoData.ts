import type { Case } from '@/types';
import { createCaseFromInput } from './caseService';

const DEMO_INPUT =
  "I've been feeling unwell since yesterday. I have a headache and feel tired. I also haven't been feeling like eating much.";

export async function createDemoCases(): Promise<Case[]> {
  const demoCase = await createCaseFromInput(DEMO_INPUT, 'voice');

  const now = Date.now();
  const minutesAgo = (m: number) => new Date(now - m * 60000).toISOString();

  const case2: Case = {
    ...demoCase,
    id: 'CUR-20261002-A4F2',
    patientId: 'PT-K9X2MA',
    createdAt: minutesAgo(47),
    inputType: 'text',
    originalInput:
      'For the past three days I have had a sore throat and a mild cough. I have also been feeling congested and sneezing a lot. It started this week and seems to be getting worse.',
    transcription:
      'For the past three days I have had a sore throat and a mild cough. I have also been feeling congested and sneezing a lot. It started this week and seems to be getting worse.',
    mainConcern: 'Patient reports: "For the past three days I have had a sore throat and a mild cough."',
    duration: 'For the past 3 days',
    symptomsMentioned: ['Sore throat', 'Cough', 'Congestion', 'Sneezing'],
    relevantInformation:
      'It started this week and seems to be getting worse.',
    additionalQuestions: [
      'Have you noticed any specific triggers that make the symptoms better or worse?',
      'Are you currently taking any medications or supplements?',
      'How is the concern affecting your daily activities?',
      'Have you tried any home remedies or over-the-counter treatments so far?',
    ],
    emergencyFlag: false,
    status: 'NEW',
    professionalNotes: '',
    clarificationRequests: [],
    appointment: null,
    timeline: [
      { id: 'tl-1', type: 'patient_submitted', label: 'Patient submitted case', timestamp: minutesAgo(47), detail: 'Input type: text' },
      { id: 'tl-2', type: 'ai_summary_generated', label: 'AI summary generated', timestamp: minutesAgo(47) },
    ],
  };

  const case3: Case = {
    ...demoCase,
    id: 'CUR-20261002-B7C9',
    patientId: 'PT-M3R8KP',
    createdAt: minutesAgo(180),
    inputType: 'voice',
    originalInput:
      'I have been experiencing lower back pain for the past two weeks. It is worse in the mornings and makes it hard to get out of bed. I have not taken anything for it yet.',
    transcription:
      'I have been experiencing lower back pain for the past two weeks. It is worse in the mornings and makes it hard to get out of bed. I have not taken anything for it yet.',
    mainConcern: 'Patient reports: "I have been experiencing lower back pain for the past two weeks."',
    duration: 'For the past 2 weeks',
    symptomsMentioned: ['Back pain'],
    relevantInformation:
      "It is worse in the mornings and makes it hard to get out of bed. I have not taken anything for it yet.",
    additionalQuestions: [
      'Can you describe the severity of the symptoms on a scale of 1 to 10?',
      'Have you noticed any specific triggers that make the symptoms better or worse?',
      'Are you currently taking any medications or supplements?',
      'Do you have any known allergies or pre-existing conditions?',
    ],
    emergencyFlag: false,
    status: 'AWAITING_PATIENT_INFO',
    professionalNotes: '',
    clarificationRequests: [
      {
        id: 'req-1',
        message: 'Could you clarify whether the pain radiates to your legs or stays localized in your lower back? Also, have you had any recent injuries or heavy lifting?',
        timestamp: minutesAgo(120),
      },
    ],
    appointment: null,
    timeline: [
      { id: 'tl-1', type: 'patient_submitted', label: 'Patient submitted case', timestamp: minutesAgo(180), detail: 'Input type: voice' },
      { id: 'tl-2', type: 'ai_summary_generated', label: 'AI summary generated', timestamp: minutesAgo(180) },
      { id: 'tl-3', type: 'professional_reviewed', label: 'Professional opened case for review', timestamp: minutesAgo(125) },
      { id: 'tl-4', type: 'info_requested', label: 'More information requested', timestamp: minutesAgo(120), detail: 'Could you clarify whether the pain radiates to your legs or stays localized in your lower back? Also, have you had any recent injuries or heavy lifting?' },
    ],
  };

  const case4: Case = {
    ...demoCase,
    id: 'CUR-20261002-C2E1',
    patientId: 'PT-Q7L4NB',
    createdAt: minutesAgo(600),
    inputType: 'text',
    originalInput:
      'I have been feeling anxious and having trouble sleeping for the past month. I feel on edge during the day and cannot seem to relax.',
    transcription:
      'I have been feeling anxious and having trouble sleeping for the past month. I feel on edge during the day and cannot seem to relax.',
    mainConcern: 'Patient reports: "I have been feeling anxious and having trouble sleeping for the past month."',
    duration: 'For the past 1 month',
    symptomsMentioned: ['Anxiety', 'Insomnia'],
    relevantInformation:
      'I feel on edge during the day and cannot seem to relax.',
    additionalQuestions: [
      'Have you noticed any specific triggers that make the symptoms better or worse?',
      'Are you currently taking any medications or supplements?',
      'How is the concern affecting your daily activities?',
      'Have you tried any home remedies or over-the-counter treatments so far?',
    ],
    emergencyFlag: false,
    status: 'APPOINTMENT_SCHEDULED',
    professionalNotes: '',
    clarificationRequests: [],
    appointment: {
      date: '2026-10-05',
      time: '14:30',
      type: 'Initial consultation',
      note: 'Follow-up to discuss sleep and anxiety management strategies.',
      timestamp: minutesAgo(300),
    },
    timeline: [
      { id: 'tl-1', type: 'patient_submitted', label: 'Patient submitted case', timestamp: minutesAgo(600), detail: 'Input type: text' },
      { id: 'tl-2', type: 'ai_summary_generated', label: 'AI summary generated', timestamp: minutesAgo(600) },
      { id: 'tl-3', type: 'professional_reviewed', label: 'Professional opened case for review', timestamp: minutesAgo(400) },
      { id: 'tl-4', type: 'appointment_scheduled', label: 'Appointment scheduled', timestamp: minutesAgo(300), detail: 'Initial consultation appointment on 2026-10-05 at 14:30 — Follow-up to discuss sleep and anxiety management strategies.' },
    ],
  };

  const case5: Case = {
    ...demoCase,
    id: 'CUR-20261002-D9K5',
    patientId: 'PT-T2W6YC',
    createdAt: minutesAgo(720),
    inputType: 'voice',
    originalInput:
      'I have had a fever and body aches since yesterday. I feel chills and have been shivering. I also have a runny nose.',
    transcription:
      'I have had a fever and body aches since yesterday. I feel chills and have been shivering. I also have a runny nose.',
    mainConcern: 'Patient reports: "I have had a fever and body aches since yesterday."',
    duration: 'Since yesterday',
    symptomsMentioned: ['Fever', 'Body aches', 'Congestion'],
    relevantInformation:
      'I feel chills and have been shivering. I also have a runny nose.',
    additionalQuestions: [
      'Can you describe the severity of the symptoms on a scale of 1 to 10?',
      'Have you noticed any specific triggers that make the symptoms better or worse?',
      'Are you currently taking any medications or supplements?',
      'Has anyone in your household experienced similar symptoms recently?',
    ],
    emergencyFlag: false,
    status: 'ACCEPTED',
    professionalNotes: '',
    clarificationRequests: [],
    appointment: null,
    timeline: [
      { id: 'tl-1', type: 'patient_submitted', label: 'Patient submitted case', timestamp: minutesAgo(720), detail: 'Input type: voice' },
      { id: 'tl-2', type: 'ai_summary_generated', label: 'AI summary generated', timestamp: minutesAgo(720) },
      { id: 'tl-3', type: 'professional_reviewed', label: 'Professional opened case for review', timestamp: minutesAgo(500) },
      { id: 'tl-4', type: 'case_accepted', label: 'Case accepted by professional', timestamp: minutesAgo(400), detail: 'Case accepted for follow-up. No diagnosis or treatment has been prescribed.' },
    ],
  };

  return [case2, case3, case4, case5];
}
