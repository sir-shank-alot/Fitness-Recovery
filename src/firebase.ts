import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { DailyLog, AthleteId } from './types/rehab';

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Validate connection to Firestore on app startup
 */
export async function testConnection(): Promise<boolean> {
  const pathForTest = '_connection_test/ping';
  try {
    await getDocFromServer(doc(db, '_connection_test', 'ping'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode. Local caching enabled.');
      return false;
    }
    // Permission denied or non-existent doc for _connection_test is expected and confirms server connectivity
    return true;
  }
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Initialize or update user profile document
    if (result.user) {
      const userRef = doc(db, 'users', result.user.uid);
      await setDoc(
        userRef,
        {
          userId: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Marathon Runner',
          currentAthleteId: 'arwel',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return result.user;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    return null;
  }
}

/**
 * Sign out user
 */
export async function logOut(): Promise<void> {
  await signOut(auth);
}

/**
 * Save daily checkin log to Firestore under the authenticated user's subcollection
 */
export async function saveDailyLogToFirestore(
  userId: string,
  log: DailyLog
): Promise<void> {
  const pathForWrite = `users/${userId}/dailyLogs/${log.id}`;
  try {
    const logDocRef = doc(db, 'users', userId, 'dailyLogs', log.id);
    await setDoc(logDocRef, {
      ...log,
      userId,
      syncedToCloud: true,
      updatedAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForWrite);
  }
}

/**
 * Fetch daily recovery logs for a specific athlete
 */
export async function fetchDailyLogsFromFirestore(
  userId: string,
  athleteId?: AthleteId
): Promise<DailyLog[]> {
  const pathForQuery = `users/${userId}/dailyLogs`;
  try {
    const logsRef = collection(db, 'users', userId, 'dailyLogs');
    const q = athleteId
      ? query(logsRef, where('athleteId', '==', athleteId), orderBy('date', 'desc'))
      : query(logsRef, orderBy('date', 'desc'));

    const snapshot = await getDocs(q);
    const logs: DailyLog[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logs.push({
        id: data.id || docSnap.id,
        date: data.date,
        athleteId: data.athleteId,
        painScore: data.painScore,
        painAreas: data.painAreas || {},
        mobilityScore: data.mobilityScore,
        completedExerciseIds: data.completedExerciseIds || [],
        perceivedExertion: data.perceivedExertion,
        sleepHours: data.sleepHours,
        hrvMs: data.hrvMs,
        steps: data.steps,
        notes: data.notes || '',
        gaitChecklist: data.gaitChecklist || {},
      });
    });
    return logs;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForQuery);
  }
}

export interface WorkoutCompletionRecord {
  id: string;
  userId: string;
  athleteId: AthleteId;
  weekNumber: number;
  dayNumber?: number;
  dayName?: string;
  workoutTitle: string;
  completedExerciseIds: string[];
  completedAt: string;
}

/**
 * Record a completed rehab workout
 */
export async function saveWorkoutCompletionToFirestore(
  userId: string,
  record: WorkoutCompletionRecord
): Promise<void> {
  const pathForWrite = `users/${userId}/workoutCompletions/${record.id}`;
  try {
    const compRef = doc(db, 'users', userId, 'workoutCompletions', record.id);
    await setDoc(compRef, {
      ...record,
      userId,
      serverCreatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForWrite);
  }
}

/**
 * Remove a workout completion record when unchecked
 */
export async function deleteWorkoutCompletionFromFirestore(
  userId: string,
  completionId: string
): Promise<void> {
  const pathForDelete = `users/${userId}/workoutCompletions/${completionId}`;
  try {
    const compRef = doc(db, 'users', userId, 'workoutCompletions', completionId);
    await deleteDoc(compRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, pathForDelete);
  }
}

/**
 * Fetch all workout completions for an athlete
 */
export async function fetchWorkoutCompletionsFromFirestore(
  userId: string,
  athleteId?: AthleteId
): Promise<WorkoutCompletionRecord[]> {
  const pathForQuery = `users/${userId}/workoutCompletions`;
  try {
    const compsRef = collection(db, 'users', userId, 'workoutCompletions');
    const q = athleteId
      ? query(compsRef, where('athleteId', '==', athleteId))
      : query(compsRef);

    const snapshot = await getDocs(q);
    const records: WorkoutCompletionRecord[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      records.push({
        id: docSnap.id,
        userId: d.userId,
        athleteId: d.athleteId,
        weekNumber: d.weekNumber,
        dayNumber: d.dayNumber,
        dayName: d.dayName,
        workoutTitle: d.workoutTitle,
        completedExerciseIds: d.completedExerciseIds || [],
        completedAt: d.completedAt || new Date().toISOString(),
      });
    });
    return records;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForQuery);
  }
}
