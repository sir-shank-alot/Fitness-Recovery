import { Exercise, PlanWeek, AthleteId, DailyLog } from '../types/rehab';

/**
 * Generates an Excel-ready CSV string from the 12-week rehabilitation plan
 * with verified video demonstration links, technique cues, and athlete assignments.
 */
export function exportPlanToCsv(
  weeks: PlanWeek[],
  exercises: Exercise[],
  targetAthleteId?: AthleteId
): string {
  const exerciseMap = new Map(exercises.map((ex) => [ex.id, ex]));

  const headers = [
    'Week',
    'Phase',
    'Day',
    'Workout Title',
    'Focus',
    'Athlete Target',
    'Exercise Name',
    'Category',
    'Sets',
    'Reps / Hold Time',
    'Frequency',
    'Demonstration Video Link',
    'Video Source / Channel',
    'Biomechanical Rationale',
    'Key Technique Cues',
    'Joint-Friendly Modification',
    'Equipment Needed',
  ];

  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [headers.map(escapeCell).join(',')];

  weeks.forEach((week) => {
    week.days.forEach((day) => {
      if (day.exercises.length === 0) {
        rows.push(
          [
            week.weekNumber,
            week.phaseName,
            day.dayName,
            day.title,
            day.focus,
            targetAthleteId ? targetAthleteId.toUpperCase() : 'REST / RECOVERY',
            'Rest & Recovery Day',
            'Restoration',
            0,
            'N/A',
            'N/A',
            'N/A',
            'N/A',
            'Tissue rest & nervous system restoration',
            'Hydrate, log recovery metrics, sleep 8+ hours',
            'N/A',
            'None',
          ]
            .map(escapeCell)
            .join(',')
        );
        return;
      }

      day.exercises.forEach((item) => {
        const ex = exerciseMap.get(item.exerciseId);
        if (!ex) return;

        // If targetAthleteId is specified, check if exercise matches
        if (targetAthleteId && !ex.targetAthletes.includes(targetAthleteId)) {
          return;
        }

        const athleteTargetStr =
          ex.targetAthletes.length === 2
            ? 'Both (Arwel & Helen)'
            : ex.targetAthletes[0] === 'arwel'
            ? 'Arwel Thomas'
            : 'Helen Shanley';

        const cuesFormatted = ex.techniqueCues.join(' | ');

        rows.push(
          [
            week.weekNumber,
            week.phaseName,
            day.dayName,
            day.title,
            day.focus,
            athleteTargetStr,
            ex.name,
            ex.category,
            item.customSets || ex.defaultSets,
            item.customReps || ex.defaultReps,
            ex.frequency,
            ex.videoUrl,
            ex.videoChannel,
            ex.rationale,
            cuesFormatted,
            ex.jointFriendlyModification,
            ex.equipment,
          ]
            .map(escapeCell)
            .join(',')
        );
      });
    });
  });

  return rows.join('\r\n');
}

/**
 * Filter exercises appropriate for a given athlete profile
 */
export function filterExercisesForAthlete(exercises: Exercise[], athleteId: AthleteId): Exercise[] {
  return exercises.filter((ex) => ex.targetAthletes.includes(athleteId));
}

/**
 * Calculate completion adherence percentage (0-100)
 */
export function calculateAdherenceScore(completedDays: number, totalDays: number): number {
  if (totalDays <= 0) return 0;
  const pct = Math.round((completedDays / totalDays) * 100);
  return Math.min(100, Math.max(0, pct));
}

/**
 * Calculates pain reduction and mobility statistics from a chronological log
 */
export function calculatePainTrendStats(logs: DailyLog[]): {
  averagePain: number;
  initialPain: number;
  latestPain: number;
  painReductionPct: number;
  latestMobility: number;
  toeClearanceTrend?: number;
  firstStepPainTrend?: number;
} {
  if (logs.length === 0) {
    return {
      averagePain: 0,
      initialPain: 0,
      latestPain: 0,
      painReductionPct: 0,
      latestMobility: 0,
    };
  }

  const initialPain = logs[0].painScore;
  const latestPain = logs[logs.length - 1].painScore;
  const sumPain = logs.reduce((acc, log) => acc + log.painScore, 0);
  const averagePain = Number((sumPain / logs.length).toFixed(1));
  const latestMobility = logs[logs.length - 1].mobilityScore;

  let painReductionPct = 0;
  if (initialPain > 0) {
    painReductionPct = Math.round(((initialPain - latestPain) / initialPain) * 100);
  }

  const latestToeClearance = logs[logs.length - 1].gaitChecklist.toeClearanceScore;
  const latestFirstStep = logs[logs.length - 1].gaitChecklist.firstStepPainVAS;

  return {
    averagePain,
    initialPain,
    latestPain,
    painReductionPct: Math.max(0, painReductionPct),
    latestMobility,
    toeClearanceTrend: latestToeClearance,
    firstStepPainTrend: latestFirstStep,
  };
}

/**
 * Calculates day's recovery readiness tier based on pain, sleep, and HRV
 */
export function calculateReadinessStatus(log: DailyLog): {
  status: 'Optimal' | 'Caution' | 'Recovery';
  score: number;
  advice: string;
} {
  let readiness = 100;

  // Pain penalty
  readiness -= log.painScore * 6;

  // Sleep evaluation
  if (log.sleepHours < 6) {
    readiness -= 20;
  } else if (log.sleepHours < 7) {
    readiness -= 10;
  }

  // HRV evaluation
  if (log.hrvMs < 45) {
    readiness -= 15;
  }

  readiness = Math.max(10, Math.min(100, readiness));

  if (readiness >= 75) {
    return {
      status: 'Optimal',
      score: readiness,
      advice: 'Tissues primed for planned progressive strength loading.',
    };
  } else if (readiness >= 50) {
    return {
      status: 'Caution',
      score: readiness,
      advice: 'Mild fatigue or stiffness noted. Emphasize warm-up and avoid ballistic speeds.',
    };
  } else {
    return {
      status: 'Recovery',
      score: readiness,
      advice: 'High systemic load or joint irritation. Substitute loading with gentle mobility and decompression.',
    };
  }
}

/**
 * Format seconds into mm:ss
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
