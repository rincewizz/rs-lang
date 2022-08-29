/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import './sprintgameRound.scss';
import { IGameResults, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useGamesStore from '../../services/storage/Games';
import GameResults from '../../components/shared/GameResults';
import { calcStatistic, recordWordsStatics, updateStaticGame } from '../../utils';

export default function SprintGameRound() {
  const [words, setWords] = useState<Word[]>([]);
  const [itemEn, setItemEn] = useState<Word>();
  const [itemRus, setItemRus] = useState<Word>();
  const [results, setResults] = useState<IGameResults>(new Map());
  const [allResults, setAllResults] = useState<boolean[]>([]);
  const [isFinish, setFinish] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(60);
  const [itemColorClass, setItemColorClass] = useState<string>();
  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const currentPage = useGamesStore((state) => state.page);
  const currentGroup = useGamesStore((state) => state.group);

  async function setStaticGame() {
    if (isAuth && auth.token && auth.userId) {
      const calcInfo = calcStatistic(results, allResults);
      updateStaticGame(auth.token, auth.userId, calcInfo);
    }
  }

  function renderWord() {
    const num = Math.floor(Math.random() * 2);
    for (let i = words.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    const options = words.slice(0, 2);
    setItemEn(options[0]);
    setItemRus(options[num]);
  }

  async function loadWords() {
    let newWords;
    let page = currentPage;

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
  }

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    renderWord();
  }, [words]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(setSeconds, 1000, seconds - 1);
    } else {
      setFinish(true);
      setStaticGame();
      recordWordsStatics(auth, 'sprint', results);
    }
  }, [seconds]);

  function isItTrue(ans: boolean) {
    let answer = false;
    if ((itemEn === itemRus && ans) || (itemEn !== itemRus && !ans)) {
      answer = true;
      setItemColorClass('right-sprint');
    } else {
      setItemColorClass('false-sprint');
    }
    setTimeout(() => {
      setItemColorClass('');
    }, 1000);

    const result = results.get(itemEn as Word);
    if (result) {
      if (answer) result.correct += 1;
      else result.incorrect += 1;
    } else {
      results.set(itemEn as Word, { correct: +answer, incorrect: +!answer });
    }
    allResults.push(answer);
    renderWord();
  }

  const startAgain = () => {
    setFinish(false);
    setAllResults([]);
    setResults(new Map());
    setSeconds(60);
  };

  return (
    <div className="round-container">
      <div className="game-container">
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
        {isFinish && <GameResults results={results} startAgainClick={startAgain} />}
      </div>
    </div>
  );
}
