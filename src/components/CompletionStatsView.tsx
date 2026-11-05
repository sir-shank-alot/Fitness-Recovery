import React, { useState } from 'react';
import { PlanWeek, AthleteProfile, WorkoutCompletionState } from '../types/rehab';
import { calculateWorkoutCompletionStats, exportCompletionMetricsToCsv } from '../utils/rehab-logic';
import {
  CheckCircle2,
  Calendar,
  Clock,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Flame,
  Award,
  Layers,
  BarChart3,
  CheckSquare,
  Square,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface CompletionStatsViewProps {
  weeks: PlanWeek[];
  currentAthlete: AthleteProfile;
  completions: WorkoutCompletionState;
  onToggleWorkout: (weekNumber: number, dayNumber: number, dayName: string, workoutTitle: string) => void;
  onNavigateToSchedule?: (weekNumber: number) => void;
}

export const CompletionStatsView: React.FC<CompletionStatsViewProps> = ({
  weeks,
  currentAthlete,
  completions,
  onToggleWorkout,
  onNavigateToSchedule,
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<'all' | '1' | '2' | '3'>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const stats = calculateWorkoutCompletionStats(weeks, currentAthlete.id, completions);

  const handleExportCsv = () => {
    const csv = exportCompletionMetricsToCsv(weeks, currentAthlete.id, completions, currentAthlete.name);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${currentAthlete.name.replace(/\s+/g, '_')}_Workout_Completion_Stats_${timestamp}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Exported ${currentAthlete.name}'s completion metrics to ${filename}`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const filteredWeeks = weeks.filter((w) => {
    if (selectedPhaseFilter === 'all') return true;
    return w.phase.toString() === selectedPhaseFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Quick Export Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Workout Adherence Tracking
            </span>
            <span className="text-xs text-slate-400">
              Athlete: <strong className="text-white">{currentAthlete.name}</strong> ({currentAthlete.gender === 'Male' ? '63M' : '58F'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Workout Completion &amp; Progress Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Detailed tracking across daily sessions, 12 weeks, and total plan adherence. Check off completed workouts to update live recovery metrics and export directly to spreadsheet.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition hover:scale-105 active:scale-95"
            title="Export workout completion and adherence stats to CSV"
          >
            <Download className="w-4 h-4" />
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Export Progress to Spreadsheet</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 2. Top-Level Summary KPI Cards (Total Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Completed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Completed
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {stats.totalCompletedWorkouts}
            </span>
            <span className="text-xs text-slate-400">
              / {stats.totalActiveWorkouts} active sessions
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Scheduled across 12-week recovery curriculum
          </p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overallCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Overall Completion Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Adherence Rate
            </span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-cyan-400">
              {stats.overallCompletionRate}%
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {stats.overallCompletionRate >= 75
                ? 'Outstanding'
                : stats.overallCompletionRate >= 40
                ? 'On Track'
                : 'Building Consistency'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Key metric for tissue remodeling and resilience
          </p>
          <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.overallCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Minutes of Dedicated Rehab */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rehab Time Logged
            </span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {stats.totalMinutesCompleted}
            </span>
            <span className="text-xs text-slate-400">minutes</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Approx. {(stats.totalMinutesCompleted / 60).toFixed(1)} hours of guided stability work
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-purple-300">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Targeting spine and joint relief</span>
          </div>
        </div>

        {/* Plan Phase Milestone */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Phase Coverage
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-black text-amber-400">
              {stats.weekStats.filter((w) => w.completedWorkouts > 0).length}
            </span>
            <span className="text-xs text-slate-400">/ 12 weeks active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Progressing from Acute De-load to Dynamic Running
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span>12-week goal: 100% spinal endurance</span>
          </div>
        </div>
      </div>

      {/* 3. Day of the Week Completion Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Day-by-Day Adherence Stats</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              See which days of the week you complete your rehab most consistently.
            </p>
          </div>
          <span className="text-xs text-slate-400">Monday through Sunday patterns</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {stats.dayStats.map((ds) => {
            const isPerfect = ds.completionRate === 100 && ds.totalWorkouts > 0;
            return (
              <div
                key={ds.dayNumber}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>{ds.dayName.slice(0, 3)}</span>
                    <span
                      className={`text-[11px] font-black ${
                        isPerfect
                          ? 'text-emerald-400'
                          : ds.completionRate > 0
                          ? 'text-cyan-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {ds.completionRate}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    <strong className="text-white">{ds.completedWorkouts}</strong> / {ds.totalWorkouts} done
                  </p>
                </div>

                <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isPerfect ? 'bg-emerald-400' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${ds.completionRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Week-by-Week Completion Breakdown Table & Checkbox Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckSquare className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">12-Week Workout Completion Grid</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any checkbox to immediately mark a workout completed or pending. State is synchronized and saved.
            </p>
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Filter Phase:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', '1', '2', '3'] as const).map((phaseVal) => (
                <button
                  key={phaseVal}
                  onClick={() => setSelectedPhaseFilter(phaseVal)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    selectedPhaseFilter === phaseVal
                      ? 'bg-slate-800 text-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {phaseVal === 'all' ? 'All Weeks' : `Phase ${phaseVal}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Cards with Individual Workout Checkboxes */}
        <div className="space-y-4">
          {filteredWeeks.map((week) => {
            const wStat = stats.weekStats.find((ws) => ws.weekNumber === week.weekNumber);
            const isWeekComplete = wStat && wStat.completedWorkouts === wStat.totalWorkouts && wStat.totalWorkouts > 0;

            return (
              <div
                key={week.weekNumber}
                className={`rounded-2xl border transition ${
                  isWeekComplete
                    ? 'bg-emerald-950/20 border-emerald-800/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                } p-4 sm:p-5`}
              >
                {/* Week Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 border ${
                        isWeekComplete
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-white border-slate-700'
                      }`}
                    >
                      W{week.weekNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">
                          Week {week.weekNumber}: {week.phaseName.split(':')[0]}
                        </h3>
                        {isWeekComplete && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <Sparkles className="w-3 h-3" /> Week Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{week.weeklyObjective}</p>
                    </div>
                  </div>

                  {/* Week Stats Pill */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">
                        {wStat?.completedWorkouts || 0} / {wStat?.totalWorkouts || 0} Done (
                        <span className="text-cyan-400">{wStat?.completionRate || 0}%</span>)
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {wStat?.totalMinutesCompleted || 0} mins logged
                      </div>
                    </div>
                    {onNavigateToSchedule && (
                      <button
                        onClick={() => onNavigateToSchedule(week.weekNumber)}
                        className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition"
                        title={`View Week ${week.weekNumber} in Schedule view`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Days Checkbox Grid for this Week */}
                <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {week.days.map((day) => {
                    const isRest = day.isRestDay && day.exercises.length === 0;
                    const key = `${currentAthlete.id}_w${week.weekNumber}_d${day.dayNumber}`;
                    const isCompleted = completions[key]?.completed === true;

                    if (isRest) {
                      return (
                        <div
                          key={day.dayNumber}
                          className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-xs text-slate-500 opacity-75"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{day.dayName}:</span>
                            <span>Rest &amp; Tissue Recovery</span>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-slate-600">Rest</span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={day.dayNumber}
                        onClick={() =>
                          onToggleWorkout(week.weekNumber, day.dayNumber, day.dayName, day.title)
                        }
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between select-none ${
                          isCompleted
                            ? 'bg-emerald-950/30 border-emerald-500/40 hover:bg-emerald-950/50'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <button
                            type="button"
                            aria-label={`Toggle completion for Week ${week.weekNumber} ${day.dayName}`}
                            className="mt-0.5 shrink-0 text-slate-400 transition"
                          >
                            {isCompleted ? (
                              <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-xs font-bold ${
                                  isCompleted ? 'text-emerald-300 line-through' : 'text-white'
                                }`}
                              >
                                {day.dayName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                • ~{day.estimatedMinutes}m
                              </span>
                            </div>
                            <p
                              className={`text-[11px] truncate ${
                                isCompleted ? 'text-slate-400' : 'text-slate-300'
                              }`}
                              title={day.title}
                            >
                              {day.title}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {isCompleted ? 'DONE' : 'CHECK'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
