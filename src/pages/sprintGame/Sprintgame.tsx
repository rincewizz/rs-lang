import React from 'react';
import '../voiceGame/style.scss';
import { useNavigate } from 'react-router-dom';
import { Numbers } from '../../types';
import useGamesStore from '../../services/storage/Games';

const NUMBERS = [
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
  { number: 5 },
  { number: 6 },
];

export default function SprintGame() {
  const history = useNavigate();
  const setCurrentGroup = useGamesStore((state) => state.setGroup);
  const setCurrentPage = useGamesStore((state) => state.setPage);
  setCurrentPage(null);

  function setState(group: number) {
    setCurrentGroup(group - 1);
    history('/sprintgameround');
  }

  function addNumbers(props: Numbers) {
    return (
      <button
        className="game__level-item"
        key={props.number}
        onClick={() => setState(props.number)}
        type="button"
      >
        {props.number}
      </button>
    );
  }

  return (
    <div className="start-game">
      <div className="game">
        <h3 className="title-page">Спринт</h3>
        <p className="game__description">
          Игра для тренировки быстрого перевода с английского языка на русский. Необходимо указать
          является ли перевод слова правильным.
        </p>
        <p className="game__choose-level">Выберите один из предложенных уровней сложности:</p>
        <ul className="game__level-list">{NUMBERS.map((item) => addNumbers(item))}</ul>
      </div>
    </div>
  );
}
