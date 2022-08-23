import axios from 'axios';
import { IAuth, ICreateUser, ILoginUser, IUser, IParamAuth } from '../../types';

const urlServer = 'http://localhost:8082';
const urlServerUsers = `${urlServer}/users`;
const urlServerSign = `${urlServer}/signin`;

interface IUserApi {
  createUser: (payload: ICreateUser) => Promise<{ dataUser: IUser; message: string }>;
  signIn: (payload: ILoginUser) => Promise<IAuth>;
  getUserData: ({ userId, token }: IParamAuth) => Promise<IUser>;
}

const userApi: IUserApi = {
  async createUser(payload) {
    let mes = 'Пользователь успешно зарегистрирован';
    try {
      const response = await axios.post(urlServerUsers, payload);
      return {
        dataUser: response.data,
        message: mes,
      };
    } catch (error) {
      mes = 'Не корректные данные пользователя';
      return {
        dataUser: null,
        message: mes,
      };
    }
  },
  async signIn(payload) {
    const response = await axios.post(urlServerSign, payload);
    return response.data;
  },
  async getUserData({ userId, token }) {
    const response = await axios.get(`${urlServerUsers}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
export default userApi;
