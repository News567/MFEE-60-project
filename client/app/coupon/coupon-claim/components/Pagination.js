"use client";
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (page, e) => {
    e.preventDefault();
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="pagination-info mt-4">顯示 第1-12張 / 共72張 優惠券</div>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a
              className="page-link"
              href="#"
              onClick={(e) => handlePageClick(1, e)}
              aria-label="First"
            >
              <i className="fas fa-angle-double-left" />
            </a>
          </li>
          <li className="page-item">
            <a
              className="page-link"
              href="#"
              onClick={(e) => handlePageClick(currentPage - 1, e)}
              aria-label="Previous"
            >
              <i className="fas fa-angle-left" />
            </a>
          </li>
          <li className="page-item active">
            <span className="page-link">{currentPage}</span>
          </li>
          <li className="page-item">
            <a
              className="page-link"
              href="#"
              onClick={(e) => handlePageClick(currentPage + 1, e)}
              aria-label="Next"
            >
              <i className="fas fa-angle-right" />
            </a>
          </li>
          <li className="page-item">
            <a
              className="page-link"
              href="#"
              onClick={(e) => handlePageClick(totalPages, e)}
              aria-label="Last"
            >
              <i className="fas fa-angle-double-right" />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
