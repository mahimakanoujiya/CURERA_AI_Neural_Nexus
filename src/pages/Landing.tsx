import { Link } from 'react-router-dom';
import {
  Activity,
  Mic,
  Brain,
  Stethoscope,
  Calendar,
  ArrowRight,
  MessageSquareDashed,
  FileSearch,
  UserSearch,
  Layers,
  Shield,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { SafetyDisclaimer } from '@/components/SafetyBanner';

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-transparent to-transparent" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 sm:pb-20">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-ink-200 shadow-soft px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent-500" />
              <span className="text-xs font-semibold text-ink-600">Built by Team Neural Nexus</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-ink-900 tracking-tight">
              CURERA <span className="text-brand-600">AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-ink-600 mt-4 leading-relaxed font-medium">
              Healthcare That Listens Before It Routes.
            </p>
            <p className="text-base text-ink-500 mt-3 max-w-xl mx-auto">
              From a patient's voice to the right healthcare professional.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <Link to="/patient" className="btn-primary px-6 py-3.5 text-base">
                <Mic className="w-5 h-5" />
                Start as Patient
              </Link>
              <Link to="/professional" className="btn-secondary px-6 py-3.5 text-base">
                <Stethoscope className="w-5 h-5" />
                Open Professional Dashboard
              </Link>
            </div>

            <p className="text-xs text-ink-400 mt-6 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              AI assists communication. Professionals decide.
            </p>
          </div>

          {/* Hero visual flow */}
          <div className="mt-16 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              <FlowNode icon={<Mic className="w-6 h-6" />} label="Patient" sublabel="Voice or text" color="brand" />
              <FlowArrow />
              <FlowNode icon={<Brain className="w-6 h-6" />} label="CURERA AI" sublabel="Structures info" color="accent" highlight />
              <FlowArrow />
              <FlowNode icon={<Stethoscope className="w-6 h-6" />} label="Professional" sublabel="Reviews case" color="ink" />
              <FlowArrow />
              <FlowNode icon={<Calendar className="w-6 h-6" />} label="Care" sublabel="Next step" color="emerald" />
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink-900">
              Healthcare Starts With Communication
            </h2>
            <p className="text-ink-500 mt-2 max-w-xl mx-auto">
              The gap between what a patient feels and what a professional receives can affect care.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProblemCard icon={<MessageSquareDashed />} title="Difficult to Explain" desc="Patients struggle to clearly communicate their concerns." delay={0} />
            <ProblemCard icon={<FileSearch />} title="Unstructured Information" desc="Important details can be scattered or missed during intake." delay={80} />
            <ProblemCard icon={<UserSearch />} title="Finding the Right Care" desc="Patients may be unsure which professional to approach." delay={160} />
            <ProblemCard icon={<Layers />} title="Information Overload" desc="Professionals may receive incomplete or disorganized information." delay={240} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 bg-ink-50 bg-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-ink-900">How CURERA AI Works</h2>
            <p className="text-ink-500 mt-2">A simple four-step flow from patient to care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StepCard step="01" icon={<Mic />} title="Patient Input" desc="Voice or text symptom report." delay={0} />
            <StepCard step="02" icon={<Brain />} title="AI Structuring" desc="CURERA AI organizes the patient's information." delay={80} />
            <StepCard step="03" icon={<Stethoscope />} title="Professional Review" desc="Healthcare professional evaluates the case." delay={160} />
            <StepCard step="04" icon={<CheckCircle2 />} title="Next Step" desc="Accept case, request more info, or schedule appointment." delay={240} />
          </div>

          {/* Flow visual */}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm font-semibold text-ink-500 flex-wrap animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <span className="flex items-center gap-1.5"><Mic className="w-4 h-4 text-brand-500" /> Patient</span>
            <ArrowRight className="w-4 h-4 text-ink-300" />
            <span className="flex items-center gap-1.5"><Brain className="w-4 h-4 text-accent-500" /> AI</span>
            <ArrowRight className="w-4 h-4 text-ink-300" />
            <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-ink-500" /> Professional</span>
            <ArrowRight className="w-4 h-4 text-ink-300" />
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-500" /> Care</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-ink-900 to-brand-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white animate-fade-in-up">
            Listen. Understand. Connect.
          </h2>
          <p className="text-lg text-ink-300 mt-4 italic animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            "Healthcare should listen before it routes."
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 flex-wrap animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <FlowNodeDark icon={<Mic className="w-5 h-5" />} label="Patient" />
            <ArrowRight className="w-4 h-4 text-ink-500" />
            <FlowNodeDark icon={<Brain className="w-5 h-5" />} label="CURERA AI" highlight />
            <ArrowRight className="w-4 h-4 text-ink-500" />
            <FlowNodeDark icon={<Stethoscope className="w-5 h-5" />} label="Professional" />
            <ArrowRight className="w-4 h-4 text-ink-500" />
            <FlowNodeDark icon={<Calendar className="w-5 h-5" />} label="Care" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link to="/patient" className="btn-primary px-6 py-3.5 text-base">
              <Mic className="w-5 h-5" />
              Start as Patient
            </Link>
            <Link to="/professional" className="btn px-6 py-3.5 text-base bg-white/10 text-white border border-white/20 hover:bg-white/20">
              <Stethoscope className="w-5 h-5" />
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FlowNode({ icon, label, sublabel, color, highlight }: { icon: React.ReactNode; label: string; sublabel: string; color: string; highlight?: boolean }) {
  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600 border-brand-200',
    accent: 'bg-accent-50 text-accent-600 border-accent-200',
    ink: 'bg-ink-100 text-ink-600 border-ink-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };
  return (
    <div className={`flex flex-col items-center gap-2 ${highlight ? 'scale-110' : ''}`}>
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 ${colorMap[color]} flex items-center justify-center ${highlight ? 'shadow-glow' : 'shadow-soft'}`}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-ink-800">{label}</p>
        <p className="text-xs text-ink-400">{sublabel}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center pb-6">
      <ArrowRight className="w-5 h-5 text-ink-300" />
    </div>
  );
}

function FlowNodeDark({ icon, label, highlight }: { icon: React.ReactNode; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${highlight ? 'bg-accent-500/20 text-accent-300 border-accent-500/30' : 'bg-white/10 text-ink-300 border-white/10'}`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-ink-300">{label}</span>
    </div>
  );
}

function ProblemCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <div
      className="card p-5 hover:shadow-float transition-all duration-200 hover:border-brand-200 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4 text-brand-600">
        {icon}
      </div>
      <h3 className="text-sm font-bold font-display text-ink-900 mb-1.5">{title}</h3>
      <p className="text-xs text-ink-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ step, icon, title, desc, delay }: { step: string; icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <div
      className="card p-5 relative overflow-hidden hover:shadow-float transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="absolute top-3 right-4 text-4xl font-bold font-display text-ink-100 select-none">{step}</span>
      <div className="relative">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-4 text-white shadow-soft">
          {icon}
        </div>
        <h3 className="text-sm font-bold font-display text-ink-900 mb-1.5">{title}</h3>
        <p className="text-xs text-ink-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
