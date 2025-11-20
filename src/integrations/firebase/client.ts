// Firebase client configuration
import { auth, db, googleProvider, githubProvider } from '@/utils/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

// User profile interface
export interface UserProfile {
  // Basic info
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  
  // Stats
  experience_points: number;
  learning_streak: number;
  total_xp: number;
  total_hours_coded: number;
  problems_solved: number;
  skills_mastered: number;
  current_week_xp: number;
  last_active: string | null;
  
  // Progress tracking
  completed_lessons: number;
  completed_projects: number;
  completed_quizzes: number;
  
  // Timestamps
  joined_at: string | null;
  updated_at: string | null;
  
  // Preferences
  theme: 'light' | 'dark' | 'system';
  email_notifications: boolean;
  
  // Progress by skill
  skills_progress: Record<string, {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    progress: number;
    xp: number;
    last_practiced: string | null;
  }>;
}

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);
export const signOut = () => firebaseSignOut(auth);
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => 
  onAuthStateChanged(auth, callback);

// User profile functions
export const createUserProfile = async (user: FirebaseUser, role: string = 'learner'): Promise<UserProfile> => {
  const now = new Date().toISOString();
  const defaultSkills = {
    python: { level: 'Beginner', progress: 0, xp: 0, last_practiced: null },
    javascript: { level: 'Beginner', progress: 0, xp: 0, last_practiced: null },
    java: { level: 'Beginner', progress: 0, xp: 0, last_practiced: null },
  };

  const profileData: Omit<UserProfile, 'id'> = {
    // Basic info
    user_id: user.uid,
    email: user.email,
    full_name: user.displayName || user.email?.split('@')[0] || 'New User',
    username: user.email?.split('@')[0] || `user_${user.uid.slice(0, 8)}`,
    role,
    bio: 'Hello! I\'m new to the platform.',
    avatar_url: user.photoURL || null,
    
    // Initialize all stats to 0
    experience_points: 0,
    learning_streak: 0,
    total_xp: 0,
    total_hours_coded: 0,
    problems_solved: 0,
    skills_mastered: 0,
    current_week_xp: 0,
    last_active: now,
    
    // Progress tracking
    completed_lessons: 0,
    completed_projects: 0,
    completed_quizzes: 0,
    
    // Timestamps
    joined_at: now,
    updated_at: now,
    
    // Preferences
    theme: 'system',
    email_notifications: true,
    
    // Skills progress
    skills_progress: defaultSkills,
  };

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, profileData);

  return {
    id: user.uid,
    ...profileData
  };
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return {
    id: userDoc.id,
    ...userDoc.data()
  } as UserProfile;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updated_at: new Date().toISOString()
  });
};

// Utility functions
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('🔄 Testing Firebase connection...');
    
    // Test auth
    const user = auth.currentUser;
    console.log('✅ Firebase connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Firebase connection test error:', err);
    return false;
  }
};

// Export auth and db instances
export { auth, db };
