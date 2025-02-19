"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./articleList.css";
import "./articleAside.css";

import Sidebar from "./sidebar";
import ArticleCard from "./articleCard";

const API_BASE_URL = "http://localhost:3005/api";

const ArticleListPage = () => {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const category = searchParams.get("category");
      const tag = searchParams.get("tag");

      let url = `${API_BASE_URL}/article`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      if (tag) {
        url += `?tag=${encodeURIComponent(tag)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.data);
    };

    fetchArticles();
  }, [searchParams]);

  if (!articles) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mt-4">
      {/* Grid Layout */}
      <div className="row">
        {/* Left Aside (1/4) */}
        <Sidebar />

        {/* Right Article List (3/4) */}
        <div className="article-list col-9">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}

          {/* Pagination */}
          <div className="custom-pagination">
            <div className="page-item">
              <a href="#" className="page-link" aria-label="First">
                &laquo;&laquo;
              </a>
            </div>
            <div className="page-item">
              <a href="#" className="page-link" aria-label="Previous">
                &laquo;
              </a>
            </div>
            <div className="page-item">
              <a href="#" className="page-link">
                1
              </a>
            </div>
            <div className="page-item active">
              <a href="#" className="page-link">
                2
              </a>
            </div>
            <div className="page-item">
              <a href="#" className="page-link">
                3
              </a>
            </div>
            <div className="page-item">
              <a href="#" className="page-link" aria-label="Next">
                &raquo;
              </a>
            </div>
            <div className="page-item">
              <a href="#" className="page-link" aria-label="Last">
                &raquo;&raquo;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleListPage;
