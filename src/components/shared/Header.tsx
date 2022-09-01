import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import guy from '../../assets/img/guy.svg';
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
          <Link className="logo logo-home" to="/" />
          <div className="header__welcome">
            <h1>RSLang</h1>
            <p>Приложение для изучения английского языка</p>
          </div>
          <img src={guy} className="header__img" alt="" />
          {auth.message ? (
            <button
              className="logo logout"
              type="button"
              aria-label="Выход"
              onClick={handleClickOut}
            />
          ) : (
            <button className="logo lognin" type="button" aria-label="Вход" onClick={handleClick} />
          )}
        </header>
      </div>
      {visible && <Form handleClick={handleClick} />}
    </>
  );
}

export default Header;
