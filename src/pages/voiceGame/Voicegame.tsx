import React from 'react';
import './style.scss';
import Sidebar from '../../components/shared/Sidebar';
import { Numbers } from '../../types';

const NUMBERS = [
  { number: '1' },
  { number: '2' },
  { number: '3' },
  { number: '4' },
  { number: '5' },
  { number: '6' },
];

function addNumbers(props: Numbers) {
  return (
    <li className="game__level-item" key={props.number}>
      {props.number}
    </li>
  );
}

export default function VoiceGame() {
  return (
    <>
      <Sidebar />
      <div className="game-container">
        <div className="game">
          <h3 className="game__header">Аудиовызов</h3>
          <p className="game__description">
            Игра для тренировки восприятия английской речи на слух.
          </p>
          <p className="game__choose-level">Выберите один из предложенных уровней сложности:</p>
          <ul className="game__level-list">{NUMBERS.map((item) => addNumbers(item))}</ul>
        </div>
      </div>
    </>
  );
}
