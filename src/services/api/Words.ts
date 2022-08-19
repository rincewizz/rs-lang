import axios from 'axios';
import { Word } from '../../types';

const HOST = 'http://localhost:8082/';

export interface IWordApi {
  getWords: (group: number, page: number) => Promise<Word[]>;
  getWordById: (id: string) => Promise<Word>;
}

export const wordApi: IWordApi = {
  async getWords(group = 0, page = 0) {
    const response = await axios.get(`${HOST}words?group=${group}&page=${page}`);
    return response.data;
  },
  async getWordById(id: string) {
    const response = await axios.get(`${HOST}words/${id}`);
    return response.data;
  },
};
