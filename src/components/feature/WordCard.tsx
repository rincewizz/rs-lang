/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import { IWordCardProps } from '../../types';
import './wordcard.scss';
import soundIco from '../../assets/img/sound.svg';
import useAuthStore from '../../services/storage/Auth';
import { usersWordsApi } from '../../services/api/UsersWords';
import { AUDIO_HOST, IMAGE_HOST } from '../../services/env';
import useTextbookStore from '../../services/storage/Textbook';
import useWordsStore from '../../services/storage/Words';
import { UserWordRequest } from '../../utils';

export default function WordGroup(props: IWordCardProps) {
  const { word, playStatus, setPlayStatus, learnedCount, setLearnedCount } = props;

  const words = useWordsStore((state) => state.words);
  const setWords = useWordsStore((state) => state.setWords);

  const currentGroup = useTextbookStore((state) => state.getTextbookState().group);

  const [audio] = useState(new Audio());
  const audioArr = [word.audio, word.audioMeaning, word.audioExample];
  const [audioIndex, setAudioIndex] = useState(-1);

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';
  const [isDifficult, setDifficult] = useState(word.userWord?.difficulty === 'difficult');
  const [isLearned, setLearned] = useState(word.userWord?.optional?.learned === true);
  const [isMarkLearned, setMarkLearned] = useState(isLearned || isDifficult);
  const [isLoaded, setIsLoaded] = useState(false);

  audio.addEventListener('ended', () => setAudioIndex(audioIndex + 1));

  useEffect(() => {
    const play = () => audio.play();

    if (audioIndex >= 0 && audioIndex < audioArr.length) {
      setPlayStatus(true);
      audio.src = AUDIO_HOST + audioArr[audioIndex];

      audio.addEventListener('canplay', play);
    } else {
      setPlayStatus(false);
    }

    return () => audio.removeEventListener('canplay', play);
  }, [audioIndex]);

  const handleAudioClick = () => {
    if (!playStatus) setAudioIndex(0);
  };

  useEffect(() => {
    if (isDifficult) {
      setLearned(false);
    }
  }, [isDifficult]);

  useEffect(() => {
    if (isLearned) {
      setDifficult(false);
    }
  }, [isLearned]);

  useEffect(() => {
    setMarkLearned(isDifficult || isLearned);

    if (currentGroup === 6 && (!isDifficult || isLearned)) {
      setWords(words.filter((el) => el._id !== word._id));
    }
  }, [isLearned, isDifficult]);

  useEffect(() => {
    if (isLoaded) {
      if (isMarkLearned) {
        setLearnedCount(learnedCount + 1);
      } else {
        setLearnedCount(learnedCount - 1);
      }
    } else {
      setIsLoaded(true);
    }
  }, [isMarkLearned]);

  const handleDifficultLearnedBtnClick = async (button: 'difficult' | 'learned') => {
    if (auth.token && auth.userId && word._id) {
      let response;

      const userWordRequest = new UserWordRequest(word);
      if (button === 'difficult') {
        userWordRequest.difficulty = isDifficult ? 'none' : 'difficult';
        userWordRequest.learned = false;
      } else {
        userWordRequest.difficulty = 'none';
        userWordRequest.learned = !isLearned;
      }
      const req = {
        token: auth.token,
        userId: auth.userId,
        wordId: word._id,
        request: userWordRequest.request,
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

      if (button === 'difficult') {
        const difficultStatus = response?.difficulty === 'difficult';
        setDifficult(difficultStatus);
      }

      if (button === 'learned') {
        const learnedStatus = response?.optional?.learned === true;
        setLearned(learnedStatus);
      }
    }
  };

  return (
    <div
      className={`word-card word-card--${currentGroup} ${
        isDifficult ? 'word-card--difficult' : ''
      } ${isLearned ? 'word-card--learned' : ''}`}
    >
      <div
        className="word-card__img"
        style={{ backgroundImage: `url(${IMAGE_HOST + word.image})` }}
      />

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
            <div className="word-card__word-status">
              <button
                type="button"
                className={`word-card__btn ${isDifficult ? 'word-card__btn--active' : ''}`}
                onClick={() => handleDifficultLearnedBtnClick('difficult')}
              >
                {isDifficult ? '-' : '+'} Сложное слово
              </button>
              <button
                type="button"
                className={`word-card__btn ${isLearned ? 'word-card__btn--active' : ''}`}
                onClick={() => handleDifficultLearnedBtnClick('learned')}
              >
                {isLearned ? '-' : '+'} Изученное слово
              </button>
              {word.userWord?.optional?.new === 'new' && (
                <div className="word-card__btn word-card__new-word">Новое слово</div>
              )}
            </div>
            <div className="word-card__stats word-stats">
              <div className="word-stats__item word-stats__item--sprint">
                <div className="word-stats__title">Sprint</div>
                <div className="word-stats__answers">
                  <span
                    className="word-stats__answer word-stats__answer--correct"
                    title="количество правильных ответов"
                  >
                    {word.userWord?.optional?.gamesStatistic?.sprint.correct ?? 0}
                  </span>
                  <span
                    className="word-stats__answer word-stats__answer--incorrect"
                    title="количество неправильных ответов"
                  >
                    {word.userWord?.optional?.gamesStatistic?.sprint.incorrect ?? 0}
                  </span>
                </div>
              </div>
              <div className="word-stats__item word-stats__item--voice">
                <div className="word-stats__title">Voice</div>
                <div className="word-stats__answers">
                  <span
                    className="word-stats__answer word-stats__answer--correct"
                    title="количество правильных ответов"
                  >
                    {word.userWord?.optional?.gamesStatistic?.voice.correct ?? 0}
                  </span>
                  <span
                    className="word-stats__answer word-stats__answer--incorrect"
                    title="количество неправильных ответов"
                  >
                    {word.userWord?.optional?.gamesStatistic?.voice.incorrect ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
