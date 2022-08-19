import { IAuth, ICreateUser, ILoginUser, IUser, IParamAuth } from '../../types';

const urlServer = 'http://localhost:8082';
const urlServerUsers = `${urlServer}/users`;
const urlServerSign = `${urlServer}/signin`;

const createUser = async (user: ICreateUser): Promise<IUser> => {
  const rawResponse = await fetch(urlServerUsers, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const content = await rawResponse.json();
  return content;
};

const loginUser = async (user: ILoginUser): Promise<IAuth> => {
  const rawResponse = await fetch(urlServerSign, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  const content = await rawResponse.json();
  return content;
};

const getUser = async ({ userId, token }: IParamAuth) => {
  const rawResponse = await fetch(`${urlServerUsers}/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const content = await rawResponse.json();
  return content;
};

export { createUser, loginUser, getUser };
