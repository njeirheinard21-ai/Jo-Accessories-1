import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from 'firebase/auth'
import { Role, UserDocument } from '../types/auth'

interface AuthState {
  user: User | null
  userDoc: UserDocument | null
  isAdmin: boolean
  userRole: Role | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setUserDoc: (doc: UserDocument | null) => void
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userDoc: null,
      isAdmin: false,
      userRole: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setUserDoc: (doc) => set({ 
        userDoc: doc,
        userRole: doc?.role || null,
        isAdmin: doc?.role === 'admin' || doc?.role === 'super_admin' || doc?.role === 'store_owner'
      }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
