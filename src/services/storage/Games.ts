import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IGamesStore } from '../../types';

const useGamesStore = create<IGamesStore>()(
  persist(
    (set, get) => ({
      group: 0,
      page: 0,
      setTextbookState: (textbookState) =>
        set(() => ({ group: textbookState.group, page: textbookState.group })),
      getTextbookState: () => {
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