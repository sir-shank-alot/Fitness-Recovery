import React, { useState } from 'react';
import { DailyLog, AthleteProfile } from '../types/rehab';
import { X, Activity, Moon, Footprints, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DailyCheckinModalProps {
  athlete: AthleteProfile;
  onClose: () => void;
  onSaveLog: (log: DailyLog) => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  athlete,
  onClose,
  onSaveLog,
}) => {
  const [painScore, setPainScore] = useState<number>(3);
  const [mobilityScore, setMobilityScore] = useState<number>(75);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [rpe, setRpe] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [toeClearance, setToeClearance] = useState<number>(4);
  const [firstStepPain, setFirstStepPain] = useState<number>(2);

  // Area ratings
  const defaultAreas =
    athlete.id === 'arwel'
      ? {
          'Lower Back (Facet)': 3,
          'Right Adductor': 3,
          'Right Knee': 2,
          'IT Band': 2,
        }
      : {
          'Right Plantar Fascia': 3,
          'Greater Trochanter (Hip)': 3,
          'Finger & Thumb Joints': 2,
          'Wrist / Elbow': 2,
        };

  const [painAreas, setPainAreas] = useState<Record<string, number>>(defaultAreas);

  const handleAreaChange = (area: string, val: number) => {
    setPainAreas((prev) => ({ ...prev, [area]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      athleteId: athlete.id,
      painScore,
      painAreas,
      mobilityScore,
      completedExerciseIds: [],
      perceivedExertion: rpe,
      sleepHours,
      hrvMs: 60 + Math.floor(Math.random() * 8),
      steps: 8000 + Math.floor(Math.random() * 2000),
      notes: notes || 'Daily recovery check-in completed.',
      gaitChecklist: {
        toeClearanceScore: athlete.id === 'arwel' ? toeClearance : undefined,
        firstStepPainVAS: athlete.id === 'helen' ? firstStepPain : undefined,
        lateralHipStability: 4,
      },
    };

    onSaveLog(newLog);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Recovery &amp; Pain Check-In</h3>
              <p className="text-xs text-slate-400">
                Logging for: <span className="text-white font-medium">{athlete.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Overall VAS Pain Slider */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-white">
                Overall Body Pain Intensity (VAS 0–10)
              </label>
              <span
                className={`text-lg font-black px-2.5 py-0.5 rounded-lg border ${
                  painScore <= 2
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : painScore <= 5
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {painScore} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={painScore}
              onChange={(e) => setPainScore(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0: Completely Pain-Free</span>
              <span>5: Moderate Discomfort</span>
              <span>10: Severe/Immobilizing</span>
            </div>
          </div>

          {/* Anatomical Area Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Specific Injury Sites (0-10)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(painAreas).map(([area, val]) => (
                <div key={area} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">{area}</span>
                    <span className="font-bold text-cyan-400">{val} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={val}
                    onChange={(e) => handleAreaChange(area, Number(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Athlete-Specific Specialized Metric */}
          {athlete.id === 'arwel' ? (
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-blue-300 flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-blue-400" /> Right Toe Ground Clearance Score
                </label>
                <span className="text-sm font-bold text-white px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700">
                  {toeClearance} / 5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Rate your right foot swing phase today while walking or moving:
              </p>
              <div className="grid grid-cols-5 gap-2 pt-1">
                {[
                  { score: 1, label: 'Scuffing Often' },
                  { score: 2, label: 'Occasional Catch' },
                  { score: 3, label: 'Low Clearance' },
                  { score: 4, label: 'Clean Pickup' },
                  { score: 5, label: 'Flawless High Toe' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.score}
                    onClick={() => setToeClearance(item.score)}
                    className={`p-2 rounded-lg text-center transition border ${
                      toeClearance === item.score
                        ? 'bg-blue-600 text-white border-blue-400 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-sm">{item.score}</div>
                    <div className="text-[10px] leading-tight mt-0.5">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <Footprints className="w-4 h-4 text-emerald-400" /> Morning First-Step Plantar Pain (VAS 0–10)
                </label>
                <span className="text-sm font-bold text-white px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700">
                  {firstStepPain} / 10
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Severity of stabbing heel pain experienced during your first 10 steps out of bed this morning:
              </p>
              <input
                type="range"
                min="0"
                max="10"
                value={firstStepPain}
                onChange={(e) => setFirstStepPain(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0: No pain on waking</span>
                <span>5: Limping first few steps</span>
                <span>10: Intense hobbling</span>
              </div>
            </div>
          )}

          {/* Mobility & Sleep Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex justify-between">
                <span>Perceived Mobility Score (0–100)</span>
                <span className="text-cyan-400 font-semibold">{mobilityScore}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={mobilityScore}
                onChange={(e) => setMobilityScore(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" /> Sleep Duration (Hours)
                </span>
                <span className="text-indigo-300 font-semibold">{sleepHours} hrs</span>
              </label>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-700 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Daily Training &amp; Subjective Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Walking felt smooth today. Slept with pillow between knees. Felt no lower back pinching..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            Save Daily Check-In
          </button>
        </form>
      </div>
    </div>
  );
};
