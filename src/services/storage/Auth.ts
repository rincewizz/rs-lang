import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IAuthStore } from '../../types';

const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      auth: {},
      setAuth: (auth) => set(() => ({ auth })),
      getAuth: () => get().auth,
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
