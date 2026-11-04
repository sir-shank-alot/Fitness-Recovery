import React, { useState } from 'react';
import { AssessmentResult, AthleteProfile } from '../types/rehab';
import { INITIAL_ASSESSMENTS } from '../data/rehabData';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Activity,
  ArrowRight,
} from 'lucide-react';

interface AssessmentViewProps {
  athlete: AthleteProfile;
  onSaveAssessment: (assessment: AssessmentResult) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  athlete,
  onSaveAssessment,
}) => {
  const existingAssessment = INITIAL_ASSESSMENTS[athlete.id];

  const [extensionVAS, setExtensionVAS] = useState<number>(
    existingAssessment?.extensionIntoleranceVAS || 4
  );
  const [curlUpSec, setCurlUpSec] = useState<number>(
    existingAssessment?.mcgillBig3ScoreSeconds.curlUp || 30
  );
  const [sideBridgeLSec, setSideBridgeLSec] = useState<number>(
    existingAssessment?.mcgillBig3ScoreSeconds.sideBridgeL || 25
  );
  const [sideBridgeRSec, setSideBridgeRSec] = useState<number>(
    existingAssessment?.mcgillBig3ScoreSeconds.sideBridgeR || 25
  );
  const [birdDogSec, setBirdDogSec] = useState<number>(
    existingAssessment?.mcgillBig3ScoreSeconds.birdDog || 30
  );
  const [adductorTolerance, setAdductorTolerance] = useState<'None' | 'Mild' | 'Moderate' | 'Sharp'>(
    existingAssessment?.adductorSqueezeTolerance || 'Mild'
  );
  const [trendelenburg, setTrendelenburg] = useState<
    'Negative (Stable)' | 'Mild Drop' | 'Pronounced Drop'
  >(existingAssessment?.trendelenburgSign || 'Mild Drop');
  const [windlassPain, setWindlassPain] = useState<boolean>(
    existingAssessment?.windlassTestPain || false
  );
  const [jointSwelling, setJointSwelling] = useState<'Normal' | 'Mild Stiffness' | 'Active Flare'>(
    existingAssessment?.jointSwellingIndex || 'Mild Stiffness'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let readinessTier: 'Foundational Re-education' | 'Controlled Loading' | 'Dynamic Re-integration' =
      'Controlled Loading';

    if (extensionVAS > 5 || adductorTolerance === 'Sharp' || jointSwelling === 'Active Flare') {
      readinessTier = 'Foundational Re-education';
    } else if (curlUpSec >= 40 && extensionVAS <= 2 && adductorTolerance === 'None' && !windlassPain) {
      readinessTier = 'Dynamic Re-integration';
    }

    const insights: string[] = [];
    if (extensionVAS > 3) {
      insights.push(
        'Lumbar facet joint irritation detected during backward arching. Prioritize neutral McGill Big 3 and posterior pelvic tilt.'
      );
    } else {
      insights.push('Spine extension tolerance is improving; anterior core canister is stabilizing lumbar lordosis.');
    }

    if (adductorTolerance !== 'None') {
      insights.push(
        'Adductor strain remains active. Continue Copenhagen plank short lever regressions and psoas marching to safeguard swing-phase toe clearance.'
      );
    }

    if (trendelenburg !== 'Negative (Stable)') {
      insights.push(
        'Pelvic drop detected on single-leg stance. Continue isometric wall abduction and monster walks to protect the greater trochanter.'
      );
    }

    if (windlassPain) {
      insights.push(
        'Positive Windlass stretch confirms active plantar fasciitis. Emphasize Rathleff protocol with towel elevation.'
      );
    }

    const newResult: AssessmentResult = {
      date: new Date().toISOString().slice(0, 10),
      athleteId: athlete.id,
      extensionIntoleranceVAS: extensionVAS,
      mcgillBig3ScoreSeconds: {
        curlUp: curlUpSec,
        sideBridgeL: sideBridgeLSec,
        sideBridgeR: sideBridgeRSec,
        birdDog: birdDogSec,
      },
      adductorSqueezeTolerance: adductorTolerance,
      trendelenburgSign: trendelenburg,
      windlassTestPain: windlassPain,
      jointSwellingIndex: jointSwelling,
      calculatedReadinessTier: readinessTier,
      actionableInsights: insights,
    };

    onSaveAssessment(newResult);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Stethoscope className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">Clinical Movement Screen &amp; Self-Test</h2>
            <p className="text-xs text-slate-400">
              Biomechanical tolerance check for <span className="text-white font-medium">{athlete.name}</span>
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Clinical assessment saved and rehabilitation prescription updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive Physical Screen */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Test 1: Lumbar Extension Tolerance */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-white">
                1. Standing Lumbar Extension Test (Kemp’s Test Provocation)
              </label>
              <span className="text-xs font-bold text-cyan-400">{extensionVAS} / 10 VAS</span>
            </div>
            <p className="text-xs text-slate-400">
              Stand with hands on hips and arch backward 15 degrees. Rate any pinching in the lower back:
            </p>
            <input
              type="range"
              min="0"
              max="10"
              value={extensionVAS}
              onChange={(e) => setExtensionVAS(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-700 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0: Completely Pain-Free</span>
              <span>10: Severe Sharp Facet Catch</span>
            </div>
          </div>

          {/* Test 2: McGill Big 3 Endurance */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <label className="text-sm font-bold text-white block">
              2. McGill Big 3 Core Endurance (Seconds Maintained)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Modified Curl-Up</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={curlUpSec}
                  onChange={(e) => setCurlUpSec(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-center text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Side Bridge (L)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={sideBridgeLSec}
                  onChange={(e) => setSideBridgeLSec(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-center text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Side Bridge (R)</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={sideBridgeRSec}
                  onChange={(e) => setSideBridgeRSec(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-center text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Bird Dog Neutral</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={birdDogSec}
                  onChange={(e) => setBirdDogSec(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-center text-white"
                />
              </div>
            </div>
          </div>

          {/* Test 3: Adductor Squeeze & Gait Toe Pickup */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <label className="text-sm font-bold text-white block">
              3. Supine Adductor Squeeze Test (45° Hip Flexion)
            </label>
            <p className="text-xs text-slate-400">
              Squeeze a yoga block between your knees at 75% effort. How does the right adductor react?
            </p>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['None', 'Mild', 'Moderate', 'Sharp'] as const).map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setAdductorTolerance(level)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold border transition ${
                    adductorTolerance === level
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Test 4: Single Leg Stance (Trendelenburg) */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <label className="text-sm font-bold text-white block">
              4. Single-Leg Stance Test (Trendelenburg Hip Drop)
            </label>
            <p className="text-xs text-slate-400">
              Stand on affected leg for 30s in front of a mirror. Does opposite hip drop or tilt?
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['Negative (Stable)', 'Mild Drop', 'Pronounced Drop'] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setTrendelenburg(opt)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold border transition ${
                    trendelenburg === opt
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Test 5: Windlass Hallux Stretch (Plantar Fascia) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div>
              <label className="text-sm font-bold text-white block">
                5. Windlass Test for Plantar Fascia
              </label>
              <p className="text-xs text-slate-400">
                While standing, pull your big toe back toward your shin. Does it provoke heel pain?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWindlassPain(!windlassPain)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                windlassPain
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {windlassPain ? 'Positive (Pain)' : 'Negative (No Pain)'}
            </button>
          </div>

          {/* Test 6: Perimenopause Small-Joint Inflammatory State */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <label className="text-sm font-bold text-white block">
              6. Small Joint Synovial State (Fingers, Thumbs, Wrists)
            </label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['Normal', 'Mild Stiffness', 'Active Flare'] as const).map((state) => (
                <button
                  type="button"
                  key={state}
                  onClick={() => setJointSwelling(state)}
                  className={`py-2 px-1 rounded-lg text-xs font-semibold border transition ${
                    jointSwelling === state
                      ? 'bg-purple-600 text-white border-purple-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg transition"
          >
            Calculate Recovery Tier &amp; Update Insights
          </button>
        </div>

        {/* Right 5 Columns: Clinical Analysis & Safety Output */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Assessment Tier
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {existingAssessment?.calculatedReadinessTier || 'Controlled Loading'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Clinical Directives
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {existingAssessment?.actionableInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Test Protocol Advice */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Assessment Frequency
            </h4>
            <p className="leading-relaxed text-slate-400">
              Perform this self-test every 2 to 3 weeks (at the close of each phase) to objectively track
              lumbar facet desensitization, right adductor strength recovery, and plantar fascia load capacity.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
