import React, { useState } from 'react';
import {
  AthleteProfile,
  DailyLog,
  PlanWeek,
  Exercise,
  FitnessSyncService,
  WorkoutDay,
} from '../types/rehab';
import {
  calculatePainTrendStats,
  calculateReadinessStatus,
} from '../utils/rehab-logic';
import {
  Activity,
  Flame,
  Play,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  TrendingDown,
  Footprints,
  Youtube,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface DashboardViewProps {
  athlete: AthleteProfile;
  currentWeek: number;
  weeks: PlanWeek[];
  exercises: Exercise[];
  logs: DailyLog[];
  syncServices: FitnessSyncService[];
  onStartWorkout: (workout: WorkoutDay) => void;
  onOpenCheckin: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToSpreadsheet: () => void;
  onNavigateToSync: () => void;
  onOpenVideo: (exercise: Exercise) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  athlete,
  currentWeek,
  weeks,
  exercises,
  logs,
  syncServices,
  onStartWorkout,
  onOpenCheckin,
  onNavigateToSchedule,
  onNavigateToSpreadsheet,
  onNavigateToSync,
  onOpenVideo,
}) => {
  const [showAllInjuries, setShowAllInjuries] = useState(false);

  const athleteLogs = logs.filter((l) => l.athleteId === athlete.id);
  const latestLog =
    athleteLogs[athleteLogs.length - 1] || {
      painScore: 3,
      mobilityScore: 72,
      sleepHours: 7.5,
      hrvMs: 58,
      steps: 8500,
    };

  const painStats = calculatePainTrendStats(athleteLogs);
  const readiness = calculateReadinessStatus(latestLog as any);

  // Today's workout from current week
  const thisWeekPlan = weeks.find((w) => w.weekNumber === currentWeek) || weeks[0];
  const todayWorkout = thisWeekPlan.days[0];
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  // Connected tracker metrics
  const activeService = syncServices.find((s) => s.connected) || syncServices[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Simplified Runner Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg shrink-0"
            style={{ backgroundColor: athlete.avatarColor }}
          >
            {athlete.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {athlete.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Week {currentWeek} of 12
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {athlete.gender}, {athlete.age}y • {athlete.weightKg}kg
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong className="text-slate-300">Gait Cue: </strong>
                {athlete.id === 'arwel'
                  ? 'Forward trunk 4-6°, brace lower abs, active right toe lift.'
                  : 'Widen step width, soft midfoot landing, cadence 170+ spm.'}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          <button
            onClick={() => onStartWorkout(todayWorkout)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Today&apos;s Workout</span>
          </button>
          <button
            onClick={onOpenCheckin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Check-In</span>
          </button>
        </div>
      </div>

      {/* 2. Three Clean, High-Yield Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recovery Readiness */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Readiness Status
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white">{readiness.score}%</span>
              <span className="text-xs font-semibold text-emerald-400">
                {readiness.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{readiness.advice}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Current Pain Level */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Pain (VAS)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {painStats.latestPain}
                <span className="text-sm font-normal text-slate-500"> / 10</span>
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-400">
                <TrendingDown className="w-3.5 h-3.5" /> -{painStats.painReductionPct}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Down from {painStats.initialPain}/10 post-marathon
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Weekly Progress & Schedule link */}
        <div
          onClick={onNavigateToSchedule}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between cursor-pointer transition group"
        >
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Plan Phase
            </span>
            <div className="text-lg font-bold text-white mt-1 group-hover:text-cyan-400 transition">
              {thisWeekPlan.phaseName.split(':')[0]}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Click to view all 12 weeks &rarr;
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Hero: Today's Workout Routine (Clean, Scannable & Direct Links) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Today&apos;s Workout
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {todayWorkout.dayName} • ~{todayWorkout.estimatedMinutes} minutes
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {todayWorkout.title}
            </h2>
            <p className="text-xs text-slate-400">{todayWorkout.focus}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onStartWorkout(todayWorkout)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Guided Session</span>
            </button>
            <button
              onClick={onNavigateToSpreadsheet}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs border border-slate-700 transition"
              title="Open full 12-week spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Spreadsheet</span>
            </button>
          </div>
        </div>

        {/* Clean Exercise List with Direct YouTube Buttons */}
        <div className="divide-y divide-slate-800/80">
          {todayWorkout.exercises.map((item, idx) => {
            const ex = exerciseMap.get(item.exerciseId);
            if (!ex) return null;

            return (
              <div
                key={item.exerciseId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/25 px-2 rounded-xl transition"
              >
                {/* Movement Info */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{ex.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {ex.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      <strong className="text-emerald-400">
                        {item.customSets || ex.defaultSets} sets
                      </strong>{' '}
                      × {item.customReps || ex.defaultReps} • Equipment: {ex.equipment}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons: YouTube & Form Details */}
                <div className="flex items-center gap-2 pl-9 sm:pl-0 shrink-0">
                  {/* Direct YouTube Link Button */}
                  <a
                    href={ex.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow transition hover:scale-105 active:scale-95"
                    title={`Open ${ex.name} video on YouTube`}
                  >
                    <Youtube className="w-3.5 h-3.5 fill-current" />
                    <span>YouTube ↗</span>
                  </a>

                  {/* Form Cues Preview Modal */}
                  <button
                    onClick={() => onOpenVideo(ex)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition"
                  >
                    <span>Form Cues</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-800">
          <span>Weekly Mileage Limit: {thisWeekPlan.targetWalkingRunningTolerance}</span>
          <button
            onClick={onNavigateToSchedule}
            className="text-cyan-400 hover:underline font-semibold"
          >
            Explore All 7 Days of Week {currentWeek} &rarr;
          </button>
        </div>
      </div>

      {/* 4. Simplified Injury & Recovery Status (Compact & Collapsible) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {athlete.name}&apos;s Injury Recovery Focus
            </h3>
          </div>
          <button
            onClick={() => setShowAllInjuries(!showAllInjuries)}
            className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>{showAllInjuries ? 'Show Less' : 'View Full Details'}</span>
            {showAllInjuries ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Crucial Contraindication Note */}
        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-rose-200">Key Safety Rule: </strong>
            {athlete.keyContraindicationNotice}
          </span>
        </div>

        {/* Compact Injury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {athlete.injuries.map((injury) => (
            <div
              key={injury.id}
              className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white truncate max-w-[220px]">
                  {injury.title}
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {injury.anatomicalSite}
              </p>
              {showAllInjuries && (
                <div className="pt-1 text-[11px] text-slate-300 border-t border-slate-700/50 space-y-1">
                  <p>{injury.clinicalExplanation}</p>
                  <p className="text-cyan-400 font-medium">Priority: {injury.rehabFocus[0]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
