import React from 'react';
import { AthleteId, AthleteProfile } from '../types/rehab';
import {
  Activity,
  Calendar,
  FileSpreadsheet,
  Watch,
  Stethoscope,
  BookOpen,
  UserCheck,
  Menu,
  X,
  Flame,
} from 'lucide-react';

interface NavbarProps {
  currentAthleteId: AthleteId;
  athletes: Record<string, AthleteProfile>;
  onSelectAthlete: (id: AthleteId) => void;
  activeTab: 'dashboard' | 'schedule' | 'spreadsheet' | 'sync' | 'assessment' | 'education';
  onSelectTab: (tab: 'dashboard' | 'schedule' | 'spreadsheet' | 'sync' | 'assessment' | 'education') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAthleteId,
  athletes,
  onSelectAthlete,
  activeTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const currentAthlete = athletes[currentAthleteId];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & Recovery', icon: Activity },
    { id: 'schedule', label: '12-Week Schedule', icon: Calendar },
    { id: 'spreadsheet', label: 'Spreadsheet & Video Matrix', icon: FileSpreadsheet },
    { id: 'sync', label: 'Wearables & Health Sync', icon: Watch },
    { id: 'assessment', label: 'Movement Screen', icon: Stethoscope },
    { id: 'education', label: 'Clinical Guides', icon: BookOpen },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Flame className="w-6 h-6 fill-current text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  Spine &amp; Stride
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hidden sm:inline-block">
                  12-Week Marathon Rehab
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Back Pain Resolution &amp; Runner Resiliency • Auckland Marathon Protocol
              </p>
            </div>
          </div>

          {/* Athlete Profile Switcher (Crucial for Arwel vs Helen) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => onSelectAthlete('arwel')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentAthleteId === 'arwel'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-300" />
              <span>Arwel Thomas</span>
              <span className="text-[10px] opacity-75 hidden md:inline">(63M, 71kg)</span>
            </button>

            <button
              onClick={() => onSelectAthlete('helen')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                currentAthleteId === 'helen'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>Helen Shanley</span>
              <span className="text-[10px] opacity-75 hidden md:inline">(58F, 59kg)</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation Bar */}
        <div className="hidden lg:flex items-center space-x-1 border-t border-slate-900/60 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
