/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { wordApi } from '../../services/api/Words';
import Pagination from '../../components/shared/Pagination';
import './style.scss';
import Footer from '../../components/shared/Footer';
import Header from '../../components/shared/Header';
import WordGroup from '../../components/feature/WordGroup';
import WordCard from '../../components/feature/WordCard';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import useTextbookStore from '../../services/storage/Textbook';
import useWordsStore from '../../services/storage/Words';
import TextBookGames from '../../components/feature/TextBookGames';
import useGamesStore from '../../services/storage/Games';

export default function Textbook() {
  const words = useWordsStore((state) => state.words);
  const setWords = useWordsStore((state) => state.setWords);

  const currentGroup = useTextbookStore((state) => state.group);
  const setCurrentGroup = useTextbookStore((state) => state.setGroup);

  const currentPage = useTextbookStore((state) => state.page);
  const setCurrentPage = useTextbookStore((state) => state.setPage);

  const setGamePage = useGamesStore((state) => state.setPage);
  const setGameGroup = useGamesStore((state) => state.setGroup);

  const [learnedCount, setLearnedCount] = useState(0);
  const [isLearnedPage, setIsLearnedPage] = useState(false);

  const [playStatus, setPlayStatus] = useState(false);

  const auth = useAuthStore((state) => state.auth);

  const [isAuth, setIsAuth] = useState(auth.message === 'Authenticated');
  const [loading, setLoadnig] = useState(false);

  async function loadWords(group = 0, page = 0) {
    let newWords;
    setLoadnig(true);
    if (isAuth && auth.token && auth.userId) {
      const agrwords = await usersAggregatedWordsApi.getAggregatedWords({
        token: auth.token,
        userId: auth.userId,
        group,
        page,
        perPage: 20,
      });

      newWords = agrwords.paginatedResults;

      setLearnedCount(
        newWords.filter(
          (el) => el.userWord?.optional?.learned || el.userWord?.difficulty === 'difficult'
        ).length
      );
    } else {
      newWords = await wordApi.getWords(group, page);
      setLearnedCount(0);
    }

    setWords(newWords);
    setCurrentPage(page);
    setCurrentGroup(group);
    setLoadnig(false);
  }

  async function loadDifficultWords() {
    let newWords;
    setLoadnig(true);
    if (isAuth && auth.token && auth.userId) {
      const agrwords = await usersAggregatedWordsApi.getAggregatedWords({
        token: auth.token,
        userId: auth.userId,
        perPage: 99999,
        filter: '{"userWord.difficulty":"difficult"}',
      });

      newWords = agrwords.paginatedResults;
      setWords(newWords);

      setCurrentGroup(6);
    } else {
      setWords([]);
      loadWords(0, 0);
    }
    setLearnedCount(0);
    setLoadnig(false);
  }

  useEffect(() => {
    setIsAuth(auth.message === 'Authenticated');
  }, [auth]);

  useEffect(() => {
    if (currentGroup !== 6) {
      loadWords(currentGroup, currentPage);
    } else {
      loadDifficultWords();
    }
  }, [isAuth]);

  useEffect(() => {
    if (learnedCount === 20) {
      setIsLearnedPage(true);
    } else {
      setIsLearnedPage(false);
    }
  }, [learnedCount]);

  useEffect(() => {
    setGamePage(currentPage);
    setGameGroup(currentGroup);
  }, [currentPage, currentGroup]);

  const handleWordGroupClick = async (id: number) => {
    loadWords(id - 1, 0);
  };

  const handleDifficultWordGroupClick = async () => {
    loadDifficultWords();
  };

  const handleWordPageClick = async (page: number) => {
    if (page < 0 || page > 29) return;
    setCurrentPage(page);
    loadWords(currentGroup, page);
  };

  function renderWords() {
    return words.map((el) => (
      <WordCard
        key={el.id || el._id}
        word={el}
        playStatus={playStatus}
        setPlayStatus={setPlayStatus}
        learnedCount={learnedCount}
        setLearnedCount={setLearnedCount}
      />
    ));
  }

  return (
    <div className={isLearnedPage ? 'learned-page' : ''}>
      <Header />
      <div className="main">
        <main className="textbook container">
          <h2 className="title-page">Учебник</h2>
          <WordGroup
            currentGroup={currentGroup}
            onClickWordGroup={handleWordGroupClick}
            onClickDifficultWordGroup={handleDifficultWordGroupClick}
          />
          <h3 className="subtitle-page">Слова</h3>
          <div className="textbook__words">
            {loading && (
              <div className="loader-wrap">
                <span className="loader" />
              </div>
            )}
            {!loading && !words.length && 'В этом разделе еще нет слов'}
            <div className="textbook__word-container">{renderWords()}</div>
          </div>
          {currentGroup !== 6 && (
            <>
              <Pagination currentPage={currentPage} onClickPagination={handleWordPageClick} />
              <TextBookGames isLearnedPage={isLearnedPage} />
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
