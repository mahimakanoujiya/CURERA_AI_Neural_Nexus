import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function SafetyBanner({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-xs text-ink-500">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        <span>AI-generated summary · Professional review required</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
      <AlertTriangle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0" />
      <p className="text-xs font-medium text-amber-800">
        AI-generated summary · Professional review required
      </p>
    </div>
  );
}

export function SafetyDisclaimer() {
  return (
    <div className="rounded-xl bg-brand-50 border border-brand-200 px-4 py-2.5">
      <p className="text-xs font-semibold text-brand-700 text-center">
        AI assists communication. Healthcare professionals make clinical decisions.
      </p>
    </div>
  );
}

export function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col bg-ink-50">{children}</div>;
}
