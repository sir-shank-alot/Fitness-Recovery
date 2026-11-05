import React, { useState } from 'react';
import { PlanWeek, Exercise, AthleteId, WorkoutDay, WorkoutCompletionState } from '../types/rehab';
import {
  Calendar,
  CheckCircle,
  Play,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Video,
  Youtube,
  CheckSquare,
  Square,
  BarChart3,
} from 'lucide-react';

interface ScheduleViewProps {
  weeks: PlanWeek[];
  exercises: Exercise[];
  currentAthleteId: AthleteId;
  athleteName: string;
  onStartWorkout: (workout: WorkoutDay, weekNumber: number) => void;
  onOpenVideo: (exercise: Exercise) => void;
  completions?: WorkoutCompletionState;
  onToggleWorkout?: (weekNumber: number, dayNumber: number, dayName: string, workoutTitle: string) => void;
  onNavigateToStats?: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  weeks,
  exercises,
  currentAthleteId,
  athleteName,
  onStartWorkout,
  onOpenVideo,
  completions = {},
  onToggleWorkout,
  onNavigateToStats,
}) => {
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);
  const currentWeekPlan = weeks.find((w) => w.weekNumber === selectedWeekNum) || weeks[0];
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  return (
    <div className="space-y-6">
      {/* Week Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" /> 12-Week Progressive Schedule
            </h2>
            <p className="text-xs text-slate-400">
              Personalized for <span className="text-white font-medium">{athleteName}</span>
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              currentWeekPlan.phase === 1
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : currentWeekPlan.phase === 2
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {currentWeekPlan.phaseName}
          </span>
        </div>

        {/* 12 Weeks Buttons Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-1">
          {weeks.map((week) => {
            const isSelected = week.weekNumber === selectedWeekNum;
            return (
              <button
                key={week.weekNumber}
                onClick={() => setSelectedWeekNum(week.weekNumber)}
                className={`py-2 px-1 rounded-xl text-center transition flex flex-col items-center border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-75">Wk</span>
                <span className="text-base font-black leading-none mt-0.5">{week.weekNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Week Focus & Athlete Guidance Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Week {selectedWeekNum} Clinical Objective
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentWeekPlan.weeklyObjective}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Athlete Specific Directive ({athleteName})
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {currentWeekPlan.athleteSpecificFocus?.[currentAthleteId] ||
                (currentAthleteId === 'arwel'
                  ? currentWeekPlan.athleteSpecificFocus?.arwel
                  : currentWeekPlan.athleteSpecificFocus?.helen) ||
                currentWeekPlan.weeklyObjective}
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs text-blue-200 flex items-center justify-between">
          <span>
            <strong className="text-white">Gait / Running Guideline: </strong>
            {currentWeekPlan.targetWalkingRunningTolerance}
          </span>
        </div>
      </div>

      {/* 7 Days Workout Breakdown */}
      <div className="space-y-4">
        {currentWeekPlan.days.map((day) => {
          if (day.isRestDay && day.exercises.length === 0) {
            return (
              <div
                key={day.dayNumber}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{day.dayName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                      Rest &amp; Nervous System Regeneration
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-300 mt-1">{day.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{day.focus}</p>
                </div>
                <span className="text-xs text-slate-500 italic">No scheduled lifting</span>
              </div>
            );
          }

          const workoutKey = `${currentAthleteId}_w${selectedWeekNum}_d${day.dayNumber}`;
          const isDone = completions[workoutKey]?.completed === true;

          return (
            <div
              key={day.dayNumber}
              className={`border rounded-2xl p-6 shadow-xl space-y-4 transition ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-800/50 hover:border-emerald-700/60'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  {onToggleWorkout && (
                    <button
                      type="button"
                      onClick={() =>
                        onToggleWorkout(selectedWeekNum, day.dayNumber, day.dayName, day.title)
                      }
                      className="mt-1 p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                      title={isDone ? 'Mark as incomplete' : 'Mark workout as completed'}
                    >
                      {isDone ? (
                        <CheckSquare className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Day {day.dayNumber} • {day.dayName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> ~{day.estimatedMinutes} mins
                      </span>
                      {isDone && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-lg font-bold mt-1 ${
                        isDone ? 'text-emerald-200' : 'text-white'
                      }`}
                    >
                      {day.title}
                    </h3>
                    <p className="text-xs text-slate-400">{day.focus}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onToggleWorkout && (
                    <button
                      onClick={() =>
                        onToggleWorkout(selectedWeekNum, day.dayNumber, day.dayName, day.title)
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${isDone ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onStartWorkout(day, selectedWeekNum)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition hover:scale-[1.02]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Guided Session</span>
                  </button>
                </div>
              </div>

              {/* Day's Exercises Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {day.exercises.map((item, idx) => {
                  const ex = exerciseMap.get(item.exerciseId);
                  if (!ex) return null;

                  return (
                    <div
                      key={item.exerciseId}
                      className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col justify-between space-y-2 hover:border-slate-600 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">{ex.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 pl-5">
                            {item.customSets || ex.defaultSets} sets ×{' '}
                            {item.customReps || ex.defaultReps}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <a
                            href={ex.videoUrl || `https://www.youtube.com/watch?v=${ex.videoEmbedId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 p-1.5 rounded-lg bg-red-600/15 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs transition flex items-center gap-1"
                            title="Watch on YouTube"
                          >
                            <Youtube className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                            <span className="text-[10px] font-semibold hidden sm:inline">YouTube ↗</span>
                          </a>
                          <button
                            onClick={() => onOpenVideo(ex)}
                            className="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs transition"
                            title="Preview video demo and cues"
                          >
                            <Video className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 pl-5">
                        {ex.techniqueCues[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
