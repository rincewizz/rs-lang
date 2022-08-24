import React, { useEffect, useState } from 'react';
import './voicegameRound.scss';
import Sidebar from '../../components/shared/Sidebar';
import { Answer, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import FinishGame from './VoicegameFinish';

const HOST = 'http://localhost:8082/';

function addAnswer() {
  const [words, setWords] = useState<Word[]>([]);
  const [pageList, setList] = useState<Word[]>([]);
  const [word, setWord] = useState<Word>();
  const [result, setResult] = useState<Answer[]>([]);
  const [click, setClick] = useState<boolean>();
  async function loadWords(group = 0, page = 0) {
    const newWords = await wordApi.getWords(group, page);
    setWords(newWords);
    setList(newWords.slice(0, 4));
    setClick(false);
  }

  useEffect(() => {
    loadWords();
  }, []);

  function isRightAnswer(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLButtonElement>
  ) {
    const obj: Answer = { name: word as Word, answer: false };
    const target = e.target as HTMLElement;
    setClick(false);
    if (target.innerHTML === (word as Word).wordTranslate) {
      target.style.backgroundColor = '#96eda7';
      obj.answer = true;
    } else {
      target.style.backgroundColor = '#ed9696';
    }
    setTimeout(() => {
      target.style.backgroundColor = '#d2d2d8';
    }, 1000);
    result.push(obj);
    setResult(result);
    if (result.length === 2) {
      const finish = document.querySelector('.finish-game') as HTMLElement;
      finish.style.display = 'flex';
    }
    document.querySelector('.next-button')?.removeAttribute('disabled');
  }

  const updateList = () => {
    const options = words.sort(() => Math.random() - 0.5).slice(0, 4);
    setList(options);
    document.querySelector('.audio-button')?.removeAttribute('disabled');
    document.querySelector('.next-button')?.setAttribute('disabled', 'true');
    return options;
  };

  function renderList(el: Word) {
    return (
      <li className="answer-item" key={el.id}>
        <button
          type="button"
          className="answer-item__button"
          onClick={(e) => (click === true ? isRightAnswer(e) : 0)}
          onKeyDown={(e) => (click === true ? isRightAnswer(e) : 0)}
        >
          {el.wordTranslate}
        </button>
      </li>
    );
  }

  function playAudio() {
    const num = Math.round(0 - 0.5 + Math.random() * (3 - 0 + 1));
    new Audio(HOST + pageList[num].audio).play();
    setWord(pageList[num]);
    document.querySelector('.audio-button')?.setAttribute('disabled', 'true');
    setClick(true);
  }

  function startAgain() {
    const finish = document.querySelector('.finish-game') as HTMLElement;
    finish.style.display = 'none';
    setResult([]);
    document.querySelector('.audio-button')?.removeAttribute('disabled');
    document.querySelector('.next-button')?.setAttribute('disabled', 'true');
  }

  return (
    <>
      <button className="audio-button" type="button" onClick={() => playAudio()}>
        Play
      </button>

      <ul className="answer-list">{pageList.map((el) => renderList(el))}</ul>
      <button type="button" className="next-button" onClick={() => updateList()}>
        Next
      </button>
      <div className="finish-game">
        <button className="close" type="button">
          Close
        </button>
        <button className="start-again" type="button" onClick={() => startAgain()}>
          Start again
        </button>
        <table className="score-table">{result.map((el) => FinishGame(el))}</table>
      </div>
    </>
  );
}

export default function VoiceGameRound() {
  return (
    <>
      <Sidebar />
      <div className="round-container">
        <div className="game-container">{addAnswer()}</div>
      </div>
    </>
  );
}
