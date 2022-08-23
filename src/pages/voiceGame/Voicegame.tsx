import React from 'react';
import './style.scss';
import Sidebar from '../../components/shared/Sidebar';
import { Numbers } from '../../types';

const NUMBERS = [
  { number: '1', words: '' },
  { number: '2', words: '' },
  { number: '3', words: '' },
  { number: '4', words: '' },
  { number: '5', words: '' },
  { number: '6', words: '' },
];

function addNumbers(props: Numbers) {
  const el = props;
  return <li className="main__level-item">{el.number}</li>;
}

export default function VoiceGame() {
  const numberComponent = () => {
    return (
      <div className="game-container">
        <div className="main">
          <h3 className="main__header">Аудиовызов</h3>
          <p className="main__description">
            Игра для тренировки восприятия английской речи на слух.
          </p>
          <p className="main__choose-level">Выберите один из предложенных уровней сложности:</p>
          <ul className="main__level-list">{NUMBERS.map((item) => addNumbers(item))}</ul>
        </div>
      </div>
    );
  };
  return (
    <>
      <Sidebar />
      {numberComponent()}
    </>
  );
}
