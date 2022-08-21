import React from 'react';
import './form.scss';

function Input(props: { setValue: any; value: string; type: string; placeholder: string }) {
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
