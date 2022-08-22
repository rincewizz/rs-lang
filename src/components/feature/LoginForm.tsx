import React, { useState } from 'react';
import userApi from '../../services/api/Users';
import { IHeaderProps } from '../../types';

import './form.scss';
import Input from './Input';

export default function LoginFormHook(props: IHeaderProps) {
  const { handleClick } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleReg = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email.substring(0, email.lastIndexOf('@'));
    (async () => {
      const { dataUser, message } = await userApi.createUser({ name, email, password });
      if (dataUser) {
        userApi.signIn({ email, password });
        handleClick();
      }
      const mesOnServer = document.querySelector('.message') as HTMLElement;
      mesOnServer.innerHTML = message;
    })();
  };
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      const { userAuth, message } = await userApi.signIn({ email, password });
      const mesOnServer = document.querySelector('.message') as HTMLElement;
      if (userAuth) handleClick();
      else mesOnServer.innerHTML = message;
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
      <div className="message"> </div>
    </div>
  );
}
