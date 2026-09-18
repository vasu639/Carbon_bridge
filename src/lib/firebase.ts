import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import type { MSMECompany } from '../types';
import { cacheCompanyLocally } from '../data/companyRegistryService';

// The user's web app Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyBH5Q5diaiSzOs65x5o-ZKRY8Q2oQcf328',
  authDomain: 'carbonbridge-dcb48.firebaseapp.com',
  projectId: 'carbonbridge-dcb48',
  storageBucket: 'carbonbridge-dcb48.firebasestorage.app',
  messagingSenderId: '432743562279',
  appId: '1:432743562279:web:7c219cd152cfbecb1aa202',
  measurementId: 'G-FLN70M6QKP',
};

// Initialize Firebase App instance safely (singleton)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firebase Analytics if supported in the browser
let analyticsInstance: unknown = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) => {
      isSupported()
        .then((supported) => {
          if (supported) {
            analyticsInstance = getAnalytics(app);
          }
        })
        .catch(() => {
          // Analytics not supported in this environment
        });
    })
    .catch(() => {
      // Analytics module load skip
    });
}
export { analyticsInstance as analytics };

// Firestore error handling according to Zero-Trust specifications
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
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Maps raw Firebase Auth error codes to user-friendly messages
 */
export function getFriendlyAuthErrorMessage(errorCode: string): string {
  if (!errorCode) return 'An unexpected authentication error occurred.';
  if (errorCode.includes('auth/invalid-email')) {
    return 'Invalid email format. Please check the corporate email address.';
  }
  if (errorCode.includes('auth/user-not-found') || errorCode.includes('auth/wrong-password') || errorCode.includes('auth/invalid-credential')) {
    return 'Invalid login credentials. Please check your email and password, or create an enterprise account.';
  }
  if (errorCode.includes('auth/email-already-in-use')) {
    return 'This email address is already registered. Please log in instead or use Password Reset.';
  }
  if (errorCode.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters with mixed letters and numbers.';
  }
  if (errorCode.includes('auth/popup-closed-by-user')) {
    return 'Google Sign-In popup was closed before completing authentication.';
  }
  if (errorCode.includes('auth/popup-blocked')) {
    return 'Popup blocked by your browser. Please allow popups for Google Sign-In.';
  }
  if (errorCode.includes('auth/network-request-failed')) {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (errorCode.includes('auth/too-many-requests')) {
    return 'Too many unsuccessful attempts. Access temporarily restricted. Try again later or reset password.';
  }
  return errorCode;
}

/**
 * Fetch company profile from Firestore by user UID
 */
export async function getCompanyProfileFromFirestore(uid: string): Promise<MSMECompany | null> {
  const docPath = `companies/${uid}`;
  try {
    const docRef = doc(db, 'companies', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as MSMECompany;
    }
    return null;
  } catch (error) {
    console.warn(`Firestore read warning for ${docPath}:`, error);
    return null;
  }
}

/**
 * Save or update MSME company profile into Firestore
 */
export async function saveCompanyProfileToFirestore(
  uid: string,
  company: MSMECompany
): Promise<void> {
  const docPath = `companies/${uid}`;
  try {
    const docRef = doc(db, 'companies', uid);
    await setDoc(
      docRef,
      {
        ...company,
        id: uid,
        authUid: uid,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Register a new company account with Firebase Auth and store profile in Firestore
 */
export async function registerCompanyWithFirebase(
  companyData: Omit<MSMECompany, 'id'>,
  password: string
): Promise<MSMECompany> {
  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    companyData.email.trim(),
    password
  );
  const user = userCredential.user;

  // 2. Set Firebase Auth display name
  try {
    await updateProfile(user, {
      displayName: companyData.companyName,
    });
  } catch (e) {
    console.warn('Could not update Auth displayName:', e);
  }

  // 3. Construct MSME Company object
  const newCompany: MSMECompany = {
    ...companyData,
    id: user.uid,
    verifiedStatus: true,
  };

  // 4. Save into Firestore and local registry
  try {
    await saveCompanyProfileToFirestore(user.uid, newCompany);
  } catch (firestoreErr) {
    console.warn('Firestore profile save warning (fallback to client state):', firestoreErr);
  }
  cacheCompanyLocally(newCompany);

  return newCompany;
}

/**
 * Sign in company user with Email/Password or URN lookup
 */
export async function loginCompanyWithFirebase(
  emailOrUdyam: string,
  password: string
): Promise<MSMECompany> {
  let targetEmail = emailOrUdyam.trim();

  // If input is an URN (e.g. UDYAM-MH-12-0045892), attempt lookup in Firestore
  if (targetEmail.toUpperCase().startsWith('UDYAM-')) {
    try {
      const q = query(
        collection(db, 'companies'),
        where('udyamNumber', '==', targetEmail.toUpperCase())
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const found = snapshot.docs[0].data() as MSMECompany;
        if (found.email) {
          targetEmail = found.email;
        }
      }
    } catch {
      // Continue to try direct email sign in
    }
  }

  // Sign in with Firebase Auth
  const userCredential = await signInWithEmailAndPassword(auth, targetEmail, password);
  const user = userCredential.user;

  // Retrieve company profile from Firestore
  let profile = await getCompanyProfileFromFirestore(user.uid);

  if (!profile) {
    // Generate base profile from auth user details if no Firestore document yet
    const derivedName =
      user.displayName ||
      (user.email
        ? user.email.split('@')[0].replace(/[._]/g, ' ').toUpperCase() + ' ENTERPRISES'
        : 'REGISTERED MSME EXPORTER');

    profile = {
      id: user.uid,
      companyName: derivedName,
      udyamNumber: 'UDYAM-MH-12-0045892',
      gstin: '27AABCU9603R1ZM',
      enterpriseCategory: 'Small',
      sector: 'Steel',
      state: 'Maharashtra',
      city: 'Industrial Corridor',
      authorizedPerson: user.displayName || user.email?.split('@')[0] || 'Authorized Representative',
      designation: 'Managing Director',
      email: user.email || targetEmail,
      phone: '+91 98220 00000',
      verifiedStatus: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Optionally save to Firestore
    try {
      await saveCompanyProfileToFirestore(user.uid, profile);
    } catch {
      // Ignore initial bootstrap error
    }
  }

  cacheCompanyLocally(profile);
  return profile;
}

/**
 * Sign in company user with Google Provider via Firebase Auth
 */
export async function loginWithGoogleFirebase(
  defaults?: Partial<MSMECompany>
): Promise<MSMECompany> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Retrieve existing company profile from Firestore
  let profile = await getCompanyProfileFromFirestore(user.uid);

  if (!profile) {
    const derivedName =
      defaults?.companyName ||
      (user.displayName ? `${user.displayName.toUpperCase()} INDUSTRIES` : 'GLOBAL MSME EXPORTER');

    profile = {
      id: user.uid,
      companyName: derivedName,
      udyamNumber: defaults?.udyamNumber || 'UDYAM-MH-12-0045892',
      gstin: defaults?.gstin || '27AABCU9603R1ZM',
      enterpriseCategory: defaults?.enterpriseCategory || 'Small',
      sector: defaults?.sector || 'Steel',
      state: defaults?.state || 'Maharashtra',
      city: defaults?.city || 'Pune / Chakan Industrial Area',
      authorizedPerson: user.displayName || defaults?.authorizedPerson || 'Authorized Representative',
      designation: defaults?.designation || 'Director / Owner',
      email: user.email || 'export@msme.in',
      phone: defaults?.phone || '+91 98220 12345',
      verifiedStatus: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await saveCompanyProfileToFirestore(user.uid, profile);
    } catch (e) {
      console.warn('Could not save Google profile to Firestore:', e);
    }
  }

  cacheCompanyLocally(profile);
  return profile;
}

/**
 * Sign out of Firebase Auth
 */
export async function logoutCompanyFirebase(): Promise<void> {
  await signOut(auth);
}

/**
 * Trigger Firebase Password Reset Email
 */
export async function sendPasswordResetFirebase(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Subscribe to live Firebase Auth state changes
 */
export function subscribeToFirebaseAuthState(
  callback: (user: User | null, profile: MSMECompany | null) => void
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getCompanyProfileFromFirestore(user.uid);
      callback(user, profile);
    } else {
      callback(null, null);
    }
  });
}
