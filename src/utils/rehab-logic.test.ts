import test from 'node:test';
import assert from 'node:assert/strict';
import {
  exportPlanToCsv,
  filterExercisesForAthlete,
  calculateAdherenceScore,
  calculatePainTrendStats,
  calculateReadinessStatus,
  formatDuration,
} from './rehab-logic';
import { EXERCISE_LIBRARY, FULL_12_WEEK_PLAN, INITIAL_DAILY_LOGS } from '../data/rehabData';
import { DailyLog } from '../types/rehab';

test('exportPlanToCsv generates non-empty CSV with required columns', () => {
  const csv = exportPlanToCsv(FULL_12_WEEK_PLAN, EXERCISE_LIBRARY);
  assert.ok(csv.length > 500);

  // Check headers
  assert.ok(csv.includes('"Week"'));
  assert.ok(csv.includes('"Exercise Name"'));
  assert.ok(csv.includes('"Demonstration Video Link"'));
  assert.ok(csv.includes('"Biomechanical Rationale"'));

  // Check that YouTube video links are present
  assert.ok(csv.includes('https://www.youtube.com/watch?v='));

  // Check specific exercises
  assert.ok(csv.includes('McGill Modified Curl-Up'));
  assert.ok(csv.includes('Rathleff Protocol High-Load Heel Raise'));
  assert.ok(csv.includes('Copenhagen Adductor Bridge'));
});

test('exportPlanToCsv supports athlete specific filtering', () => {
  const arwelCsv = exportPlanToCsv(FULL_12_WEEK_PLAN, EXERCISE_LIBRARY, 'arwel');
  assert.ok(arwelCsv.includes('McGill Modified Curl-Up'));
  assert.ok(arwelCsv.includes('Copenhagen Adductor Bridge'));
  // Rathleff is Helen-only
  assert.equal(arwelCsv.includes('Rathleff Protocol High-Load Heel Raise'), false);

  const helenCsv = exportPlanToCsv(FULL_12_WEEK_PLAN, EXERCISE_LIBRARY, 'helen');
  assert.ok(helenCsv.includes('Rathleff Protocol High-Load Heel Raise'));
  assert.ok(helenCsv.includes('Modified Neutral Clamshell'));
});

test('filterExercisesForAthlete correctly separates athlete targeted drills', () => {
  const arwelExercises = filterExercisesForAthlete(EXERCISE_LIBRARY, 'arwel');
  const helenExercises = filterExercisesForAthlete(EXERCISE_LIBRARY, 'helen');

  assert.ok(arwelExercises.length >= 8);
  assert.ok(helenExercises.length >= 8);

  const arwelHasPsoas = arwelExercises.some((e) => e.id === 'psoas-adductor-march');
  assert.equal(arwelHasPsoas, true);

  const helenHasPlantar = helenExercises.some((e) => e.id === 'rathleff-plantar-raise');
  assert.equal(helenHasPlantar, true);
});

test('calculateAdherenceScore handles edge cases and returns valid percentage', () => {
  assert.equal(calculateAdherenceScore(0, 0), 0);
  assert.equal(calculateAdherenceScore(6, 12), 50);
  assert.equal(calculateAdherenceScore(12, 12), 100);
  assert.equal(calculateAdherenceScore(15, 12), 100);
});

test('calculatePainTrendStats correctly derives metrics from logs', () => {
  const arwelLogs = INITIAL_DAILY_LOGS.filter((l) => l.athleteId === 'arwel');
  const stats = calculatePainTrendStats(arwelLogs);

  assert.equal(stats.initialPain, 5);
  assert.equal(stats.latestPain, 3);
  assert.equal(stats.painReductionPct, 40);
  assert.equal(stats.latestMobility, 74);
  assert.equal(stats.toeClearanceTrend, 4);
});

test('calculateReadinessStatus categorizes readiness tiers accurately', () => {
  const goodLog: DailyLog = {
    id: 'test-1',
    date: '2026-11-03',
    athleteId: 'arwel',
    painScore: 1,
    painAreas: {},
    mobilityScore: 85,
    completedExerciseIds: [],
    perceivedExertion: 3,
    sleepHours: 8.5,
    hrvMs: 65,
    steps: 8000,
    notes: '',
    gaitChecklist: {},
  };
  const goodStatus = calculateReadinessStatus(goodLog);
  assert.equal(goodStatus.status, 'Optimal');

  const severeLog: DailyLog = {
    id: 'test-2',
    date: '2026-11-03',
    athleteId: 'arwel',
    painScore: 8,
    painAreas: {},
    mobilityScore: 40,
    completedExerciseIds: [],
    perceivedExertion: 8,
    sleepHours: 5.0,
    hrvMs: 38,
    steps: 3000,
    notes: '',
    gaitChecklist: {},
  };
  const severeStatus = calculateReadinessStatus(severeLog);
  assert.equal(severeStatus.status, 'Recovery');
});

test('formatDuration formats seconds to mm:ss', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(600), '10:00');
});

import { calculateWorkoutCompletionStats, exportCompletionMetricsToCsv } from './rehab-logic';

test('calculateWorkoutCompletionStats computes days, weeks, and total metrics accurately', () => {
  const dummyCompletions = {
    'arwel_w1_d1': { completed: true },
    'arwel_w1_d2': { completed: true },
    'arwel_w2_d1': { completed: true },
  };

  const stats = calculateWorkoutCompletionStats(FULL_12_WEEK_PLAN, 'arwel', dummyCompletions);
  assert.equal(stats.athleteId, 'arwel');
  assert.equal(stats.totalCompletedWorkouts, 3);
  assert.ok(stats.totalActiveWorkouts > 50);
  assert.ok(stats.overallCompletionRate > 0 && stats.overallCompletionRate <= 100);
  assert.ok(stats.totalMinutesCompleted > 0);

  // Check days stats
  assert.equal(stats.dayStats.length, 7);
  const mondayStat = stats.dayStats.find((d) => d.dayName === 'Monday');
  assert.ok(mondayStat);
  assert.equal(mondayStat.completedWorkouts, 2); // W1D1 and W2D1

  // Check week stats
  assert.equal(stats.weekStats.length, 12);
  const w1Stat = stats.weekStats.find((w) => w.weekNumber === 1);
  assert.ok(w1Stat);
  assert.equal(w1Stat.completedWorkouts, 2);
});

test('exportCompletionMetricsToCsv produces structured progress report with all required sections', () => {
  const dummyCompletions = {
    'helen_w1_d1': { completed: true, completedAt: '2026-11-04T12:00:00.000Z' },
  };

  const csv = exportCompletionMetricsToCsv(FULL_12_WEEK_PLAN, 'helen', dummyCompletions, 'Helen Shanley');
  assert.ok(csv.includes('"SPINE & STRIDE: WORKOUT COMPLETION & RECOVERY PROGRESS REPORT"'));
  assert.ok(csv.includes('"Athlete","Helen Shanley"'));
  assert.ok(csv.includes('"--- WEEK-BY-WEEK COMPLETION BREAKDOWN ---"'));
  assert.ok(csv.includes('"--- DAY-OF-WEEK ADHERENCE METRICS ---"'));
  assert.ok(csv.includes('"--- GRANULAR 12-WEEK WORKOUT LOG & CHECKBOX STATUS ---"'));
  assert.ok(csv.includes('COMPLETED'));
  assert.ok(csv.includes('PENDING'));
});

import { ARWEL_12_WEEK_PLAN, HELEN_12_WEEK_PLAN, get12WeekPlanForAthlete } from '../data/rehabData';

test('ARWEL_12_WEEK_PLAN contains only Arwel-targeted drills and zero Helen-specific contraindications', () => {
  const arwelPlan = get12WeekPlanForAthlete('arwel');
  assert.equal(arwelPlan.length, 12);

  // Collect all unique exercise IDs in Arwel's schedule
  const arwelExerciseIds = new Set<string>();
  arwelPlan.forEach((week) => {
    week.days.forEach((day) => {
      day.exercises.forEach((item) => arwelExerciseIds.add(item.exerciseId));
    });
  });

  // Verify Arwel's core symptoms drills are present
  assert.ok(arwelExerciseIds.has('copenhagen-plank-bent-knee'), 'Should contain Copenhagen plank for adductor strain');
  assert.ok(arwelExerciseIds.has('psoas-adductor-march'), 'Should contain psoas march for swing-phase toe pickup');
  assert.ok(arwelExerciseIds.has('adductor-ball-squeeze'), 'Should contain adductor ball squeeze');
  assert.ok(arwelExerciseIds.has('tibialis-wall-raise'), 'Should contain tibialis wall raise for toe scuffing');
  assert.ok(arwelExerciseIds.has('banded-tke'), 'Should contain banded TKE for right knee OA');
  assert.ok(arwelExerciseIds.has('spanish-squat-isometric'), 'Should contain Spanish squat for cartilage protection');
  assert.ok(arwelExerciseIds.has('mcgill-curlup'), 'Should contain McGill curl-up for lumbar facet overload');

  // Verify zero Helen-specific exercises in Arwel's plan
  assert.equal(arwelExerciseIds.has('rathleff-plantar-raise'), false, 'Arwel must not have Rathleff plantar raise');
  assert.equal(arwelExerciseIds.has('neutral-clamshell-cushioned'), false, 'Arwel must not have Helen-specific neutral clamshell');
  assert.equal(arwelExerciseIds.has('forearm-band-pull-apart'), false, 'Arwel must not have forearm loop pull-apart');
  assert.equal(arwelExerciseIds.has('wrist-finger-tendon-glides'), false, 'Arwel must not have hand tendon glides');
});

test('HELEN_12_WEEK_PLAN contains only Helen-targeted drills and zero Arwel-specific drills', () => {
  const helenPlan = get12WeekPlanForAthlete('helen');
  assert.equal(helenPlan.length, 12);

  // Collect all unique exercise IDs in Helen's schedule
  const helenExerciseIds = new Set<string>();
  helenPlan.forEach((week) => {
    week.days.forEach((day) => {
      day.exercises.forEach((item) => helenExerciseIds.add(item.exerciseId));
    });
  });

  // Verify Helen's core symptoms drills are present
  assert.ok(helenExerciseIds.has('rathleff-plantar-raise'), 'Should contain Rathleff protocol for plantar fasciitis');
  assert.ok(helenExerciseIds.has('short-foot-intrinsic-doming'), 'Should contain short-foot doming for arch support');
  assert.ok(helenExerciseIds.has('isometric-hip-abduction-wall'), 'Should contain wall abduction for GTPS analgesia');
  assert.ok(helenExerciseIds.has('neutral-clamshell-cushioned'), 'Should contain cushioned clamshell (zero adduction)');
  assert.ok(helenExerciseIds.has('forearm-band-pull-apart'), 'Should contain grip-free forearm band pull-apart');
  assert.ok(helenExerciseIds.has('wrist-finger-tendon-glides'), 'Should contain finger & wrist tendon glides');
  assert.ok(helenExerciseIds.has('banded-monster-walk'), 'Should contain banded monster walk at shins');

  // Verify zero Arwel-specific exercises in Helen's plan
  assert.equal(helenExerciseIds.has('copenhagen-plank-bent-knee'), false, 'Helen must not have Copenhagen plank');
  assert.equal(helenExerciseIds.has('spanish-squat-isometric'), false, 'Helen must not have Spanish squat');
  assert.equal(helenExerciseIds.has('psoas-adductor-march'), false, 'Helen must not have psoas march');
  assert.equal(helenExerciseIds.has('adductor-ball-squeeze'), false, 'Helen must not have adductor ball squeeze');
});

