import React from 'react';
import './voicegameRound.scss';
import { Answer } from '../../types';
import plus from '../../assets/img/plus.svg';
import minus from '../../assets/img/minus.svg';

export default function FinishGame(props: Answer) {
  const { name, answer } = props;
  return (
    <tr>
      <td>{name.word}</td>
      <td>{name.transcription}</td>
      <td>{name.wordTranslate}</td>
      <td>
        <img className="answer-img" src={answer === true ? plus : minus} alt="answer" />
      </td>
    </tr>
  );
}
