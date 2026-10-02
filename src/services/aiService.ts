import type { CaseSummary, ClarificationQuestion, AnswerType } from '@/types';

export const DEMO_MODE = true;

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'can\'t breathe',
  'cannot breathe',
  'unconscious',
  'bleeding heavily',
  'severe bleeding',
  'stroke',
  'seizure',
  'suicidal',
  'overdose',
  'severe pain',
  'fainting',
  'passed out',
  'not breathing',
  'choking',
  'drowning',
  'heart attack',
];

const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  'Headache': ['headache', 'head ache', 'head pain', 'migraine'],
  'Tiredness': ['tired', 'fatigue', 'exhausted', 'no energy', 'lethargic', 'sleepy'],
  'Reduced appetite': ['no appetite', "haven't been eating", 'not eating', 'not hungry', 'reduced appetite', 'loss of appetite'],
  'Fever': ['fever', 'temperature', 'hot', 'chills', 'shivering'],
  'Cough': ['cough', 'coughing'],
  'Sore throat': ['sore throat', 'throat pain', 'scratchy throat'],
  'Nausea': ['nausea', 'queasy', 'sick to my stomach'],
  'Vomiting': ['vomiting', 'throwing up', 'puking'],
  'Dizziness': ['dizzy', 'dizziness', 'lightheaded', 'vertigo'],
  'Shortness of breath': ['shortness of breath', 'breathless', 'winded'],
  'Body aches': ['body aches', 'muscle ache', 'muscle pain', 'sore muscles'],
  'Abdominal pain': ['stomach pain', 'abdominal pain', 'belly ache', 'stomach ache'],
  'Back pain': ['back pain', 'lower back pain', 'back ache'],
  'Skin rash': ['rash', 'skin irritation', 'hives'],
  'Joint pain': ['joint pain', 'stiff joints', 'achy joints'],
  'Anxiety': ['anxious', 'anxiety', 'panic', 'worried', 'nervous'],
  'Insomnia': ['can\'t sleep', 'insomnia', 'trouble sleeping', 'not sleeping'],
  'Congestion': ['congested', 'stuffy nose', 'blocked nose', 'runny nose'],
  'Sneezing': ['sneezing', 'sneeze'],
  'Watery eyes': ['watery eyes', 'tearing', 'teary eyes'],
};

const DURATION_PATTERNS = [
  { regex: /since (yesterday|today|last (?:week|month|night|weekend))/i, label: 'Since $1' },
  { regex: /for (\d+) (day|days|week|weeks|month|months|hour|hours)/i, label: 'For the past $1 $2' },
  { regex: /(\d+) (day|days|week|weeks|month|months) (?:now|ago)/i, label: 'For the past $1 $2' },
  { regex: /started (yesterday|today|last (?:week|month|night))/i, label: 'Started $1' },
  { regex: /past (few|couple of|several) (days|weeks|months)/i, label: 'Past $1 $2' },
  { regex: /this (morning|afternoon|evening|week|month)/i, label: 'Since $1' },
];

const QUESTION_POOL: { question: string; answerType: AnswerType }[] = [
  { question: 'Can you describe the severity of your symptoms on a scale of 1 to 10?', answerType: 'scale' },
  { question: 'Have you noticed any specific triggers that make the symptoms better or worse?', answerType: 'text' },
  { question: 'Are you currently taking any medications or supplements?', answerType: 'yes_no' },
  { question: 'Do you have any known allergies or pre-existing conditions?', answerType: 'yes_no' },
  { question: 'Has anyone in your household experienced similar symptoms recently?', answerType: 'yes_no' },
  { question: 'Have you traveled recently or been in contact with anyone who was ill?', answerType: 'yes_no' },
  { question: 'How is the concern affecting your daily activities?', answerType: 'text' },
  { question: 'Have you tried any home remedies or over-the-counter treatments so far?', answerType: 'yes_no' },
];

let questionIdCounter = 0;
function makeQuestionId(): string {
  questionIdCounter++;
  return `q-${Date.now()}-${questionIdCounter}`;
}

function detectEmergency(input: string): boolean {
  const lower = input.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => lower.includes(kw));
}

function detectSymptoms(input: string): string[] {
  const lower = input.toLowerCase();
  const found: string[] = [];
  for (const [symptom, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      found.push(symptom);
    }
  }
  return [...new Set(found)];
}

function detectDuration(input: string): string {
  for (const pattern of DURATION_PATTERNS) {
    const match = input.match(pattern.regex);
    if (match) {
      return pattern.label.replace('$1', match[1]).replace('$2', match[2] || '');
    }
  }
  return 'Not specified by patient';
}

function extractMainConcern(input: string): string {
  const sentences = input.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) return 'Patient described general unwellness.';

  const concernSentence = sentences.find((s) =>
    /feel|feeling|been|have|having|pain|hurt|ache|bother|wrong|sick|unwell|dizzy|nausea|tired|worried|concern/i.test(s)
  );

  if (concernSentence) {
    const trimmed = concernSentence.length > 120 ? concernSentence.slice(0, 117) + '...' : concernSentence;
    return `Patient reports: "${trimmed}"`;
  }

  const first = sentences[0];
  return `Patient reports: "${first.length > 120 ? first.slice(0, 117) + '...' : first}"`;
}

function extractRelevantInfo(input: string): string {
  const sentences = input.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const contextSentences = sentences.filter((s) =>
    /since|started|began|past|recently|also|additionally|haven't|not been|unable|tried|taking|travel|contact/i.test(s)
  );

  if (contextSentences.length === 0) {
    return 'No additional context provided by patient beyond the primary concern and symptoms listed.';
  }

  return contextSentences.join('. ');
}

function generateClarificationQuestions(symptomCount: number): ClarificationQuestion[] {
  const count = Math.min(symptomCount > 2 ? 4 : 3, QUESTION_POOL.length);
  const shuffled = [...QUESTION_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((q) => ({
    id: makeQuestionId(),
    question: q.question,
    answerType: q.answerType,
  }));
}

export async function generateCaseSummary(patientInput: string): Promise<CaseSummary> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const emergencyFlag = detectEmergency(patientInput);
  const symptomsMentioned = detectSymptoms(patientInput);
  const duration = detectDuration(patientInput);
  const mainConcern = extractMainConcern(patientInput);
  const relevantInformation = extractRelevantInfo(patientInput);
  const additionalQuestions = generateClarificationQuestions(symptomsMentioned.length);

  return {
    mainConcern,
    duration,
    symptomsMentioned,
    relevantInformation,
    additionalQuestions,
    emergencyFlag,
  };
}

export function generateCaseId(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CUR-${ymd}-${rand}`;
}

export function generatePatientId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PT-${rand}`;
}
