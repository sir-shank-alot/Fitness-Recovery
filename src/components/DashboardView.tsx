import React from 'react';
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
  ShieldAlert,
  Play,
  Heart,
  Calendar,
  Watch,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  TrendingDown,
  Info,
  Footprints,
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
  // Pick today's workout day (e.g., day 1 or next unfinished)
  const todayWorkout = thisWeekPlan.days[0];

  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  // Connected tracker metrics
  const activeService = syncServices.find((s) => s.connected) || syncServices[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome / Athlete Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
                Auckland Marathon Recovery Hub
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Week {currentWeek} of 12 ({thisWeekPlan.phaseName.split(':')[0]})
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg"
                style={{ backgroundColor: athlete.avatarColor }}
              >
                {athlete.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {athlete.name}
                </h1>
                <p className="text-sm text-slate-400">
                  {athlete.gender} • {athlete.age} years old • {athlete.weightKg} kg •{' '}
                  <span className="text-slate-300 font-medium">{athlete.raceCompleted}</span>
                </p>
              </div>
            </div>

            {/* Target Gait Cue Banner */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2.5 max-w-3xl">
              <Footprints className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Target Gait Re-Education Cue: </span>
                {athlete.targetGaitCue}
              </div>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenCheckin}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-950/40 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Daily Check-In</span>
            </button>
            <button
              onClick={onNavigateToSpreadsheet}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Full 12-Week Sheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Meter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recovery Readiness
            </span>
            <span
              className={`p-2 rounded-xl text-xs font-bold ${
                readiness.status === 'Optimal'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              {readiness.status}
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">{readiness.score}%</div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{readiness.advice}</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                readiness.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${readiness.score}%` }}
            />
          </div>
        </div>

        {/* Current Pain Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Current Pain (VAS)
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <TrendingDown className="w-3.5 h-3.5" /> -{painStats.painReductionPct}%
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">
              {painStats.latestPain} <span className="text-sm font-normal text-slate-500">/ 10</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Down from {painStats.initialPain}/10 post-marathon baseline
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Average across logged sessions: {painStats.averagePain}/10
          </div>
        </div>

        {/* Mobility Progression */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Spine &amp; Hip Mobility
            </span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-cyan-400">
              {painStats.latestMobility}
              <span className="text-sm font-normal text-slate-400"> / 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Full pelvic &amp; spinal flexion neutrality</p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${painStats.latestMobility}%` }}
            />
          </div>
        </div>

        {/* Health Tracker Sync */}
        <div
          onClick={onNavigateToSync}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synced Tracker
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="my-3">
            <div className="text-lg font-bold text-white flex items-center gap-2">
              <Watch className="w-5 h-5 text-purple-400" /> {activeService.name}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cadence: <span className="text-slate-200">{activeService.metrics.cadenceAvgSpM} spm</span> • Balance:{' '}
              <span className="text-slate-200">{activeService.metrics.groundContactBalance}</span>
            </p>
          </div>
          <div className="text-[11px] text-cyan-400 hover:underline flex items-center justify-between">
            <span>Manage Devices</span>
            <span>&rarr;</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Routine vs Injury Recovery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Today's Scheduled Routine */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Today&apos;s Prescribed Session
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{todayWorkout.title}</h3>
              <p className="text-xs text-slate-400">
                Focus: {todayWorkout.focus} • Estimated time: {todayWorkout.estimatedMinutes} mins
              </p>
            </div>
            <button
              onClick={() => onStartWorkout(todayWorkout)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Workout</span>
            </button>
          </div>

          {/* Exercise items list for today */}
          <div className="space-y-3 pt-2">
            {todayWorkout.exercises.map((item, idx) => {
              const ex = exerciseMap.get(item.exerciseId);
              if (!ex) return null;
              return (
                <div
                  key={item.exerciseId}
                  className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                        {ex.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-7 line-clamp-1">
                      {ex.techniqueCues[0]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0">
                    <div className="text-right text-xs">
                      <span className="font-semibold text-emerald-400">
                        {item.customSets || ex.defaultSets} sets
                      </span>
                      <span className="text-slate-400 block text-[11px]">
                        {item.customReps || ex.defaultReps}
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenVideo(ex)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-medium transition"
                      title="Preview demonstration video"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Demo</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
            <span>Weekly Mileage Tolerance: {thisWeekPlan.targetWalkingRunningTolerance}</span>
            <button
              onClick={onNavigateToSchedule}
              className="text-cyan-400 hover:underline font-semibold"
            >
              View Full Week Schedule &rarr;
            </button>
          </div>
        </div>

        {/* Right 5 Columns: Specific Injury Diagnostic Matrix & Contraindications */}
        <div className="lg:col-span-5 space-y-5">
          {/* Contraindications Warning Box */}
          <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Crucial Contraindications for {athlete.name}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {athlete.keyContraindicationNotice}
            </p>
          </div>

          {/* Injury Resolution Status Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Auckland Marathon Injury Status
            </h3>

            <div className="space-y-3">
              {athlete.injuries.map((injury) => (
                <div
                  key={injury.id}
                  className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{injury.title}</h4>
                      <p className="text-[11px] text-slate-400">{injury.anatomicalSite}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Rehab Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {injury.clinicalExplanation}
                  </p>

                  <div className="pt-1 text-[11px] text-cyan-400 font-medium">
                    Priority: {injury.rehabFocus[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
