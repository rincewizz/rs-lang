/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { wordApi } from '../../services/api/Words';
import { Word } from '../../types';
import Pagination from '../../components/shared/Pagination';
import './style.scss';
import Footer from '../../components/shared/Footer';
import Header from '../../components/shared/Header';
import Sidebar from '../../components/shared/Sidebar';
import WordGroup from '../../components/feature/WordGroup';
import WordCard from '../../components/feature/WordCard';
import { usersAggregatedWordsApi } from '../../services/api/UsersAggregatedWords';
import useAuthStore from '../../services/storage/Auth';
import Form from '../../components/feature/Form';

export default function Textbook() {
  const [visible, setVis] = useState(false);
  const handleClick = () => {
    setVis((curVal) => !curVal);
  };

  const [words, setWords] = useState<Word[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
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
    } else {
      newWords = await wordApi.getWords(group, page);
    }

    setWords(newWords);
    setCurrentPage(page);
    setCurrentGroup(group);
  }

  async function loadDifficultWords() {
    let newWords;
    if (isAuth && auth.token && auth.userId) {
      const agrwords = await usersAggregatedWordsApi.getAggregatedWords({
        token: auth.token,
        userId: auth.userId,
        filter: '{"userWord.difficulty":"difficult"}',
      });

      newWords = agrwords.paginatedResults;
      setWords(newWords);

      setCurrentGroup(6);
    }
  }

  useEffect(() => {
    loadWords();
  }, []);

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

  return (
    <>
      <Sidebar />
      <Header handleClick={handleClick} />
      {visible && <Form handleClick={handleClick} />}
      <main className="textbook container">
        <h1>Учебник</h1>
        <WordGroup
          currentGroup={currentGroup}
          onClickWordGroup={handleWordGroupClick}
          onClickDifficultWordGroup={handleDifficultWordGroupClick}
        />

        <h2>Слова</h2>
        <div className="textbook__words">
          {words.map((el) => (
            <WordCard
              key={el.id || el._id}
              word={el}
              playStatus={playStatus}
              setPlayStatus={setPlayStatus}
            />
          ))}
        </div>
        <Pagination currentPage={currentPage} onClickPagination={handleWordPageClick} />
      </main>
      <Footer />
    </>
  );
}
