'use client';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  const getVisiblePages = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisible = isMobile ? 3 : 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-wrap justify-center items-center gap-1 sm:gap-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-500 text-white disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {!visiblePages.includes(1) && (
        <>
          <PageButton page={1} currentPage={currentPage} onClick={() => onPageChange(1)} />
          {visiblePages[0] > 2 && <span className="px-1 sm:px-2">...</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <PageButton
          key={page}
          page={page}
          currentPage={currentPage}
          onClick={() => onPageChange(page)}
        />
      ))}

      {!visiblePages.includes(totalPages) && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-1 sm:px-2">...</span>
          )}
          <PageButton
            page={totalPages}
            currentPage={currentPage}
            onClick={() => onPageChange(totalPages)}
          />
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-500 text-white disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        &gt;
      </button>
    </motion.div>
  );
}

interface PageButtonProps {
  page: number;
  currentPage: number;
  onClick: () => void;
}

function PageButton({ page, currentPage, onClick }: PageButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md text-sm sm:text-base ${
        page === currentPage
          ? 'bg-orange-500 text-white font-medium'
          : 'bg-gray-700 text-white hover:bg-gray-600'
      } transition-all duration-200`}
      aria-label={`Page ${page}`}
      aria-current={page === currentPage ? 'page' : undefined}
    >
      {page}
    </motion.button>
  );
}
