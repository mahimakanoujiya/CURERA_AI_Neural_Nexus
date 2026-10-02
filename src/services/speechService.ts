export const DEMO_MODE = true;

export const DEMO_TRANSCRIPT =
  "I've been feeling unwell since yesterday. I have a headache and feel tired. I also haven't been feeling like eating much.";

export const DEMO_TRANSCRIPTS = [
  "I've been feeling unwell since yesterday. I have a headache and feel tired. I also haven't been feeling like eating much.",
  "For the past three days I've had a sore throat and a mild cough. I've also been feeling congested and sneezing a lot. It started this week and seems to be getting worse.",
  "I've been experiencing lower back pain for the past two weeks. It's worse in the mornings and makes it hard to get out of bed. I haven't taken anything for it yet.",
];

export type RecordingState = 'idle' | 'recording' | 'transcribing' | 'done';

export interface SpeechResult {
  transcript: string;
}

export async function startRecording(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200));
}

export async function stopRecordingAndTranscribe(): Promise<SpeechResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const idx = Math.floor(Math.random() * DEMO_TRANSCRIPTS.length);
  return { transcript: DEMO_TRANSCRIPTS[idx] };
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
