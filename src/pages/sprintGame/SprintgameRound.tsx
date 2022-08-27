import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './sprintgameRound.scss';
import { Answer, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import FinishGame from '../voiceGame/VoicegameFinish';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useGamesStore from '../../services/storage/Games';

function addAnswer() {
  const [words, setWords] = useState<Word[]>([]);
  const [itemEn, setItemEn] = useState<Word>();
  const [itemRus, setItemRus] = useState<Word>();
  const [result, setResult] = useState<Answer[]>([]);
  const [isFinish, setFinish] = useState<string>();
  const [seconds, setSeconds] = useState(60);
  const [itemColorClass, setItemColorClass] = useState<string>();
  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const currentPage = useGamesStore((state) => state.page);
  const currentGroup = useGamesStore((state) => state.group);

  async function loadWords() {
    let newWords;
    let page;
    if (currentPage === null) {
      const min = Math.ceil(0);
      const max = Math.floor(29);
      page = Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      page = currentPage;
    }
    if (isAuth && auth.token && auth.userId) {
      const agrwords = await usersAggregatedWordsApi.getAggregatedWords({
        token: auth.token,
        userId: auth.userId,
        group: currentGroup,
        page,
        perPage: 20,
      });
      newWords = agrwords.paginatedResults;
    } else {
      newWords = await wordApi.getWords(currentGroup, page);
    }
    setWords(newWords);
    setItemEn(newWords[0]);
    setItemRus(newWords[0]);
  }

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(setSeconds, 1000, seconds - 1);
    } else {
      setFinish('finish');
    }
  }, [seconds]);

  function renderWord() {
    const num = Math.round(0 - 0.5 + Math.random() * (1 - 0 + 1));
    const options = words.sort(() => Math.random() - 0.5).slice(0, 2);
    setItemEn(options[0]);
    setItemRus(options[num]);
  }

  function isItTrue(ans: boolean) {
    const obj: Answer = { name: itemEn as Word, answer: false };
    if ((itemEn?.id === itemRus?.id && ans) || (itemEn?.id !== itemRus?.id && !ans)) {
      obj.answer = true;
      setItemColorClass('right-sprint');
    } else {
      setItemColorClass('false-sprint');
    }
    setTimeout(() => {
      setItemColorClass('');
    }, 1000);
    let answer = true;
    result.forEach((el) => {
      if (el.name === obj.name) {
        answer = false;
      }
    });
    if (answer === true) {
      result.push(obj);
    }
    renderWord();
  }

  function startAgain() {
    setFinish('');
    setResult([]);
    setSeconds(60);
  }

  function showFinish() {
    return (
      <div className="finish-game">
        <Link to="/" className="close">
          Close
        </Link>
        <button className="start-again" type="button" onClick={() => startAgain()}>
          Start again
        </button>
        <table className="score-table">{result.map((el) => FinishGame(el))}</table>
      </div>
    );
  }

  return (
    <>
      <div className="count-container">
        {' '}
        <div>{seconds}</div>
        <div className={`${itemColorClass}`} />
      </div>

      <div className="game-words">
        <div>{itemEn?.word}</div>
        <div>{itemRus?.wordTranslate}</div>
      </div>
      <div className="buttons">
        <button type="button" className="next-button" onClick={() => isItTrue(false)}>
          Неверно
        </button>
        <button className="audio-button" type="button" onClick={() => isItTrue(true)}>
          Верно
        </button>
      </div>
      {isFinish === 'finish' ? showFinish() : ''}
    </>
  );
}

export default function SprintGameRound() {
  return (
    <div className="round-container">
      <div className="game-container">{addAnswer()}</div>
    </div>
  );
}
