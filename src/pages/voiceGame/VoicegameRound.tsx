/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import './voicegameRound.scss';
import { Answer, IGameResults, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useGamesStore from '../../services/storage/Games';
import sound from '../../assets/img/soundSprint.svg';
import { AUDIO_HOST } from '../../services/env';
import {
  addMoreWords,
  calcStatistic,
  recordWordsStatics,
  shuffleWord,
  updateStaticGame,
} from '../../utils';
import GameResults from '../../components/shared/GameResults';

export default function VoiceGameRound() {
  const [words, setWords] = useState<Word[]>([]);
  const [pageList, setPageList] = useState<Word[]>([]);
  const [word, setWord] = useState<Word>();
  const [results, setResults] = useState<IGameResults>(new Map());
  const [allResults, setAllResults] = useState<boolean[]>([]);
  const [click, setClick] = useState<boolean>();
  const [isFinish, setFinish] = useState<string>();
  const [isDisabledNext, setDisableNext] = useState<boolean>();
  const [itemColorClass, setItemColorClass] = useState<string>();

  const [wordsIndex, setWordsIndex] = useState<number>(0);

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const currentPage = useGamesStore((state) => state.page);
  const currentGroup = useGamesStore((state) => state.group);

  async function setStaticGame() {
    if (isAuth && auth.token && auth.userId) {
      const calcInfo = await calcStatistic(results, allResults);
      updateStaticGame(auth.token, auth.userId, calcInfo, 'Voice');
    }
  }

  function playAudio() {
    new Audio(AUDIO_HOST + words[wordsIndex].audio).play();
    setWord(words[wordsIndex]);
    setWordsIndex(wordsIndex + 1);
    setClick(true);
  }

  const generateList = () => {
    if (words.length === 0) return [];
    const randomWords = shuffleWord(words.filter((el) => el !== words[wordsIndex])).slice(0, 3);
    const list = shuffleWord(randomWords.concat(words[wordsIndex]));

    setPageList(list);
    setDisableNext(true);
    playAudio();
    return list;
  };

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

      if (currentPage !== null) {
        newWords = newWords.filter((el) => el.userWord?.optional?.learned !== true);
        newWords = await addMoreWords(newWords, auth, currentGroup, page - 1);
      }
    } else {
      newWords = await wordApi.getWords(currentGroup, page);
    }

    setWords(shuffleWord(newWords));

    setClick(false);
    setDisableNext(true);
  }

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    generateList();
  }, [words]);

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
    }, 500);

    allResults.push(obj.answer);

    const res = results.get(word as Word);
    if (res) {
      if (obj.answer) res.correct += 1;
      else res.incorrect += 1;
    } else {
      results.set(word as Word, { correct: +obj.answer, incorrect: +!obj.answer });
    }

    if (wordsIndex >= words.length) {
      recordWordsStatics(auth, 'voice', results);
      setFinish('finish');
      setStaticGame();
    }
    setDisableNext(false);
  }

  function renderList(el: Word) {
    return (
      <li className="answer-item" key={el.id || el._id}>
        <button
          type="button"
          className="answer-item__button"
          onClick={() => (click === true ? isRightAnswer(el) : 0)}
          onKeyDown={() => (click === true ? isRightAnswer(el) : 0)}
        >
          {`${pageList.indexOf(el) + 1}: ${el.wordTranslate}`}
        </button>
      </li>
    );
  }

  const startAgain = () => {
    loadWords();
    setWordsIndex(0);
    setFinish('');
    setAllResults([]);
    setResults(new Map());
    setDisableNext(true);
  };

  useEffect(() => {
    const onKeypress = (e: KeyboardEvent) => {
      if (Number(e.key) < 5) {
        isRightAnswer(pageList[Number(e.key) - 1]);
      }
      if (e.key === 'Enter' && !isDisabledNext && !isFinish) {
        generateList();
      }
      if (e.key === 'Enter' && isFinish === 'finish') {
        startAgain();
      }
    };

    document.addEventListener('keypress', onKeypress);

    return () => {
      document.removeEventListener('keypress', onKeypress);
    };
  });

  return (
    <div className="round-container">
      <div className={`game-container ${itemColorClass}`}>
        <img className="sound-picture" src={sound} alt="sound" />

        <ul className="answer-list">{pageList.map((el) => renderList(el))}</ul>
        <button
          type="button"
          className="next-button"
          disabled={isDisabledNext}
          onClick={() => generateList()}
        >
          Далее
        </button>
        {isFinish && <GameResults results={results} startAgainClick={startAgain} />}
      </div>
    </div>
  );
}
