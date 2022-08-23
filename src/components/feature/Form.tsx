import React from 'react';
import LoginFormHook from './LoginForm';
import './form.scss';

export default function Form() {
  return (
    <div>
      <div className="modal-wrap">
        <div className="modal">
          <LoginFormHook />
        </div>
      </div>
    </div>
  );
}
