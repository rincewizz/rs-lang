import create from 'zustand';
import { IWordsStore } from '../../types';

const useWordsStore = create<IWordsStore>()((set) => ({
  words: [],
  setWords: (words) => set(() => ({ words })),
}));

export default useWordsStore;
