import axios from 'axios';
import { IAuth, ICreateUser, ILoginUser, IUser, IParamAuth } from '../../types';

const urlServer = 'http://localhost:8082';
const urlServerUsers = `${urlServer}/users`;
const urlServerSign = `${urlServer}/signin`;

interface IUserApi {
  createUser: (payload: ICreateUser) => Promise<{ dataUser: IUser; message: string }>;
  signIn: (payload: ILoginUser) => Promise<{ userAuth: IAuth; message: string }>;
  getUserData: ({ userId, token }: IParamAuth) => Promise<any>;
}

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
        dataUser: null,
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
        userAuth: null,
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
};
export default userApi;
