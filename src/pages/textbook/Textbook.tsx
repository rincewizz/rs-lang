import React, { useEffect, useState } from 'react';
import { wordApi } from '../../services/api/Words';
import { Word } from '../../types';
import Pagination from '../../components/shared/Pagination';
import './style.scss';
import WordGroup from '../../components/WordGroup';
import Footer from '../../components/shared/Footer';
import Header from '../../components/shared/Header';
import WordCard from '../../components/WordCard';
import Sidebar from '../../components/shared/Sidebar';

export default function Textbook() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  async function loadWords(group = 0, page = 0) {
    const newWords = await wordApi.getWords(group, page);
    setWords(newWords);
    setCurrentPage(page);
    setCurrentGroup(group);
  }

  useEffect(() => {
    loadWords();
  }, []);

  const handleWordGroupClick = async (id: number) => {
    loadWords(id - 1, 0);
  };

  const handleWordPageClick = async (page: number) => {
    if (page < 0 || page > 29) return;
    setCurrentPage(page);
    loadWords(currentGroup, page);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <main className="textbook container">
        <h1>Учебник</h1>
        <WordGroup currentGroup={currentGroup} onClickWordGroup={handleWordGroupClick} />

        <h2>Слова</h2>
        <div className="textbook__words">
          {words.map((el) => (
            <WordCard key={el.id} word={el} playStatus={playStatus} setPlayStatus={setPlayStatus} />
          ))}
        </div>
        <Pagination currentPage={currentPage} onClickPagination={handleWordPageClick} />
      </main>
      <Footer />
    </>
  );
}
