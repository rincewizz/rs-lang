/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import './sprintgameRound.scss';
import { IGameResults, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useGamesStore from '../../services/storage/Games';
import GameResults from '../../components/shared/GameResults';
import { calcStatistic, recordWordsStatics, shuffleWord, updateStaticGame } from '../../utils';

export default function SprintGameRound() {
  const [words, setWords] = useState<Word[]>([]);
  const [itemEn, setItemEn] = useState<Word>();
  const [itemRus, setItemRus] = useState<Word>();
  const [results, setResults] = useState<IGameResults>(new Map());
  const [allResults, setAllResults] = useState<boolean[]>([]);
  const [isFinish, setFinish] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(60);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [itemColorClass, setItemColorClass] = useState<string>();
  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const currentPage = useGamesStore((state) => state.page);
  const currentGroup = useGamesStore((state) => state.group);

  const [wordsIndex, setWordsIndex] = useState<number>(0);

  async function setStaticGame() {
    if (isAuth && auth.token && auth.userId) {
      const calcInfo = calcStatistic(results.size, allResults);
      updateStaticGame(auth.token, auth.userId, calcInfo, 'Sprint');
    }
  }

  function renderWord() {
    if (words.length === 0) return;
    const isTrueAnswer = !!Math.floor(Math.random() * 2);
    let randIndex;
    do {
      randIndex = Math.floor(Math.random() * words.length);
    } while (randIndex === wordsIndex);

    setItemEn(words[wordsIndex]);
    const ru = isTrueAnswer ? words[wordsIndex] : words[randIndex];
    setItemRus(ru);
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
    setWords(shuffleWord(newWords));
  }

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    renderWord();
  }, [words]);

  useEffect(() => {
    if (seconds > 0) {
      const id = setTimeout(setSeconds, 1000, seconds - 1);
      setTimeoutId(id);
    } else {
      setFinish(true);
    }
  }, [seconds]);

  useEffect(() => {
    if (isFinish) {
      setStaticGame();
      recordWordsStatics(auth, 'sprint', results);
      setWordsIndex(0);
      clearTimeout(timeoutId);
      setSeconds(0);
    }
  }, [isFinish]);

  function isItTrue(ans: boolean) {
    setWordsIndex(wordsIndex + 1);
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

    if (wordsIndex < words.length) {
      renderWord();
    } else {
      setFinish(true);
    }
  }

  const startAgain = () => {
    loadWords();
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
