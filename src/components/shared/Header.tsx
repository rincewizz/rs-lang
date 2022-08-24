import React from 'react';
import guy from '../../assets/img/guy.svg';
import logo from '../../assets/img/logo.svg';
import './header.scss';
import { IHeaderProps } from '../../types';
import useAuthStore from '../../services/storage/Auth';

function Header(props: IHeaderProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const auth = useAuthStore((state) => state.auth);
  const { handleClick } = props;
  const handleClickOut = () => {
    setAuth({});
  };

  return (
    <div className="wrap wrap-header">
      <header className="header">
        <a href="/" className="logo">
          <img src={logo} alt="" />
        </a>
        <div className="header__welcome">
          <h1>Hello!</h1>
          <p>It’s good to see you again.</p>
        </div>
        <img src={guy} className="header__img" alt="" />
        {auth.message ? (
          <button
            className="logo-user logout"
            type="button"
            aria-label="Выход"
            onClick={handleClickOut}
          />
        ) : (
          <button
            className="logo-user lognin"
            type="button"
            aria-label="Вход"
            onClick={handleClick}
          />
        )}
      </header>
    </div>
  );
}

export default Header;
