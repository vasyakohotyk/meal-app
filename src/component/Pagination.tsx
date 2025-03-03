import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, limit, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / limit); // Загальна кількість сторінок

  const createPageArray = () => {
    const pages: (number | string)[] = [];

    // Якщо кількість сторінок менша або рівна 10, відображаємо всі
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftRange = Math.max(1, currentPage - 3); // Ліва межа
      const rightRange = Math.min(totalPages, currentPage + 3); // Правая межа

      // Додаємо сторінки між лівою та правою межею
      for (let i = leftRange; i <= rightRange; i++) {
        pages.push(i);
      }

      // Якщо є пропуск до початку, додаємо '...'
      if (leftRange > 1) pages.unshift('...');

      // Якщо є пропуск до кінця, додаємо '...'
      if (rightRange < totalPages) pages.push('...');
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

      {pagesToShow.map((pg, index) => (
        <React.Fragment key={index}>
          {pg === '...' ? (
            <span>...</span> // Відображення '...' для пропусків
          ) : (
            <button
              onClick={() => onPageChange(pg as number)} // Приводимо до типу number
              className={pg === currentPage ? 'active' : ''}
            >
              {pg}
            </button>
          )}
        </React.Fragment>
      ))}

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
