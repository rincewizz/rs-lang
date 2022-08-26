import axios from 'axios';
import { IUserWord, IUserWordParams } from '../../types';
import HOST from '../env';

export interface IUserWordApi {
  getUserWords: (param: Omit<IUserWordParams, 'request' | 'wodrdId'>) => Promise<IUserWord[]>;
  getUserWordById: (param: Omit<IUserWordParams, 'request'>) => Promise<IUserWord>;
  createUserWord: (param: IUserWordParams) => Promise<IUserWord>;
  updateUserWord: (param: IUserWordParams) => Promise<IUserWord>;
  deleteUserWord: (param: Omit<IUserWordParams, 'request'>) => Promise<object>;
}

export const usersWordsApi: IUserWordApi = {
  async getUserWords({ token, userId }) {
    const response = await axios.get(`${HOST}users/${userId}/words`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async getUserWordById({ token, userId, wordId }) {
    const response = await axios.get(`${HOST}users/${userId}/words/${wordId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async createUserWord({ token, userId, wordId, request }) {
    const response = await axios.post(`${HOST}users/${userId}/words/${wordId}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async updateUserWord({ token, userId, wordId, request }) {
    const response = await axios.put(`${HOST}users/${userId}/words/${wordId}`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async deleteUserWord({ token, userId, wordId }) {
    const response = await axios.delete(`${HOST}users/${userId}/words/${wordId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
