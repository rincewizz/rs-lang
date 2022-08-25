import React, { useState } from 'react';
import guy from '../../assets/img/guy.svg';
import logo from '../../assets/img/logo.svg';
import './header.scss';
import useAuthStore from '../../services/storage/Auth';
import Form from '../feature/Form';
import useUserStore from '../../services/storage/User';

function Header() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setUser = useUserStore((state) => state.setUser);
  const auth = useAuthStore((state) => state.auth);
  const handleClickOut = () => {
    setAuth({});
    setUser({});
  };

  const [visible, setVis] = useState(false);
  const handleClick = () => {
    setVis((curVal) => !curVal);
  };

  return (
    <>
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
      {visible && <Form handleClick={handleClick} />}
    </>
  );
}

export default Header;
