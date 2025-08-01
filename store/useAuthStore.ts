import { AuthState } from '@/interfaces/auth/AuthState';
import { InstitutionResponse } from '@/interfaces/institution/Institutionresponse';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';



interface AuthStore {
  user: AuthState | null;
  institution: InstitutionResponse | null;
  setUser: (user: AuthState) => void;
  setInstitution: (institution: InstitutionResponse|undefined) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      institution: null,
      setUser: (user) => set({ user }),
      setInstitution: (institution) => set({ institution }),
      logout: () => set({ user: null, institution: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
