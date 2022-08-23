import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IUserStore } from '../../types';

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

export default { useUserStore };
