import axios from 'axios';
import { IUserStatistic, IUserStatisticParams } from '../../types';
import HOST from '../env';

export interface IUserStatisticApi {
  updateUserStatistic: (param: IUserStatisticParams) => Promise<IUserStatistic>;
  getUserStatistic: (param: Omit<IUserStatisticParams, 'request'>) => Promise<IUserStatistic>;
}
export const userStatisticApi: IUserStatisticApi = {
  async updateUserStatistic({ token, userId, request }) {
    const response = await axios.put(`${HOST}users/${userId}/statistics`, request, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async getUserStatistic({ userId, token }) {
    const response = await axios.get(`${HOST}users/${userId}/statistics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
