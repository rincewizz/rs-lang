/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import './wordcard.scss';
import soundIco from '../assets/img/sound.svg';

const HOST = 'http://localhost:8082/';
export default function WordGroup(props: {
  word: Word;
  playStatus: boolean;
  setPlayStatus: (status: boolean) => void;
}) {
  const { word, playStatus, setPlayStatus } = props;

  const [audio] = useState(new Audio());
  const audioArr = [word.audio, word.audioMeaning, word.audioExample];
  const [audioIndex, setAudioIndex] = useState(-1);

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
      </div>
    </div>
  );
}
