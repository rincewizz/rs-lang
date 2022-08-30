import React, { useEffect, useState } from 'react';
import './voicegameRound.scss';
import { Link } from 'react-router-dom';
import { Answer, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import FinishGame from './VoicegameFinish';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useGamesStore from '../../services/storage/Games';

import { AUDIO_HOST } from '../../services/env';
import { calcStatistic, updateStaticGame } from '../../utils';

function addAnswer() {
  const [words, setWords] = useState<Word[]>([]);
  const [pageList, setList] = useState<Word[]>([]);
  const [word, setWord] = useState<Word>();
  const [result, setResult] = useState<Answer[]>([]);
  const [allResults, setAllResults] = useState<boolean[]>([]);
  const [click, setClick] = useState<boolean>();
  const [isFinish, setFinish] = useState<string>();
  const [isDisabledAudio, setDisableAudio] = useState<boolean>();
  const [isDisabledNext, setDisableNext] = useState<boolean>();
  const [itemColorClass, setItemColorClass] = useState<string>();

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const currentGroup = useGamesStore((state) => state.group);

  async function setStaticGame() {
    if (isAuth && auth.token && auth.userId) {
      const calcInfo = calcStatistic(result.length, allResults);
      updateStaticGame(auth.token, auth.userId, calcInfo, 'Voice');
    }
  }

  async function loadWords(group = 0, page = 0) {
    let newWords;
    if (isAuth && auth.token && auth.userId) {
      const agrwords = await usersAggregatedWordsApi.getAggregatedWords({
        token: auth.token,
        userId: auth.userId,
        group,
        page,
        perPage: 20,
      });
      newWords = agrwords.paginatedResults;
    } else {
      newWords = await wordApi.getWords(group, page);
    }

    setWords(newWords);
    setList(newWords.slice(0, 4));
    setClick(false);
    setDisableAudio(false);
    setDisableNext(true);
  }

  useEffect(() => {
    loadWords(currentGroup);
  }, []);

  function isRightAnswer(ans: Word) {
    const obj: Answer = { name: word as Word, answer: false };
    setClick(false);
    if (ans.wordTranslate === (word as Word).wordTranslate) {
      setItemColorClass('right-answer');
      obj.answer = true;
    } else {
      setItemColorClass('false-answer');
    }
    setTimeout(() => {
      setItemColorClass('');
    }, 1000);
    result.push(obj);
    setResult(result);
    allResults.push(obj.answer);
    if (result.length === 20) {
      const arr: Answer[] = [];
      result.forEach((el) => {
        let prop = false;
        arr.forEach((elm) => {
          if (elm.name.word === el.name.word) {
            prop = true;
          }
        });
        if (!prop) {
          arr.push(el);
        }
      });

      setResult(arr);
      setFinish('finish');
      setStaticGame();
    }
    setDisableNext(false);
  }

  const updateList = () => {
    const options = words.sort(() => Math.random() - 0.5).slice(0, 4);
    setList(options);
    setDisableAudio(false);
    setDisableNext(true);
    return options;
  };

  function renderList(el: Word) {
    return (
      <li className="answer-item" key={el.id}>
        <button
          type="button"
          className="answer-item__button"
          onClick={() => (click === true ? isRightAnswer(el) : 0)}
          onKeyDown={() => (click === true ? isRightAnswer(el) : 0)}
        >
          {el.wordTranslate}
        </button>
      </li>
    );
  }

  function playAudio() {
    const num = Math.round(0 - 0.5 + Math.random() * (3 - 0 + 1));
    new Audio(AUDIO_HOST + pageList[num].audio).play();
    setWord(pageList[num]);
    setClick(true);
    setDisableAudio(true);
  }

  function startAgain() {
    setFinish('');
    setResult([]);
    setAllResults([]);
    setDisableAudio(false);
    setDisableNext(true);
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
        <table className="score-table">
          <tbody>{result.map((el) => FinishGame(el))}</tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <button
        className="audio-button"
        type="button"
        disabled={isDisabledAudio}
        onClick={() => playAudio()}
      >
        Play
      </button>

      <ul className={`answer-list ${itemColorClass}`}>{pageList.map((el) => renderList(el))}</ul>
      <button
        type="button"
        className="next-button"
        disabled={isDisabledNext}
        onClick={() => updateList()}
      >
        Next
      </button>
      {isFinish === 'finish' ? showFinish() : ''}
    </>
  );
}

export default function VoiceGameRound() {
  return (
    <div className="round-container">
      <div className="game-container">{addAnswer()}</div>
    </div>
  );
}
