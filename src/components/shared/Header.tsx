import React from 'react';
import guy from '../../assets/img/guy.svg';
import userImg from '../../assets/img/user.svg';
import logo from '../../assets/img/logo.svg';
import logout from '../../assets/img/logout.svg';
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
          <div className="logo-user logout" role="button" tabIndex={0} onClick={handleClickOut}>
            <img src={logout} alt="Выход" />
          </div>
        ) : (
          <div className="logo-user" role="button" tabIndex={0} onClick={handleClick}>
            <img src={userImg} alt="Вход" />
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;
