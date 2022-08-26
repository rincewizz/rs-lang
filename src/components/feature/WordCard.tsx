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
  const { word, playStatus, setPlayStatus } = props;

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
      let difficultStatus;
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
        difficultStatus = await usersWordsApi.updateUserWord(req);
      }

      if (!word.userWord) {
        difficultStatus = await usersWordsApi.createUserWord(req);
      }
      if (currentGroup === 6 && difficultStatus?.difficulty !== 'difficult') {
        setWords(words.filter((el) => el._id !== word._id));
      }
      setDifficult(difficultStatus?.difficulty === 'difficult');
      if (isLearned && difficultStatus?.difficulty === 'difficult') {
        setLearned(!isLearned);
      }
    }
  };

  const handleLearnedBtnClick = async () => {
    if (auth.token && auth.userId && word._id) {
      let learnedStatus;
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
        learnedStatus = await usersWordsApi.updateUserWord(req);
      }

      if (!word.userWord) {
        learnedStatus = await usersWordsApi.createUserWord(req);
      }
      if (currentGroup === 6 && learnedStatus?.optional?.learned === true) {
        setWords(words.filter((el) => el._id !== word._id));
      }
      setLearned(learnedStatus?.optional?.learned === true);
      if (learnedStatus?.optional?.learned === true && isDifficult) {
        setDifficult(!isDifficult);
      }
    }
  };

  return (
    <div className="word-card">
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
            <button type="button" onClick={handleDifficultBtnClick}>
              {isDifficult ? '-' : '+'} Сложное слово
            </button>
            <button type="button" onClick={handleLearnedBtnClick}>
              {isLearned ? '-' : '+'} Изученное слово
            </button>
          </>
        )}
      </div>
    </div>
  );
}
