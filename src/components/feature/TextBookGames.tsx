import React from 'react';
import { Link } from 'react-router-dom';
import './textbookgames.scss';

export default function TextBookGames(props: { isLearnedPage: boolean }) {
  const { isLearnedPage } = props;

  return (
    <div className="textbook-games">
      <Link
        to="/voicegameround"
        className={`textbook-games__link textbook-games__link--voice ${
          isLearnedPage ? 'textbook-games__link--disabled' : ''
        }`}
      >
        <div className="textbook-games__img">Аудиовызов</div>
      </Link>
      <Link
        to="/sprintgameround"
        className={`textbook-games__link textbook-games__link--sprint ${
          isLearnedPage ? 'textbook-games__link--disabled' : ''
        }`}
      >
        <div className="textbook-games__img">Спринт</div>
      </Link>
    </div>
  );
}
