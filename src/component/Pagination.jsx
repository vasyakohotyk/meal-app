import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const createPageArray = () => {
    const pages = [];
    if (totalPages <= 10) {
      // Якщо сторінок менше або рівно 10, показуємо всі
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Якщо сторінок більше 10
      const leftRange = Math.max(1, currentPage - 3); // Зліва від поточної сторінки
      const rightRange = Math.min(totalPages, currentPage + 3); // Справа від поточної сторінки

      for (let i = leftRange; i <= rightRange; i++) {
        pages.push(i);
      }

      if (leftRange > 1) pages.unshift('...'); // Якщо є пропуск до початку
      if (rightRange < totalPages) pages.push('...'); // Якщо є пропуск до кінця
    }
    return pages;
  };

  const pagesToShow = createPageArray();

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pagesToShow.map((pg, index) => {
        if (pg === '...') {
          return <span key={index}>...</span>;
        }
        return (
          <button
            key={pg}
            onClick={() => onPageChange(pg)}
            className={pg === currentPage ? 'active' : ''}
          >
            {pg}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
