import React from 'react';
import './voicegameRound.scss';
import { Answer } from '../../types';
import plus from '../../assets/img/plus.svg';
import minus from '../../assets/img/minus.svg';

export default function FinishGame(props: Answer) {
  const el = props;
  return (
    <tr>
      <td>{el.name.word}</td>
      <td>{el.name.transcription}</td>
      <td>{el.name.wordTranslate}</td>
      <td>
        <img className="answer-img" src={el.answer === true ? plus : minus} alt="answer" />
      </td>
    </tr>
  );
}
