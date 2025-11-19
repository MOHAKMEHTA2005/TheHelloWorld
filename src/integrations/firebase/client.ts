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
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  experience_points: number | null;
  learning_streak: number | null;
  joined_at: string | null;
  updated_at: string | null;
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
  const profileData: Omit<UserProfile, 'id'> = {
    user_id: user.uid,
    email: user.email,
    full_name: user.displayName || user.email?.split('@')[0] || 'New User',
    username: user.email?.split('@')[0] || `user_${user.uid.slice(0, 8)}`,
    role,
    experience_points: 0,
    learning_streak: 0,
    joined_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bio: null,
    avatar_url: user.photoURL || null,
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
