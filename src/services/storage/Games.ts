import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IGamesStore } from '../../types';

const useGamesStore = create<IGamesStore>()(
  persist(
    (set, get) => ({
      group: 0,
      page: 0,
      setGameState: (gameState) => set(() => ({ group: gameState.group, page: gameState.group })),
      getGameState: () => {
        return { page: get().page, group: get().group };
      },
      setPage: (page) => set(() => ({ page })),
      setGroup: (group) => set(() => ({ group })),
    }),
    {
      name: 'games-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useGamesStore;
