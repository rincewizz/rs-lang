import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IGamesStore } from '../../types';

const useGamesStore = create<IGamesStore>()(
  persist(
    (set) => ({
      gameState: { group: 0, page: null },
      setGameStore: (gameState) => set(() => ({ gameState })),
    }),
    {
      name: 'games-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useGamesStore;
