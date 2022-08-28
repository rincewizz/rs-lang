/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Link } from 'react-router-dom';
import { Word } from '../../types';
import GameResultsItems from './GameResultsItems';

export default function GameResults(props: {
  results: Map<Word, boolean>;
  startAgainClick: () => void;
}) {
  const { results, startAgainClick } = props;
  const resultsArr = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const [word, answer] of results.entries()) {
    resultsArr.push(<GameResultsItems key={word._id || word.id} name={word} answer={answer} />);
  }

  return (
    <div className="finish-game">
      <Link to="/" className="close">
        Close
      </Link>
      <button className="start-again" type="button" onClick={startAgainClick}>
        Start again
      </button>
      <table className="score-table">
        <tbody>{resultsArr}</tbody>
      </table>
    </div>
  );
}
