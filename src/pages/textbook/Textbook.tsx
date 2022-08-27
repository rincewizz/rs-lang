/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { wordApi } from '../../services/api/Words';
import Pagination from '../../components/shared/Pagination';
import './style.scss';
import Footer from '../../components/shared/Footer';
import Header from '../../components/shared/Header';
import Sidebar from '../../components/shared/Sidebar';
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

  const setGameState = useGamesStore((state) => state.setGameState);
  setGameState({ page: currentPage, group: currentGroup });

  const [learnedCount, setLearnedCount] = useState(0);
  const [isLearnedPage, setIsLearnedPage] = useState(false);

  const [playStatus, setPlayStatus] = useState(false);

  const auth = useAuthStore((state) => state.auth);

  const isAuth = auth.message === 'Authenticated';

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

      setLearnedCount(
        newWords.filter(
          (el) => el.userWord?.optional?.learned || el.userWord?.difficulty === 'difficult'
        ).length
      );
    } else {
      newWords = await wordApi.getWords(group, page);
    }

    setWords(newWords);
    setCurrentPage(page);
    setCurrentGroup(group);
    setGameState({ page: currentPage, group: currentGroup });
  }

  async function loadDifficultWords() {
    let newWords;
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
      setLearnedCount(0);
      setGameState({ page: currentPage, group: currentGroup });
    }
  }

  useEffect(() => {
    if (currentGroup !== 6) {
      loadWords(currentGroup, currentPage);
    } else {
      loadDifficultWords();
    }
  }, []);

  useEffect(() => {
    if (learnedCount === 20) {
      setIsLearnedPage(true);
    } else {
      setIsLearnedPage(false);
    }
  }, [learnedCount]);

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
      <Sidebar />
      <Header />
      <main className="textbook container">
        <h1>Учебник</h1>
        <WordGroup
          currentGroup={currentGroup}
          onClickWordGroup={handleWordGroupClick}
          onClickDifficultWordGroup={handleDifficultWordGroupClick}
        />
        <h2>Слова</h2>
        <div className="textbook__words">
          {' '}
          {words.length ? renderWords() : 'В этом разделе еще нет слов'}
        </div>
        {currentGroup !== 6 && (
          <Pagination currentPage={currentPage} onClickPagination={handleWordPageClick} />
        )}
        <TextBookGames isLearnedPage={isLearnedPage} />
      </main>
      <Footer />
    </div>
  );
}
