import React from "react";

/**
 * Pagination component for handling navigation between pages
 * @param {Object} props - Component properties
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback function when page changes
 * @param {boolean} props.loading - Loading state
 */
export default function Pagination({ currentPage, totalPages, onPageChange, loading }) {
  // Calculate if we should show the previous button (only when not on first page)
  const canGoPrev = currentPage > 1;
  
  // Calculate if we should show the next button (only when not on last page)
  const canGoNext = currentPage < totalPages;

  /**
   * Handle clicking the previous button
   */
  const handlePrev = () => {
    if (canGoPrev && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * Handle clicking the next button
   */
  const handleNext = () => {
    if (canGoNext && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  // Don't show pagination if there are no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev || loading}
          className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
            canGoPrev && !loading 
              ? "bg-white text-gray-700 hover:bg-gray-50" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext || loading}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
            canGoNext && !loading 
              ? "bg-white text-gray-700 hover:bg-gray-50" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={handlePrev}
              disabled={!canGoPrev || loading}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                canGoPrev && !loading 
                  ? "cursor-pointer" 
                  : "cursor-not-allowed bg-gray-100"
              }`}
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page numbers would go here if we wanted to show them */}
            
            <button
              onClick={handleNext}
              disabled={!canGoNext || loading}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                canGoNext && !loading 
                  ? "cursor-pointer" 
                  : "cursor-not-allowed bg-gray-100"
              }`}
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}