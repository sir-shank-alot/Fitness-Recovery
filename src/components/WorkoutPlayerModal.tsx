import React, { useState, useEffect } from 'react';
import { WorkoutDay, Exercise, AthleteId } from '../types/rehab';
import { formatDuration } from '../utils/rehab-logic';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Volume2,
  AlertCircle,
  ShieldCheck,
  Video,
  Youtube,
  ExternalLink,
} from 'lucide-react';

interface WorkoutPlayerModalProps {
  workout: WorkoutDay;
  weekNumber: number;
  athleteId: AthleteId;
  athleteName: string;
  exercises: Exercise[];
  onClose: () => void;
  onFinishWorkout: (completedExerciseIds: string[]) => void;
  onOpenVideo: (exercise: Exercise) => void;
}

export const WorkoutPlayerModal: React.FC<WorkoutPlayerModalProps> = ({
  workout,
  weekNumber,
  athleteName,
  exercises,
  onClose,
  onFinishWorkout,
  onOpenVideo,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [completedSetsCount, setCompletedSetsCount] = useState<Record<string, number>>({});
  const [timerSeconds, setTimerSeconds] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerPreset, setTimerPreset] = useState<number>(10);
  const [isCompleted, setIsCompleted] = useState(false);

  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));
  const currentItem = workout.exercises[currentIdx];
  const currentExercise = currentItem ? exerciseMap.get(currentItem.exerciseId) : null;

  // Sound chime simulator via AudioContext
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext unavailable in silent headless environment
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playBeep();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Set default timer based on exercise type
  useEffect(() => {
    if (!currentExercise) return;
    let defaultTime = 10;
    if (currentExercise.id.includes('spanish-squat')) defaultTime = 45;
    else if (currentExercise.id.includes('copenhagen')) defaultTime = 20;
    else if (currentExercise.id.includes('wall')) defaultTime = 20;
    else if (currentExercise.id.includes('stretch') || currentExercise.id.includes('tuck'))
      defaultTime = 30;
    else if (currentExercise.id.includes('curlup') || currentExercise.id.includes('side-bridge'))
      defaultTime = 10;

    setTimerSeconds(defaultTime);
    setTimerPreset(defaultTime);
    setIsTimerRunning(false);
  }, [currentExercise]);

  const handleToggleSet = (exId: string) => {
    const totalSets = currentItem?.customSets || currentExercise?.defaultSets || 3;
    const cur = completedSetsCount[exId] || 0;
    const next = cur >= totalSets ? 0 : cur + 1;
    setCompletedSetsCount((prev) => ({ ...prev, [exId]: next }));

    if (next >= totalSets && !completedExerciseIds.includes(exId)) {
      setCompletedExerciseIds((prev) => [...prev, exId]);
    }
  };

  const handleNext = () => {
    if (currentIdx < workout.exercises.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleCompleteSession = () => {
    onFinishWorkout(completedExerciseIds);
    onClose();
  };

  if (!currentExercise || isCompleted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle className="w-9 h-9" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Workout Completed!</h3>
            <p className="text-slate-400 text-sm mt-1">
              Outstanding work, {athleteName}. Session logged for Week {weekNumber}, {workout.title}.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-300">
              <span>Exercises Completed:</span>
              <span className="font-semibold text-emerald-400">
                {completedExerciseIds.length} of {workout.exercises.length}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Session Time:</span>
              <span className="font-semibold text-slate-200">{workout.estimatedMinutes} min</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Session Focus:</span>
              <span className="font-semibold text-slate-200">{workout.focus}</span>
            </div>
          </div>

          <button
            onClick={handleCompleteSession}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            Save Session &amp; Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentSetsFinished = completedSetsCount[currentExercise.id] || 0;
  const targetSets = currentItem.customSets || currentExercise.defaultSets;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                Week {weekNumber} • {workout.dayName}
              </span>
              <span className="text-xs text-slate-400">for {athleteName}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">{workout.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Movement {currentIdx + 1} of {workout.exercises.length}
          </span>
          <div className="flex items-center gap-1.5">
            {workout.exercises.map((item, i) => {
              const isDone = completedExerciseIds.includes(item.exerciseId);
              const isCurrent = i === currentIdx;
              return (
                <div
                  key={item.exerciseId}
                  className={`w-6 h-2 rounded-full transition-all ${
                    isDone
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-cyan-500 w-8'
                      : 'bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Body Section */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Exercise Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700">
                    {currentExercise.category}
                  </span>
                  <h4 className="text-2xl font-bold text-white mt-1.5">{currentExercise.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">Equipment: {currentExercise.equipment}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={currentExercise.videoUrl || `https://www.youtube.com/watch?v=${currentExercise.videoEmbedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition"
                    title="Watch exercise demonstration on YouTube"
                  >
                    <Youtube className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>YouTube ↗</span>
                  </a>
                  <button
                    onClick={() => onOpenVideo(currentExercise)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Cues</span>
                  </button>
                </div>
              </div>

              {/* Prescription Card */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Target Prescription</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {targetSets} sets × {currentItem.customReps || currentExercise.defaultReps}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleSet(currentExercise.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    currentSetsFinished >= targetSets
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    Log Set ({currentSetsFinished} / {targetSets})
                  </span>
                </button>
              </div>

              {/* Form Cues */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Execution Checklist:
                </h5>
                <ul className="space-y-2 text-sm text-slate-300">
                  {currentExercise.techniqueCues.map((cue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Joint-Friendly Mod */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-purple-300">Joint Protection Tip: </span>
                  {currentExercise.jointFriendlyModification}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Hold Timer & Stopwatch */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Isometric / Rep Timer</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Volume2 className="w-3.5 h-3.5" /> Chime Active
                  </span>
                </div>

                {/* Big Circular/Digital Display */}
                <div className="py-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
                  <div className="text-5xl font-mono font-black tracking-tight text-white">
                    {formatDuration(timerSeconds)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {timerSeconds === 0 ? 'Hold Complete! Rest now.' : 'Hold & breathe smoothly'}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                      isTimerRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(timerPreset);
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Presets */}
                <div className="pt-2">
                  <div className="text-[11px] text-slate-400 mb-1.5">Quick Presets:</div>
                  <div className="flex justify-center gap-1.5">
                    {[10, 20, 30, 45, 60].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerPreset(sec);
                          setTimerSeconds(sec);
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                          timerPreset === sec
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clinical Safety Alert */}
              <div className="mt-4 p-3 rounded-lg bg-amber-950/30 border border-amber-800/30 text-[11px] text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>If pain exceeds 3/10 or becomes sharp, cease hold immediately.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 text-sm font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-400">
            {currentIdx < workout.exercises.length - 1 ? (
              <span>Next up: {exerciseMap.get(workout.exercises[currentIdx + 1]?.exerciseId)?.name}</span>
            ) : (
              <span className="text-emerald-400 font-semibold">Final movement!</span>
            )}
          </div>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold shadow-lg transition"
          >
            <span>{currentIdx < workout.exercises.length - 1 ? 'Next Movement' : 'Complete Session'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
