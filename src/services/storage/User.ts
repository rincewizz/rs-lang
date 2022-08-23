import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IAuthStore, IUserStore } from '../../types';

const useUserStore = create<IUserStore>()(
  persist(
    (set, get) => ({
      user: {},
      setUser: (user) => set(() => ({ user })),
      getUser: () => get().user,
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);

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

export { useUserStore, useAuthStore };
