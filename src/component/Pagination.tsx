import React from 'react';
import { JSX } from 'react/jsx-runtime';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPagination = () => {
    let pages: JSX.Element[] = [];

    if (totalPages > 7) {
      // Перші 7 сторінок
      for (let i = 1; i <= 7; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }

      // Якщо більше ніж 7 сторінок, додаємо "..."
      if (currentPage < totalPages - 3) {
        pages.push(<span key="ellipsis-start">...</span>);
      }

      // Остання сторінка
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          disabled={totalPages === currentPage}
        >
          {totalPages}
        </button>
      );
    } else {
      // Якщо сторінок менше або рівно 7, просто відображаємо їх
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &#60; Prev
      </button>
      {renderPagination()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &#62;
      </button>
    </div>
  );
};

export default Pagination;
