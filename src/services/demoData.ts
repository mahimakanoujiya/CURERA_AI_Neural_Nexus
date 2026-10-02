import type { Case, ClarificationQuestion, PatientAnswer } from '@/types';
import { createCaseFromInput } from './caseService';

const DEMO_INPUT =
  "I've been feeling unwell since yesterday. I have a headache and feel tired. I also haven't been feeling like eating much.";

function makeQuestions(qs: { q: string; t: ClarificationQuestion['answerType'] }[]): ClarificationQuestion[] {
  return qs.map((item, i) => ({
    id: `demo-q-${i}`,
    question: item.q,
    answerType: item.t,
  }));
}

export async function createDemoCases(): Promise<Case[]> {
  const demoCase = await createCaseFromInput(DEMO_INPUT, 'voice');

  const now = Date.now();
  const minutesAgo = (m: number) => new Date(now - m * 60000).toISOString();

  // Case 2: Sore throat + cough + congestion + sneezing — NEW, no patient answers yet
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
    additionalQuestions: makeQuestions([
      { q: 'How severe is the sore throat on a scale of 1 to 10?', t: 'scale' },
      { q: 'Have you tried anything to manage the sore throat?', t: 'yes_no' },
      { q: 'Have you recently been in contact with anyone who was ill?', t: 'yes_no' },
      { q: 'Are you currently taking any medications or supplements?', t: 'yes_no' },
    ]),
    patientAnswers: [],
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

  // Case 3: Back pain — patient answered, awaiting more info
  const case3Answers: PatientAnswer[] = [
    {
      questionId: 'demo-q-0',
      question: 'How severe is the back pain on a scale of 1 to 10?',
      answerType: 'scale',
      answer: 6,
    },
    {
      questionId: 'demo-q-1',
      question: 'Have you noticed any specific triggers that make the back pain better or worse?',
      answerType: 'text',
      answer: 'The pain is worse in the mornings, especially after waking up.',
    },
    {
      questionId: 'demo-q-2',
      question: 'Have you tried anything to manage the back pain?',
      answerType: 'yes_no',
      answer: 'No',
    },
    {
      questionId: 'demo-q-3',
      question: 'Can you describe where the back pain is located?',
      answerType: 'text',
      answer: 'Lower back, mostly on the left side.',
    },
  ];

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
    additionalQuestions: makeQuestions([
      { q: 'How severe is the back pain on a scale of 1 to 10?', t: 'scale' },
      { q: 'Have you noticed any specific triggers that make the back pain better or worse?', t: 'text' },
      { q: 'Have you tried anything to manage the back pain?', t: 'yes_no' },
      { q: 'Can you describe where the back pain is located?', t: 'text' },
    ]),
    patientAnswers: case3Answers,
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
      { id: 'tl-3', type: 'patient_info_provided', label: 'Patient provided additional information', timestamp: minutesAgo(170), detail: '4 question(s) answered by patient' },
      { id: 'tl-4', type: 'professional_reviewed', label: 'Professional opened case for review', timestamp: minutesAgo(125) },
      { id: 'tl-5', type: 'info_requested', label: 'More information requested', timestamp: minutesAgo(120), detail: 'Could you clarify whether the pain radiates to your legs or stays localized in your lower back? Also, have you had any recent injuries or heavy lifting?' },
    ],
  };

  // Case 4: Anxiety + insomnia — patient answered, appointment scheduled
  const case4Answers: PatientAnswer[] = [
    {
      questionId: 'demo-q-0',
      question: 'Have you noticed any specific triggers that make the anxiety better or worse?',
      answerType: 'text',
      answer: 'Work deadlines and evening hours tend to make it worse.',
    },
    {
      questionId: 'demo-q-1',
      question: 'Are you currently taking any medications or supplements?',
      answerType: 'yes_no',
      answer: 'Yes',
      additionalDetails: 'Melatonin occasionally to help with sleep.',
    },
    {
      questionId: 'demo-q-2',
      question: 'Have you been able to sleep despite the anxiety?',
      answerType: 'yes_no',
      answer: 'No',
    },
    {
      questionId: 'demo-q-3',
      question: 'Have you noticed any changes in the anxiety throughout the day?',
      answerType: 'text',
      answer: 'It tends to peak in the evenings when I am trying to wind down.',
    },
  ];

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
    additionalQuestions: makeQuestions([
      { q: 'Have you noticed any specific triggers that make the anxiety better or worse?', t: 'text' },
      { q: 'Are you currently taking any medications or supplements?', t: 'yes_no' },
      { q: 'Have you been able to sleep despite the anxiety?', t: 'yes_no' },
      { q: 'Have you noticed any changes in the anxiety throughout the day?', t: 'text' },
    ]),
    patientAnswers: case4Answers,
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
      { id: 'tl-3', type: 'patient_info_provided', label: 'Patient provided additional information', timestamp: minutesAgo(580), detail: '4 question(s) answered by patient' },
      { id: 'tl-4', type: 'professional_reviewed', label: 'Professional opened case for review', timestamp: minutesAgo(400) },
      { id: 'tl-5', type: 'appointment_scheduled', label: 'Appointment scheduled', timestamp: minutesAgo(300), detail: 'Initial consultation appointment on 2026-10-05 at 14:30 — Follow-up to discuss sleep and anxiety management strategies.' },
    ],
  };

  // Case 5: Fever + body aches + congestion — patient answered, accepted
  const case5Answers: PatientAnswer[] = [
    {
      questionId: 'demo-q-0',
      question: 'How severe is the fever on a scale of 1 to 10?',
      answerType: 'scale',
      answer: 8,
    },
    {
      questionId: 'demo-q-1',
      question: 'Have you tried anything to manage the fever?',
      answerType: 'yes_no',
      answer: 'No',
    },
    {
      questionId: 'demo-q-2',
      question: 'Have you recently been in contact with anyone who was ill?',
      answerType: 'yes_no',
      answer: 'Yes',
      additionalDetails: 'My child had a similar fever last week.',
    },
    {
      questionId: 'demo-q-3',
      question: 'Has anyone in your household experienced similar symptoms recently?',
      answerType: 'yes_no',
      answer: 'Yes',
      additionalDetails: 'My child had a similar fever last week.',
    },
  ];

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
    additionalQuestions: makeQuestions([
      { q: 'How severe is the fever on a scale of 1 to 10?', t: 'scale' },
      { q: 'Have you tried anything to manage the fever?', t: 'yes_no' },
      { q: 'Have you recently been in contact with anyone who was ill?', t: 'yes_no' },
      { q: 'Has anyone in your household experienced similar symptoms recently?', t: 'yes_no' },
    ]),
    patientAnswers: case5Answers,
    emergencyFlag: false,
    status: 'ACCEPTED',
    professionalNotes: '',
    clarificationRequests: [],
    appointment: null,
    timeline: [
      { id: 'tl-1', type: 'patient_submitted', label: 'Patient submitted case', timestamp: minutesAgo(720), detail: 'Input type: voice' },
      { id: 'tl-2', type: 'ai_summary_generated', label: 'AI summary generated', timestamp: minutesAgo(720) },
      { id: 'tl-3', type: 'patient_info_provided', label: 'Patient provided additional information', timestamp: minutesAgo(710), detail: '4 question(s) answered by patient' },
      { id: 'tl-4', type: 'professional_reviewed', label: 'Professional opened case for review', timestamp: minutesAgo(500) },
      { id: 'tl-5', type: 'case_accepted', label: 'Case accepted by professional', timestamp: minutesAgo(400), detail: 'Case accepted for follow-up. No diagnosis or treatment has been prescribed.' },
    ],
  };

  return [case2, case3, case4, case5];
}
