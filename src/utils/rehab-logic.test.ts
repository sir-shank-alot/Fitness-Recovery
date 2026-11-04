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
