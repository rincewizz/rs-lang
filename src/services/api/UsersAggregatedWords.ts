import axios from 'axios';
import { IAggregatedWords, Word } from '../../types';

const HOST = 'http://localhost:8082/';

export interface IUserAggregatedWordApi {
  getAggregatedWords: (params: {
    token: string;
    userId: string;
    group?: number;
    page?: number;
    perPage?: number;
    filter?: string;
  }) => Promise<IAggregatedWords>;
  getAggregatedWordById: (params: {
    token: string;
    userId: string;
    wordId: string;
  }) => Promise<Word>;
}

export const usersAggregatedWordsApi: IUserAggregatedWordApi = {
  async getAggregatedWords({ token, userId, group, page, perPage, filter }) {
    const groupParam = group ? `group=${group}` : '';
    const pageParam = page ? `page=${page}` : '';
    const perPageParam = perPage ? `wordsPerPage=${perPage}` : '';
    const filterParam = filter ? `filter=${filter}` : '';
    const params = [groupParam, pageParam, perPageParam, filterParam].filter((el) => el);
    const paramStr = params.length ? `?${params.join('&')}` : '';
    const response = await axios.get(`${HOST}users/${userId}/aggregatedWords${paramStr}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data[0];
  },
  async getAggregatedWordById({ token, userId, wordId }) {
    const response = await axios.get(`${HOST}users/${userId}/aggregatedWords/${wordId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
