import { Shield, CheckCircle2, AlertTriangle, Heart, Lock, UserCheck, FileText, Phone } from 'lucide-react';

const COMMITMENTS = [
  { icon: CheckCircle2, title: 'No AI Diagnosis', desc: 'CURERA AI never diagnoses a medical condition. It only organizes what the patient says.' },
  { icon: CheckCircle2, title: 'No Autonomous Prescriptions', desc: 'CURERA AI never prescribes medication or recommends treatment.' },
  { icon: CheckCircle2, title: 'Professional Review Required', desc: 'Every AI-generated summary must be reviewed by a healthcare professional before any action.' },
  { icon: Lock, title: 'User Consent Before Sharing', desc: 'Patient information is only shared for professional review after explicit consent is given.' },
  { icon: FileText, title: 'Minimal Necessary Data', desc: 'Only the information needed to organize healthcare communication is collected.' },
  { icon: Phone, title: 'Emergency Routing', desc: 'Potentially urgent language is flagged for professional attention — without diagnosing.' },
];

export default function Safety() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-10 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink-900">Safety Commitments</h1>
        <p className="text-ink-500 mt-2 max-w-xl mx-auto">
          CURERA AI is designed to assist communication — not replace professional medical judgment.
        </p>
      </div>

      {/* Core statement */}
      <div className="card p-6 mb-6 text-center animate-fade-in-up bg-gradient-to-br from-brand-50 to-accent-50/30 border-brand-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-brand-600" />
          <h2 className="text-lg font-bold font-display text-ink-900">Our Principle</h2>
        </div>
        <p className="text-base font-semibold text-ink-800 leading-relaxed">
          "CURERA AI assists communication. Healthcare professionals make clinical decisions."
        </p>
      </div>

      {/* What CURERA AI never does */}
      <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-sm font-bold font-display text-ink-900 uppercase tracking-wide">CURERA AI Never</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Diagnoses a disease',
            'Claims a patient has a specific condition',
            'Prescribes medication',
            'Recommends autonomous treatment',
            'Replaces a healthcare professional',
            'Makes autonomous clinical decisions',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg bg-red-50 border border-red-100 px-3.5 py-2.5">
              <span className="text-red-500 font-bold text-lg leading-none">✕</span>
              <p className="text-sm text-ink-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What CURERA AI does */}
      <div className="card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold font-display text-ink-900 uppercase tracking-wide">CURERA AI May</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Transcribe patient speech',
            'Organize patient information',
            'Summarize what the patient said',
            'Extract explicitly mentioned symptoms',
            'Identify missing information',
            'Generate clarification questions',
            'Flag potentially urgent language',
            'Help organize appointment information',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg bg-emerald-50 border border-emerald-100 px-3.5 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-ink-700">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commitments grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {COMMITMENTS.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="card p-5 hover:shadow-float transition-all animate-fade-in-up"
              style={{ animationDelay: `${240 + i * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink-900">{c.title}</h3>
                  <p className="text-xs text-ink-500 mt-1 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency note */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 animate-fade-in-up">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Emergency Awareness</h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              CURERA AI inspects patient input for potentially urgent language. If detected, it shows a calm message encouraging the patient to seek immediate professional help. This is not a diagnosis — it is a routing and awareness feature.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-ink-500">
        <UserCheck className="w-4 h-4 text-brand-500" />
        <span className="font-semibold">AI assists. Healthcare professionals decide.</span>
      </div>
    </div>
  );
}
