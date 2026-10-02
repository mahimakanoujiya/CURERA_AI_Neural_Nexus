import { Link, useLocation } from 'react-router-dom';
import { Activity, Home, Mic, LayoutDashboard, Shield, User, Stethoscope } from 'lucide-react';
import { useCases } from '@/context/CaseContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/patient', label: 'Patient', icon: Mic },
  { to: '/professional', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/safety', label: 'Safety', icon: Shield },
];

export default function Navbar() {
  const location = useLocation();
  const { role, setRole } = useCases();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-ink-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base text-ink-900 tracking-tight">CURERA AI</span>
              <span className="text-[10px] text-ink-400 font-medium tracking-wide uppercase">Neural Nexus</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-500 hover:text-ink-800 hover:bg-ink-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-ink-100 rounded-xl p-1">
              <button
                onClick={() => setRole('patient')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'patient' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient
              </button>
              <button
                onClick={() => setRole('professional')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  role === 'professional' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500 hover:text-ink-700'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Professional
              </button>
            </div>
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 pb-2 overflow-x-auto">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-500 hover:text-ink-800 hover:bg-ink-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
          <div className="flex items-center bg-ink-100 rounded-lg p-0.5 ml-1">
            <button
              onClick={() => setRole('patient')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                role === 'patient' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('professional')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                role === 'professional' ? 'bg-white text-brand-700 shadow-soft' : 'text-ink-500'
              }`}
            >
              Pro
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
