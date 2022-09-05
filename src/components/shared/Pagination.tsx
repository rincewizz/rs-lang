import React from 'react';
import './pagination.scss';

export default function Pagination(props: {
  currentPage: number;
  onClickPagination: (arg: number) => void;
}) {
  const { currentPage, onClickPagination } = props;
  const handlePrevClick = () => {
    onClickPagination(currentPage - 1);
  };

  const handleNextClick = () => {
    onClickPagination(currentPage + 1);
  };

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={handlePrevClick}
        className="pagination__control pagination__control--prev"
        disabled={currentPage < 1}
      >
        ←
      </button>
      <div className="pagination__page">{currentPage + 1}</div>
      <button
        type="button"
        onClick={handleNextClick}
        className="pagination__control pagination__control--next"
        disabled={currentPage > 28}
      >
        →
      </button>
    </div>
  );
}
