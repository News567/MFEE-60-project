"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./articleList.css";
import "./articleAside.css";

import Sidebar from "./sidebar";
import ArticleCard from "./articleCard";

const API_BASE_URL = "http://localhost:3005/api";

const ArticleListPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  useEffect(() => {
    const fetchArticles = async () => {
      const page = parseInt(searchParams.get("page")) || 1;
      const category = searchParams.get("category");
      const tag = searchParams.get("tag");

      let url = `${API_BASE_URL}/article?page=${page}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (tag) url += `&tag=${encodeURIComponent(tag)}`;

      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.data);
      setPagination({
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
      });
    };

    fetchArticles();
  }, [searchParams]);

  // 切換頁面
  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`?${params.toString()}`);
  };

  if (!articles) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <Sidebar />

        <div className="article-list col-9">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}

          {/* 分頁按鈕 */}
          <div className="custom-pagination">
            <div className="page-item">
              <button
                className="page-link"
                aria-label="First"
                onClick={() => goToPage(1)}
                disabled={pagination.currentPage === 1}
              >
                &laquo;&laquo;
              </button>
            </div>
            <div className="page-item">
              <button
                className="page-link"
                aria-label="Previous"
                onClick={() => goToPage(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                &laquo;
              </button>
            </div>

            {/* 當前頁面與前後頁數 */}
            {pagination.currentPage > 1 && (
              <div className="page-item">
                <button
                  className="page-link"
                  onClick={() => goToPage(pagination.currentPage - 1)}
                >
                  {pagination.currentPage - 1}
                </button>
              </div>
            )}
            <div className="page-item active">
              <button className="page-link">{pagination.currentPage}</button>
            </div>
            {pagination.currentPage < pagination.totalPages && (
              <div className="page-item">
                <button
                  className="page-link"
                  onClick={() => goToPage(pagination.currentPage + 1)}
                >
                  {pagination.currentPage + 1}
                </button>
              </div>
            )}

            <div className="page-item">
              <button
                className="page-link"
                aria-label="Next"
                onClick={() => goToPage(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                &raquo;
              </button>
            </div>
            <div className="page-item">
              <button
                className="page-link"
                aria-label="Last"
                onClick={() => goToPage(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                &raquo;&raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleListPage;
