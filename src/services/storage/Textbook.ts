import create from 'zustand';
import { persist } from 'zustand/middleware';
import { ITextbookStore } from '../../types';

const useTextbookStore = create<ITextbookStore>()(
  persist(
    (set, get) => ({
      group: 0,
      page: 0,
      words: [],
      setTextbookState: (textbookState) =>
        set(() => ({ group: textbookState.group, page: textbookState.group })),
      getTextbookState: () => {
        return { page: get().page, group: get().group };
      },
      setPage: (page) => set(() => ({ page })),
      setGroup: (group) => set(() => ({ group })),
      setWords: (words) => set(() => ({ words })),
    }),
    {
      name: 'textbook-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useTextbookStore;
