'use client';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  // Generate page numbers with limits for large page counts
  const getVisiblePages = () => {
    const maxVisible = 5; // Show max 5 page buttons
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust if we're at the beginning or end
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
      className="flex items-center gap-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:bg-gray-500 text-white disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {/* Show first page if not in visible range */}
      {!visiblePages.includes(1) && (
        <>
          <PageButton 
            page={1} 
            currentPage={currentPage}
            onClick={() => onPageChange(1)}
          />
          {visiblePages[0] > 2 && <span className="px-2">...</span>}
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

      {/* Show last page if not in visible range */}
      {!visiblePages.includes(totalPages) && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2">...</span>
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
        disabled={currentPage === totalPages}
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
      className={`w-10 h-10 flex items-center justify-center rounded-md ${
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