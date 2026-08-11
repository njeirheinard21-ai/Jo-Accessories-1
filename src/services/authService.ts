import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { useAuthStore } from '../stores/authStore';
import { UserDocument } from '../types/auth';
import { auditService } from './auditService';

export const authService = {
  init: () => {
    return onAuthStateChanged(auth, async (user) => {
      const { setUser, setUserDoc, setLoading } = useAuthStore.getState();
      
      if (user) {
        setUser(user);
        
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            let data = userDocSnap.data() as UserDocument;
            
            // Auto-upgrade store owner if not super admin
            const isStoreOwner = user.email === 'njeirheinard@gmail.com' || user.email === 'njeirheinard21@gmail.com';
            if (isStoreOwner && data.role !== 'super_admin') {
              data.role = 'super_admin';
              data.isStoreOwner = true;
              await updateDoc(userDocRef, { role: 'super_admin', isStoreOwner: true, lastLogin: serverTimestamp() });
            } else {
              await updateDoc(userDocRef, { lastLogin: serverTimestamp() });
            }
            
            setUserDoc(data);
          } else {
            // First time login with Google or something else missing a doc
            const isStoreOwner = user.email === 'njeirheinard@gmail.com' || user.email === 'njeirheinard21@gmail.com';
            const role = isStoreOwner ? 'super_admin' : 'customer';
            
            const newDocData: any = {
              uid: user.uid,
              fullName: user.displayName || 'Unknown',
              email: user.email || '',
              role,
              isStoreOwner,
              isActive: true,
              emailVerified: user.emailVerified,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            };
            
            await setDoc(userDocRef, newDocData);
            setUserDoc(newDocData);
            
            if (isStoreOwner) {
              await auditService.log('auth', 'create_super_admin', 'System initialized first super admin', user.uid);
            }
          }
        } catch (error) {
          console.warn("Could not fetch or create user document (likely missing permissions):", error);
          setUserDoc(null);
        }
      } else {
        setUser(null);
        setUserDoc(null);
      }
      setLoading(false);
    });
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await auditService.log('auth', 'login', `User ${email} logged in`, result.user.uid);
      return result.user;
    } catch (error) {
      console.error("Sign in error", error);
      throw error;
    }
  },

  registerWithEmail: async (email: string, password: string, name: string, phone: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const isStoreOwner = email === 'njeirheinard@gmail.com' || email === 'njeirheinard21@gmail.com';
      const role = isStoreOwner ? 'super_admin' : 'customer';
      
      const newDocData: any = {
        uid: result.user.uid,
        fullName: name,
        email,
        phone,
        role,
        isStoreOwner,
        isActive: true,
        emailVerified: result.user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      };

      try {
        await setDoc(doc(db, 'users', result.user.uid), newDocData);
        if (isStoreOwner) {
          await auditService.log('auth', 'create_super_admin', 'System initialized first super admin during registration', result.user.uid);
        }
      } catch (dbError) {
        console.warn("Could not create user document in Firestore (likely missing permissions):", dbError);
      }
      
      return result.user;
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  },

  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Google sign in error", error);
      throw error;
    }
  },

  logout: async () => {
    const user = auth.currentUser;
    if (user) {
      await auditService.log('auth', 'logout', `User ${user.email} logged out`, user.uid);
    }
    await signOut(auth);
  },
  
  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  }
};
