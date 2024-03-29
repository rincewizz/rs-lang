import React from 'react';
import { Answer } from '../../types';
import plus from '../../assets/img/plus.svg';
import minus from '../../assets/img/minus.svg';

export default function GameResultsItems(props: Answer) {
  const { name, answer } = props;
  return (
    <tr key={name.id}>
      <td>{name.word}</td>
      <td className="transcription">{name.transcription}</td>
      <td>{name.wordTranslate}</td>
      <td>
        <img className="answer-img" src={answer === true ? plus : minus} alt="answer" />
      </td>
    </tr>
  );
}
