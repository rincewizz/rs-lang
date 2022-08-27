/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import { IWordCardProps } from '../../types';
import './wordcard.scss';
import soundIco from '../../assets/img/sound.svg';
import useAuthStore from '../../services/storage/Auth';
import { usersWordsApi } from '../../services/api/UsersWords';
import HOST from '../../services/env';
import useTextbookStore from '../../services/storage/Textbook';

export default function WordGroup(props: IWordCardProps) {
  const { word, playStatus, setPlayStatus, learnedCount, setLearnedCount } = props;

  const words = useTextbookStore((state) => state.words);
  const setWords = useTextbookStore((state) => state.setWords);

  const currentGroup = useTextbookStore((state) => state.getTextbookState().group);

  const [audio] = useState(new Audio());
  const audioArr = [word.audio, word.audioMeaning, word.audioExample];
  const [audioIndex, setAudioIndex] = useState(-1);

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const [isDifficult, setDifficult] = useState(word.userWord?.difficulty === 'difficult');
  const [isLearned, setLearned] = useState(word.userWord?.optional?.learned === true);

  audio.addEventListener('ended', () => setAudioIndex(audioIndex + 1));

  useEffect(() => {
    const play = () => audio.play();

    if (audioIndex >= 0 && audioIndex < audioArr.length) {
      setPlayStatus(true);
      audio.src = HOST + audioArr[audioIndex];

      audio.addEventListener('canplay', play);
    } else {
      setPlayStatus(false);
    }

    return () => audio.removeEventListener('canplay', play);
  }, [audioIndex]);

  const handleAudioClick = () => {
    if (!playStatus) setAudioIndex(0);
  };

  const handleDifficultBtnClick = async () => {
    if (auth.token && auth.userId && word._id) {
      let response;
      const req = {
        token: auth.token,
        userId: auth.userId,
        wordId: word._id,
        request: {
          difficulty: isDifficult ? 'none' : 'difficult',
          optional: {
            learned: false,
          },
        },
      };

      if (word.userWord) {
        response = await usersWordsApi.updateUserWord(req);
      }

      if (!word.userWord) {
        response = await usersWordsApi.createUserWord(req);
        word.userWord = {
          difficulty: response.difficulty,
          optional: response.optional,
        };
      }
      const difficultStatus = response?.difficulty === 'difficult';
      if (currentGroup === 6 && !difficultStatus) {
        setWords(words.filter((el) => el._id !== word._id));
      }
      setDifficult(difficultStatus);

      if (isLearned && difficultStatus) {
        setLearned(!isLearned);
      } else if (difficultStatus) {
        setLearnedCount(learnedCount + 1);
      } else {
        setLearnedCount(learnedCount - 1);
      }
    }
  };

  const handleLearnedBtnClick = async () => {
    if (auth.token && auth.userId && word._id) {
      let response;
      const req = {
        token: auth.token,
        userId: auth.userId,
        wordId: word._id,
        request: {
          difficulty: 'none',
          optional: {
            learned: !isLearned,
          },
        },
      };

      if (word.userWord) {
        response = await usersWordsApi.updateUserWord(req);
      }

      if (!word.userWord) {
        response = await usersWordsApi.createUserWord(req);
        word.userWord = {
          difficulty: response.difficulty,
          optional: response.optional,
        };
      }

      const learnedStatus = response?.optional?.learned === true;
      if (currentGroup === 6 && learnedStatus) {
        setWords(words.filter((el) => el._id !== word._id));
      }
      setLearned(learnedStatus);
      if (learnedStatus && isDifficult) {
        setDifficult(!isDifficult);
      } else if (learnedStatus) {
        setLearnedCount(learnedCount + 1);
      } else {
        setLearnedCount(learnedCount - 1);
      }
    }
  };

  return (
    <div
      className={`word-card word-card--${currentGroup} ${
        isDifficult ? 'word-card--difficult' : ''
      } ${isLearned ? 'word-card--learned' : ''}`}
    >
      <div className="word-card__img" style={{ backgroundImage: `url(${HOST + word.image})` }} />

      <div className="word-card__text">
        <div className="word-card__word">
          {word.word} - {word.transcription} - {word.wordTranslate}{' '}
          <button type="button" className="word-card__audio" onClick={handleAudioClick}>
            <img src={soundIco} alt="" className="word-card__audio-img" />
          </button>
        </div>
        <div className="word-card__meaning">
          <h3 className="word-card__title">Значение</h3>
          <div dangerouslySetInnerHTML={{ __html: word.textMeaning }} />
          <div>{word.textMeaningTranslate}</div>
        </div>
        <div className="word-card__example">
          <h3 className="word-card__title">Пример</h3>
          <div dangerouslySetInnerHTML={{ __html: word.textExample }} />
          <div>{word.textExampleTranslate}</div>
        </div>
        {isAuth && (
          <>
            <button
              type="button"
              className={`word-card__btn ${isDifficult ? 'word-card__btn--active' : ''}`}
              onClick={handleDifficultBtnClick}
            >
              {isDifficult ? '-' : '+'} Сложное слово
            </button>
            <button
              type="button"
              className={`word-card__btn ${isLearned ? 'word-card__btn--active' : ''}`}
              onClick={handleLearnedBtnClick}
            >
              {isLearned ? '-' : '+'} Изученное слово
            </button>
          </>
        )}
      </div>
    </div>
  );
}
