import { Link } from 'react-router-dom';
import { Activity, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200/60 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-sm text-ink-900">CURERA AI</span>
              <span className="text-[10px] text-ink-400 font-medium tracking-wide uppercase">Built by Neural Nexus</span>
            </div>
          </div>
          <p className="text-xs text-ink-500 flex items-center gap-1.5">
            AI assists. Healthcare professionals decide.
            <Heart className="w-3 h-3 text-red-400" />
          </p>
          <nav className="flex items-center gap-4 text-xs text-ink-500">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <Link to="/patient" className="hover:text-brand-600 transition-colors">Patient</Link>
            <Link to="/professional" className="hover:text-brand-600 transition-colors">Dashboard</Link>
            <Link to="/safety" className="hover:text-brand-600 transition-colors">Safety</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
