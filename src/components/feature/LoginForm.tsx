import React, { useState } from 'react';
import userApi from '../../services/api/Users';
import { IHeaderProps } from '../../types';
import useAuthStore from '../../services/storage/Auth';

import './form.scss';
import Input from './Input';
import { userStatisticApi } from '../../services/api/Statistic';

export default function LoginForm(props: IHeaderProps) {
  const { handleClick } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mes, setMes] = useState('');

  const handleReg = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email.substring(0, email.lastIndexOf('@'));
    (async () => {
      const { dataUser, message } = await userApi.createUser({ name, email, password });
      if (dataUser.id) {
        const { userAuth } = await userApi.signIn({ email, password });
        setAuth(userAuth);
        const userStatistic = {
          learnedWords: 0,
          optional: {
            gameSprint: {
              date: '',
              countNewWords: 0,
              countCorrect: 0,
              totalWords: 0,
              lengthCorrect: 0,
            },
            gameVoice: {
              date: '',
              countNewWords: 0,
              countCorrect: 0,
              totalWords: 0,
              lengthCorrect: 0,
            },
          },
        };
        await userStatisticApi.updateUserStatistic({
          token: userAuth.token,
          userId: userAuth.userId,
          request: userStatistic,
        });
        handleClick();
      }
      setMes(message);
    })();
  };
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      const { userAuth, message } = await userApi.signIn({ email, password });
      setAuth(userAuth);
      if (userAuth.userId) handleClick();
      else setMes(message);
    })();
  };
  return (
    <div className="login-form">
      <h2> Войти или зарегистрироваться</h2>
      <Input value={email} placeholder="email" type="email" setValue={setEmail} />
      <Input value={password} placeholder="Пароль" type="password" setValue={setPassword} />
      <div className="modal-btns">
        <button className="btn" type="button" onClick={handleSignIn}>
          Войти
        </button>
        <button className="btn" type="button" onClick={handleReg}>
          Зарегистрироваться
        </button>
      </div>
      <div className="message">{mes}</div>
    </div>
  );
}
