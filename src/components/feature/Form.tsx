import React from 'react';
import LoginFormHook from './LoginForm';
import './form.scss';
import { IHeaderProps } from '../../types';

export default function ModalLoginForm(props: IHeaderProps) {
  const { handleClick } = props;
  return (
    <div>
      <div className="modal-wrap">
        <div className="modal">
          <button className="modal__btn" type="button" aria-label="Close" onClick={handleClick} />
          <LoginFormHook handleClick={handleClick} />
        </div>
      </div>
    </div>
  );
}
