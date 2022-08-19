import React, { useEffect, useState } from 'react';
import { getWords } from '../../services/api/Words';
import { Word } from '../../types';
import Pagination from '../../components/shared/Pagination';
import './style.scss';
import WordGroup from '../../components/WordGroup';
import Footer from '../../components/shared/Footer';
import Header from '../../components/shared/Header';

export default function Textbook() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  async function loadWords(group = 0, page = 0) {
    const newWords = await getWords(group, page);
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
      <Header />
      <main className="textbook container">
        <h1>Учебник</h1>
        <WordGroup currentGroup={currentGroup} onClickWordGroup={handleWordGroupClick} />

        <h2>Слова</h2>
        <div className="textbook__words">
          {words.map((el) => (
            <div key={el.id}>{el.word}</div>
          ))}
        </div>
        <Pagination currentPage={currentPage} onClickPagination={handleWordPageClick} />
      </main>
      <Footer />
    </>
  );
}
