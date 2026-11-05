import React, { useState, useEffect } from 'react';
import { AthleteId, Exercise, WorkoutDay, DailyLog, FitnessSyncService, AssessmentResult } from './types/rehab';
import {
  ATHLETE_PROFILES,
  EXERCISE_LIBRARY,
  FULL_12_WEEK_PLAN,
  INITIAL_DAILY_LOGS,
  INITIAL_SYNC_SERVICES,
} from './data/rehabData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ScheduleView } from './components/ScheduleView';
import { SpreadsheetView } from './components/SpreadsheetView';
import { HealthSyncView } from './components/HealthSyncView';
import { AssessmentView } from './components/AssessmentView';
import { EducationView } from './components/EducationView';
import { VideoModal } from './components/VideoModal';
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { DailyCheckinModal } from './components/DailyCheckinModal';
import {
  testConnection,
  saveDailyLogToFirestore,
  fetchDailyLogsFromFirestore,
  saveWorkoutCompletionToFirestore,
  signInWithGoogle,
  logOut,
  auth,
} from './firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentAthleteId, setCurrentAthleteId] = useState<AthleteId>('arwel');
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'schedule' | 'spreadsheet' | 'sync' | 'assessment' | 'education'
  >('dashboard');
  const [currentWeek, setCurrentWeek] = useState<number>(1);

  // Video Preview Modal
  const [videoModalExercise, setVideoModalExercise] = useState<Exercise | null>(null);

  // Active Workout Companion
  const [activeWorkoutModal, setActiveWorkoutModal] = useState<{
    workout: WorkoutDay;
    weekNumber: number;
  } | null>(null);

  // Daily Checkin Modal
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  // Firebase Auth and Cloud Sync state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Persisted state: Daily logs
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    try {
      const saved = localStorage.getItem('spine_stride_logs');
      return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
    } catch {
      return INITIAL_DAILY_LOGS;
    }
  });

  // Persisted state: Sync Services
  const [syncServices, setSyncServices] = useState<FitnessSyncService[]>(() => {
    try {
      const saved = localStorage.getItem('spine_stride_sync');
      return saved ? JSON.parse(saved) : INITIAL_SYNC_SERVICES;
    } catch {
      return INITIAL_SYNC_SERVICES;
    }
  });

  // Initialize Firebase connection and listen to auth state
  useEffect(() => {
    let isMounted = true;

    // Test Firestore connection on boot
    testConnection().then((ok) => {
      if (ok && isMounted) {
        setIsCloudSynced(true);
      }
    });

    // Listen to Google Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      setCurrentUser(user);
      if (user) {
        setIsCloudSynced(true);
        try {
          const remoteLogs = await fetchDailyLogsFromFirestore(user.uid, currentAthleteId);
          if (remoteLogs && remoteLogs.length > 0 && isMounted) {
            setLogs((prev) => {
              const existingIds = new Set(prev.map((l) => l.id));
              const newUnique = remoteLogs.filter((l) => !existingIds.has(l.id));
              return [...prev, ...newUnique];
            });
          }
        } catch (err) {
          console.warn('Notice loading Firestore logs:', err);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentAthleteId]);

  const handleSignInGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spine_stride_logs', JSON.stringify(logs));
    } catch {
      // ignore
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('spine_stride_sync', JSON.stringify(syncServices));
    } catch {
      // ignore
    }
  }, [syncServices]);

  const currentAthlete = ATHLETE_PROFILES[currentAthleteId];

  // Handler for workout completion
  const handleFinishWorkout = (completedExerciseIds: string[]) => {
    if (!activeWorkoutModal) return;
    const newLog: DailyLog = {
      id: `workout-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      athleteId: currentAthleteId,
      painScore: 2,
      painAreas: currentAthleteId === 'arwel' ? { 'Lower Back (Facet)': 2, 'Right Adductor': 2 } : { 'Right Plantar Fascia': 2, 'Greater Trochanter': 2 },
      mobilityScore: 82,
      completedExerciseIds,
      perceivedExertion: 4,
      sleepHours: 7.8,
      hrvMs: 64,
      steps: 8400,
      notes: `Completed Week ${activeWorkoutModal.weekNumber} session: ${activeWorkoutModal.workout.title}`,
      gaitChecklist: {
        toeClearanceScore: currentAthleteId === 'arwel' ? 4 : undefined,
        firstStepPainVAS: currentAthleteId === 'helen' ? 2 : undefined,
        lateralHipStability: 4,
      },
    };

    setLogs((prev) => [...prev, newLog]);

    // Persist to Firebase Firestore
    if (currentUser) {
      saveDailyLogToFirestore(currentUser.uid, newLog).catch((err) =>
        console.warn('Could not save workout log to Firestore:', err)
      );
      saveWorkoutCompletionToFirestore(currentUser.uid, {
        id: `completion-${Date.now()}`,
        userId: currentUser.uid,
        athleteId: currentAthleteId,
        weekNumber: activeWorkoutModal.weekNumber,
        workoutTitle: activeWorkoutModal.workout.title,
        completedExerciseIds,
        completedAt: new Date().toISOString(),
      }).catch((err) => console.warn('Could not save completion record to Firestore:', err));
    }
  };

  // Handler for saving daily checkin
  const handleSaveCheckinLog = (newLog: DailyLog) => {
    setLogs((prev) => [...prev, newLog]);

    // Persist to Firebase Firestore
    if (currentUser) {
      saveDailyLogToFirestore(currentUser.uid, newLog).catch((err) =>
        console.warn('Could not save daily check-in to Firestore:', err)
      );
    }
  };

  // Handler for wearable sync
  const handleToggleConnection = (serviceId: string) => {
    setSyncServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          const next = !s.connected;
          return {
            ...s,
            connected: next,
            lastSyncedAt: next ? 'Just now' : null,
          };
        }
        return s;
      })
    );
  };

  const handleSyncServiceNow = (serviceId: string) => {
    setSyncServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            lastSyncedAt: 'Just now',
            metrics: {
              ...s.metrics,
              dailySteps: s.metrics.dailySteps + Math.floor(Math.random() * 400 + 100),
              hrvMs: 60 + Math.floor(Math.random() * 8),
              cadenceAvgSpM: 174 + Math.floor(Math.random() * 4),
              groundContactBalance: '50.1% L / 49.9% R',
            },
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentAthleteId={currentAthleteId}
        athletes={ATHLETE_PROFILES}
        onSelectAthlete={(id) => setCurrentAthleteId(id)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isCloudSynced={isCloudSynced}
        currentUser={currentUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            athlete={currentAthlete}
            currentWeek={currentWeek}
            weeks={FULL_12_WEEK_PLAN}
            exercises={EXERCISE_LIBRARY}
            logs={logs}
            syncServices={syncServices}
            onStartWorkout={(workout) =>
              setActiveWorkoutModal({ workout, weekNumber: currentWeek })
            }
            onOpenCheckin={() => setIsCheckinOpen(true)}
            onNavigateToSchedule={() => setActiveTab('schedule')}
            onNavigateToSpreadsheet={() => setActiveTab('spreadsheet')}
            onNavigateToSync={() => setActiveTab('sync')}
            onOpenVideo={(exercise) => setVideoModalExercise(exercise)}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            weeks={FULL_12_WEEK_PLAN}
            exercises={EXERCISE_LIBRARY}
            currentAthleteId={currentAthleteId}
            athleteName={currentAthlete.name}
            onStartWorkout={(workout, weekNum) =>
              setActiveWorkoutModal({ workout, weekNumber: weekNum })
            }
            onOpenVideo={(exercise) => setVideoModalExercise(exercise)}
          />
        )}

        {activeTab === 'spreadsheet' && (
          <SpreadsheetView
            weeks={FULL_12_WEEK_PLAN}
            exercises={EXERCISE_LIBRARY}
            currentAthleteId={currentAthleteId}
            onOpenVideo={(exercise) => setVideoModalExercise(exercise)}
          />
        )}

        {activeTab === 'sync' && (
          <HealthSyncView
            athlete={currentAthlete}
            syncServices={syncServices}
            onToggleConnection={handleToggleConnection}
            onSyncServiceNow={handleSyncServiceNow}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentView
            athlete={currentAthlete}
            onSaveAssessment={(result) => {
              // Assessment feedback saved
            }}
          />
        )}

        {activeTab === 'education' && <EducationView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Spine &amp; Stride • Evidence-Based 12-Week Post-Marathon Rehabilitation &amp; Mobility
            System
          </p>
          <p className="text-slate-400">
            Tailored for <span className="text-cyan-400 font-semibold">Arwel Thomas</span> &amp;{' '}
            <span className="text-emerald-400 font-semibold">Helen Shanley</span> • Auckland
            Marathon Recovery
          </p>
        </div>
      </footer>

      {/* Video Demonstration Modal */}
      {videoModalExercise && (
        <VideoModal
          exercise={videoModalExercise}
          onClose={() => setVideoModalExercise(null)}
        />
      )}

      {/* Interactive Workout Companion Modal */}
      {activeWorkoutModal && (
        <WorkoutPlayerModal
          workout={activeWorkoutModal.workout}
          weekNumber={activeWorkoutModal.weekNumber}
          athleteId={currentAthleteId}
          athleteName={currentAthlete.name}
          exercises={EXERCISE_LIBRARY}
          onClose={() => setActiveWorkoutModal(null)}
          onFinishWorkout={handleFinishWorkout}
          onOpenVideo={(exercise) => setVideoModalExercise(exercise)}
        />
      )}

      {/* Daily Recovery Checkin Modal */}
      {isCheckinOpen && (
        <DailyCheckinModal
          athlete={currentAthlete}
          onClose={() => setIsCheckinOpen(false)}
          onSaveLog={handleSaveCheckinLog}
        />
      )}
    </div>
  );
}
