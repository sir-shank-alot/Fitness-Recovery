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

import {
  WorkoutCompletionState,
  WorkoutCompletionStats,
  DayCompletionStat,
  WeekCompletionStat,
} from '../types/rehab';

/**
 * Derives comprehensive completion stats across days, weeks, and total plan
 */
export function calculateWorkoutCompletionStats(
  weeks: PlanWeek[],
  athleteId: AthleteId,
  completions: WorkoutCompletionState
): WorkoutCompletionStats {
  let totalActiveWorkouts = 0;
  let totalCompletedWorkouts = 0;
  let totalMinutesCompleted = 0;

  // Track per-day breakdown (Monday=1 through Sunday=7)
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayCounters: Record<number, { completed: number; total: number; name: string }> = {};
  for (let d = 1; d <= 7; d++) {
    dayCounters[d] = { completed: 0, total: 0, name: dayNames[d - 1] };
  }

  // Track per-week breakdown
  const weekStats: WeekCompletionStat[] = [];

  weeks.forEach((week) => {
    let weekActiveTotal = 0;
    let weekCompleted = 0;
    let weekMinutes = 0;

    week.days.forEach((day) => {
      // If a day has no exercises and is a designated rest day with 0 minutes, we still count scheduled session days
      const isRest = day.isRestDay && day.exercises.length === 0;
      if (!isRest) {
        weekActiveTotal++;
        totalActiveWorkouts++;
        dayCounters[day.dayNumber].total++;

        const key = `${athleteId}_w${week.weekNumber}_d${day.dayNumber}`;
        const isDone = completions[key]?.completed === true;

        if (isDone) {
          weekCompleted++;
          totalCompletedWorkouts++;
          dayCounters[day.dayNumber].completed++;
          const duration = day.estimatedMinutes || 20;
          weekMinutes += duration;
          totalMinutesCompleted += duration;
        }
      }
    });

    const weekRate = weekActiveTotal > 0 ? Math.round((weekCompleted / weekActiveTotal) * 100) : 0;
    weekStats.push({
      weekNumber: week.weekNumber,
      phase: week.phase,
      phaseName: week.phaseName,
      completedWorkouts: weekCompleted,
      totalWorkouts: weekActiveTotal,
      completionRate: weekRate,
      totalMinutesCompleted: weekMinutes,
    });
  });

  const overallRate =
    totalActiveWorkouts > 0 ? Math.round((totalCompletedWorkouts / totalActiveWorkouts) * 100) : 0;

  const dayStats: DayCompletionStat[] = Object.keys(dayCounters).map((dKey) => {
    const dNum = Number(dKey);
    const item = dayCounters[dNum];
    const rate = item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0;
    return {
      dayNumber: dNum,
      dayName: item.name,
      completedWorkouts: item.completed,
      totalWorkouts: item.total,
      completionRate: rate,
    };
  });

  return {
    athleteId,
    totalActiveWorkouts,
    totalCompletedWorkouts,
    overallCompletionRate: overallRate,
    totalMinutesCompleted,
    dayStats,
    weekStats,
  };
}

/**
 * Generates an Excel-ready CSV string specifically for Workout Completion Metrics
 * detailing overall stats, weekly breakdown, daily day-of-week breakdown, and session logs.
 */
export function exportCompletionMetricsToCsv(
  weeks: PlanWeek[],
  athleteId: AthleteId,
  completions: WorkoutCompletionState,
  athleteName: string
): string {
  const stats = calculateWorkoutCompletionStats(weeks, athleteId, completions);

  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const lines: string[] = [];

  // 1. Plan Overview Section
  lines.push(`"SPINE & STRIDE: WORKOUT COMPLETION & RECOVERY PROGRESS REPORT"`);
  lines.push(`"Athlete","${athleteName}"`);
  lines.push(`"Exported At","${new Date().toISOString()}"`);
  lines.push(`"Total Scheduled Active Workouts","${stats.totalActiveWorkouts}"`);
  lines.push(`"Total Completed Workouts","${stats.totalCompletedWorkouts}"`);
  lines.push(`"Overall Plan Completion Rate","${stats.overallCompletionRate}%"`);
  lines.push(`"Total Rehabilitation Minutes Completed","${stats.totalMinutesCompleted} mins"`);
  lines.push('');

  // 2. Weekly Progress Breakdown Table
  lines.push('"--- WEEK-BY-WEEK COMPLETION BREAKDOWN ---"');
  lines.push(
    ['Week', 'Phase', 'Phase Description', 'Completed Workouts', 'Total Workouts', 'Completion Rate (%)', 'Minutes Completed']
      .map(escapeCell)
      .join(',')
  );
  stats.weekStats.forEach((ws) => {
    lines.push(
      [
        `Week ${ws.weekNumber}`,
        `Phase ${ws.phase}`,
        ws.phaseName,
        ws.completedWorkouts,
        ws.totalWorkouts,
        `${ws.completionRate}%`,
        `${ws.totalMinutesCompleted} mins`,
      ]
        .map(escapeCell)
        .join(',')
    );
  });
  lines.push('');

  // 3. Day of Week Breakdown Table
  lines.push('"--- DAY-OF-WEEK ADHERENCE METRICS ---"');
  lines.push(
    ['Day of Week', 'Completed Sessions', 'Total Sessions Scheduled', 'Adherence Rate (%)']
      .map(escapeCell)
      .join(',')
  );
  stats.dayStats.forEach((ds) => {
    lines.push(
      [ds.dayName, ds.completedWorkouts, ds.totalWorkouts, `${ds.completionRate}%`]
        .map(escapeCell)
        .join(',')
    );
  });
  lines.push('');

  // 4. Granular Workout-by-Workout Log Table
  lines.push('"--- GRANULAR 12-WEEK WORKOUT LOG & CHECKBOX STATUS ---"');
  lines.push(
    [
      'Week',
      'Phase',
      'Day Name',
      'Workout Title',
      'Focus & Target',
      'Estimated Duration',
      'Exercises Count',
      'Completion Status',
      'Completed Timestamp',
    ]
      .map(escapeCell)
      .join(',')
  );

  weeks.forEach((week) => {
    week.days.forEach((day) => {
      const isRest = day.isRestDay && day.exercises.length === 0;
      const key = `${athleteId}_w${week.weekNumber}_d${day.dayNumber}`;
      const rec = completions[key];
      const status = isRest ? 'Scheduled Rest' : rec?.completed ? 'COMPLETED' : 'PENDING';
      const timestamp = rec?.completedAt ? rec.completedAt : 'N/A';

      lines.push(
        [
          `Week ${week.weekNumber}`,
          `Phase ${week.phase}`,
          day.dayName,
          day.title,
          day.focus,
          `${day.estimatedMinutes} mins`,
          day.exercises.length,
          status,
          timestamp,
        ]
          .map(escapeCell)
          .join(',')
      );
    });
  });

  return lines.join('\r\n');
}
