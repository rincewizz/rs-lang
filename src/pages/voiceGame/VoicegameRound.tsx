import React, { useEffect, useState } from 'react';
import './voicegameRound.scss';
import { Answer, IGameResults, Word } from '../../types';
import { wordApi } from '../../services/api/Words';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useGamesStore from '../../services/storage/Games';

import { AUDIO_HOST } from '../../services/env';
import { calcStatistic, recordWordsStatics, updateStaticGame } from '../../utils';
import GameResults from '../../components/shared/GameResults';

export default function VoiceGameRound() {
  const [words, setWords] = useState<Word[]>([]);
  const [pageList, setList] = useState<Word[]>([]);
  const [word, setWord] = useState<Word>();
  const [result, setResult] = useState<Answer[]>([]);
  const [results, setResults] = useState<IGameResults>(new Map());
  const [allResults, setAllResults] = useState<boolean[]>([]);
  const [click, setClick] = useState<boolean>();
  const [isFinish, setFinish] = useState<string>();
  const [isDisabledAudio, setDisableAudio] = useState<boolean>();
  const [isDisabledNext, setDisableNext] = useState<boolean>();
  const [itemColorClass, setItemColorClass] = useState<string>();

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const currentPage = useGamesStore((state) => state.page);
  const currentGroup = useGamesStore((state) => state.group);

  async function setStaticGame() {
    if (isAuth && auth.token && auth.userId) {
      const calcInfo = calcStatistic(result.length, allResults);
      updateStaticGame(auth.token, auth.userId, calcInfo, 'Voice');
    }
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
    setList(newWords.slice(0, 4));
    setClick(false);
    setDisableAudio(false);
    setDisableNext(true);
  }

  useEffect(() => {
    loadWords();
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

    const res = results.get(word as Word);
    if (res) {
      if (obj.answer) res.correct += 1;
      else res.incorrect += 1;
    } else {
      results.set(word as Word, { correct: +obj.answer, incorrect: +!obj.answer });
    }

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
      recordWordsStatics(auth, 'voice', results);
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

  const startAgain = () => {
    setFinish('');
    setResult([]);
    setAllResults([]);
    setResults(new Map());
    setDisableAudio(false);
    setDisableNext(true);
  };

  return (
    <div className="round-container">
      <div className="game-container">
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
        {isFinish && <GameResults results={results} startAgainClick={startAgain} />}
      </div>
    </div>
  );
}
