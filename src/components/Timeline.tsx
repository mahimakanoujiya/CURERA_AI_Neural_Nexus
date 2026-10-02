import type { TimelineEvent } from '@/types';
import {
  Mic,
  Sparkles,
  Eye,
  CheckCircle2,
  HelpCircle,
  CalendarClock,
  FileText,
} from 'lucide-react';

const EVENT_CONFIG: Record<TimelineEvent['type'], { icon: typeof Mic; color: string; bg: string; ring: string }> = {
  patient_submitted: { icon: Mic, color: 'text-brand-600', bg: 'bg-brand-50', ring: 'ring-brand-200' },
  ai_summary_generated: { icon: Sparkles, color: 'text-accent-600', bg: 'bg-accent-50', ring: 'ring-accent-200' },
  professional_reviewed: { icon: Eye, color: 'text-ink-600', bg: 'bg-ink-100', ring: 'ring-ink-200' },
  case_accepted: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
  info_requested: { icon: HelpCircle, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' },
  appointment_scheduled: { icon: CalendarClock, color: 'text-accent-600', bg: 'bg-accent-50', ring: 'ring-accent-200' },
  case_completed: { icon: FileText, color: 'text-ink-500', bg: 'bg-ink-100', ring: 'ring-ink-200' },
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-2 bottom-2 w-px bg-ink-200" />
      <div className="space-y-5">
        {events.map((event, idx) => {
          const config = EVENT_CONFIG[event.type];
          const Icon = config.icon;
          return (
            <div
              key={event.id}
              className="relative flex gap-4 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms`, opacity: 0 }}
            >
              <div className={`relative z-10 w-10 h-10 rounded-full ${config.bg} ring-2 ${config.ring} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${config.color}`} />
              </div>
              <div className="flex-1 pt-1.5">
                <p className="text-sm font-semibold text-ink-800">{event.label}</p>
                <p className="text-xs text-ink-400 mt-0.5">{formatTime(event.timestamp)}</p>
                {event.detail && (
                  <div className="mt-2 rounded-lg bg-ink-50 border border-ink-200/60 px-3 py-2">
                    <p className="text-xs text-ink-600 leading-relaxed">{event.detail}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
