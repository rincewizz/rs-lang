import React from 'react';
import { IInputProps } from '../../types';
import './form.scss';

function Input(props: IInputProps) {
  const { setValue, value, type, placeholder } = props;
  return (
    <input
      className="login-form__input"
      onChange={(e) => setValue(e.target.value)}
      value={value}
      type={type}
      placeholder={placeholder}
      autoComplete="off"
    />
  );
}

export default Input;
