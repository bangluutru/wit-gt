import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { UserProfile } from '../lib/types';
import { isAdminEmail } from '../lib/admin';
import { authErrorCode } from '../lib/authErrors';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Trong lúc signUp/signInWithGoogle tự tạo profile, cờ này chặn listener
  // onAuthStateChanged tạo trùng một profile với tên hiển thị mặc định.
  const creatingProfile = useRef(false);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const profile = { id: snap.id, ...snap.data() } as UserProfile;

    // Bootstrap: emails on the admin allowlist are auto-upgraded to admin.
    if (profile.role !== 'admin' && isAdminEmail(profile.email)) {
      try {
        await updateDoc(doc(db, 'users', uid), { role: 'admin', updatedAt: serverTimestamp() });
        profile.role = 'admin';
      } catch (err) {
        console.error('Failed to auto-grant admin role:', err);
      }
    }
    return profile;
  };

  const createProfile = async (uid: string, email: string, displayName: string) => {
    const newProfile: Omit<UserProfile, 'id'> = {
      displayName,
      email,
      interfaceLang: 'vi',
      preferredSourceLang: 'vi',
      preferredTargetLang: 'en',
      readerFontSize: 'medium',
      theme: 'light',
      displayMode: 'single',
      role: isAdminEmail(email) ? 'admin' : 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await setDoc(doc(db, 'users', uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: uid, ...newProfile };
  };

  /**
   * Lấy profile Firestore của user, tự tạo nếu chưa có.
   * Cần cho đăng nhập Google (lần đầu chưa có document `users/{uid}`) và cũng
   * tự vá cho tài khoản cũ bị thiếu profile.
   */
  const ensureProfile = async (firebaseUser: User): Promise<UserProfile> => {
    const existing = await fetchProfile(firebaseUser.uid);
    if (existing) return existing;

    const email = firebaseUser.email ?? '';
    const displayName =
      firebaseUser.displayName?.trim() || email.split('@')[0] || 'Học viên WiT';
    return createProfile(firebaseUser.uid, email, displayName);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Khi signUp/signInWithGoogle đang tự tạo profile thì để hàm đó lo,
          // tránh ghi đè tên hiển thị người dùng vừa nhập.
          const p = creatingProfile.current
            ? await fetchProfile(firebaseUser.uid)
            : await ensureProfile(firebaseUser);
          setProfile(p);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await fetchProfile(cred.user.uid);
    setProfile(p);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    creatingProfile.current = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName });
      const p = await createProfile(cred.user.uid, email, displayName);
      setProfile(p);
    } finally {
      creatingProfile.current = false;
    }
  };

  const signInWithGoogle = async () => {
    creatingProfile.current = true;
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const p = await ensureProfile(cred.user);
      setProfile(p);
    } catch (err) {
      const code = authErrorCode(err);
      // Một số trình duyệt (nhất là webview trên mobile) chặn popup —
      // chuyển sang luồng redirect; profile sẽ được tạo bởi onAuthStateChanged.
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        creatingProfile.current = false;
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      throw err;
    } finally {
      creatingProfile.current = false;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOutUser = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.uid);
      setProfile(p);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut: signOutUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
