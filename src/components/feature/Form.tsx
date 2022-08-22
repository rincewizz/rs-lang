import React from 'react';
import LoginFormHook from './LoginForm';
import './form.scss';
import { IHeaderProps } from '../../types';
import btn from '../../assets/img/modalBtnsvg.svg';

export default function Form(props: IHeaderProps) {
  const { handleClick } = props;
  return (
    <div>
      <div className="modal-wrap">
        <div className="modal">
          <div className="modal__btn" role="button" tabIndex={0} onClick={handleClick}>
            <img src={btn} alt="" />
          </div>
          <LoginFormHook handleClick={handleClick} />
        </div>
      </div>
    </div>
  );
}
