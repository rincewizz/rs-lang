import axios from 'axios';
import { IAuth, ICreateUser, ILoginUser, IUser, IParamAuth } from '../../types';
import HOST from '../env';

const urlServerUsers = `${HOST}users`;
const urlServerSign = `${HOST}signin`;

interface IUserApi {
  createUser: (payload: ICreateUser) => Promise<{ dataUser: IUser; message: string }>;
  signIn: (payload: ILoginUser) => Promise<{ userAuth: IAuth; message: string }>;
  getUserData: ({ userId, token }: IParamAuth) => Promise<IUser>;
  getNewToken: ({ userId, token }: IParamAuth) => Promise<Pick<IAuth, 'token' | 'refreshToken'>>;
}

const AuthService = axios.create();

const userApi: IUserApi = {
  async createUser(payload) {
    try {
      const response = await axios.post(urlServerUsers, payload);
      return {
        dataUser: response.data,
        message: 'Пользователь успешно зарегистрирован',
      };
    } catch (error) {
      return {
        dataUser: {},
        message: 'Не корректные данные пользователя',
      };
    }
  },
  async signIn(payload) {
    try {
      const response = await axios.post(urlServerSign, payload);
      return {
        userAuth: response.data,
        message: 'Успешная авторизация',
      };
    } catch (error) {
      return {
        userAuth: {},
        message: 'Не корректные данные пользователя',
      };
    }
  },
  async getUserData({ userId, token }) {
    const response = await axios.get(`${urlServerUsers}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  async getNewToken({ userId, token: refreshToken }) {
    try {
      const response = await AuthService.get(`${urlServerUsers}/${userId}/tokens`, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });
      return response.data;
    } catch {
      return { message: 'nonAuth' };
    }
  },
};
export default userApi;
