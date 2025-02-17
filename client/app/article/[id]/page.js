"use client";
import React, { useState, useEffect } from "react";
import "./article.css";
import "../components/articleAside.css";

import ArticleDetail from "../components/articleDetail";
import Sidebar from "../components/sidebar";

const ArticlePage = () => {
  return (
    <div className="container mt-4">
      {/* Grid Layout */}
      <div className="row">
        {/* Left Aside (1/4) */}
        <Sidebar />

        {/* Right Article List (3/4) */}
        <div className="article col-9">
          {articles.map((article) => (
            <ArticleDetail key={article.id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
