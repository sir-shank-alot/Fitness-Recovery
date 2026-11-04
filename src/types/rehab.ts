export type AthleteId = 'arwel' | 'helen';

export interface AthleteInjury {
  id: string;
  title: string;
  category: string;
  anatomicalSite: string;
  clinicalExplanation: string;
  contraindications: string[];
  rehabFocus: string[];
  recommendedDrills: string[];
}

export interface AthleteProfile {
  id: AthleteId;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  weightKg: number;
  raceCompleted: string;
  avatarColor: string;
  injuries: AthleteInjury[];
  keyContraindicationNotice: string;
  targetGaitCue: string;
}

export type ExerciseCategory =
  | 'Spine & Core'
  | 'Adductor & Pelvis'
  | 'Hip & Glute (GTPS)'
  | 'Foot & Calf'
  | 'Knee & Quad'
  | 'Mobility & Decompression';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetAthletes: AthleteId[];
  targetConditions: string[];
  equipment: string;
  defaultSets: number;
  defaultReps: string;
  frequency: string;
  videoUrl: string;
  videoEmbedId: string;
  videoChannel: string;
  rationale: string;
  techniqueCues: string[];
  commonMistakes: string[];
  jointFriendlyModification: string;
  safetyNotes: string;
}

export interface ScheduledExerciseItem {
  exerciseId: string;
  customSets?: number;
  customReps?: string;
  customHoldSeconds?: number;
  targetSide?: 'both' | 'right' | 'left';
  specificNotes?: string;
}

export interface WorkoutDay {
  dayNumber: number; // 1 to 7
  dayName: string;
  title: string;
  focus: string;
  estimatedMinutes: number;
  isRestDay: boolean;
  exercises: ScheduledExerciseItem[];
}

export interface PlanWeek {
  weekNumber: number;
  phase: 1 | 2 | 3;
  phaseName: string;
  weeklyObjective: string;
  targetWalkingRunningTolerance: string;
  athleteSpecificFocus: {
    arwel: string;
    helen: string;
  };
  days: WorkoutDay[];
}

export interface DailyLog {
  id: string;
  date: string;
  athleteId: AthleteId;
  painScore: number; // 0 to 10
  painAreas: Record<string, number>; // e.g. { "Lower Back": 4, "Right Adductor": 3 }
  mobilityScore: number; // 0 to 100
  completedExerciseIds: string[];
  perceivedExertion: number; // 1 to 10 RPE
  sleepHours: number;
  hrvMs: number;
  steps: number;
  notes: string;
  gaitChecklist: {
    toeClearanceScore?: number; // 1 to 5 (Arwel)
    firstStepPainVAS?: number; // 0 to 10 (Helen)
    lateralHipStability?: number; // 1 to 5
  };
}

export interface FitnessSyncService {
  id: 'apple_health' | 'garmin' | 'strava' | 'fitbit';
  name: string;
  icon: string;
  connected: boolean;
  lastSyncedAt: string | null;
  metrics: {
    dailySteps: number;
    restingHeartRate: number;
    hrvMs: number;
    sleepScore: number;
    cadenceAvgSpM: number;
    groundContactBalance: string; // e.g. "48.9% L / 51.1% R"
    strideLengthMeters: number;
  };
}

export interface AssessmentResult {
  date: string;
  athleteId: AthleteId;
  extensionIntoleranceVAS: number;
  mcgillBig3ScoreSeconds: {
    curlUp: number;
    sideBridgeL: number;
    sideBridgeR: number;
    birdDog: number;
  };
  adductorSqueezeTolerance: 'None' | 'Mild' | 'Moderate' | 'Sharp';
  trendelenburgSign: 'Negative (Stable)' | 'Mild Drop' | 'Pronounced Drop';
  windlassTestPain: boolean;
  jointSwellingIndex: 'Normal' | 'Mild Stiffness' | 'Active Flare';
  calculatedReadinessTier: 'Foundational Re-education' | 'Controlled Loading' | 'Dynamic Re-integration';
  actionableInsights: string[];
}
