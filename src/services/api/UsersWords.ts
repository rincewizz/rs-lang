import axios from 'axios';
import { IUserWord } from '../../types';

const HOST = 'http://localhost:8082/';

export interface IUserWordApi {
  getUserWords: (param: { token: string; userId: string }) => Promise<IUserWord[]>;
  getUserWordById: (param: { token: string; userId: string; wordId: string }) => Promise<IUserWord>;
  createUserWord: (param: {
    token: string;
    userId: string;
    wordId: string;
    request: object;
  }) => Promise<IUserWord>;
  updateUserWord: (param: {
    token: string;
    userId: string;
    wordId: string;
    request: object;
  }) => Promise<IUserWord>;
  deleteUserWord: (param: { token: string; userId: string; wordId: string }) => Promise<object>;
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
