import React from 'react';
import { IpropsCardDev } from '../../types';

function CardDev(props: IpropsCardDev) {
  const { devs } = props;
  return (
    <div className="card-dev">
      <img src={devs.foto} className="foto-dev" alt="foto" />
      <h2>{devs.name}</h2>
      <p>{devs.text}</p>
    </div>
  );
}

export default CardDev;
