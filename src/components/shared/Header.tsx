import React from 'react';
import guy from '../../assets/img/guy.svg';
import userImg from '../../assets/img/user.svg';
import logo from '../../assets/img/logo.svg';
import './header.scss';
import { IHeaderProps } from '../../types';

function Header(props: IHeaderProps) {
  const { handleClick } = props;
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
        <div className="logo-user" role="button" tabIndex={0} onClick={handleClick}>
          <img src={userImg} alt="" />
        </div>
      </header>
    </div>
  );
}

export default Header;
