"use client";
import React from "react";
import ArticleDetail from "../components/articleDetail";
import Sidebar from "../components/sidebar";
import "./article.css";
import "../components/articleAside.css";

export default function ArticlePage() {
  return (
    <div className="container mt-4">
      {/* Grid Layout */}
      <div className="row">
        {/* Left Aside (1/4) */}
        <Sidebar />

        {/* Right Article List (3/4) */}
        <div className="article col-9">
          <ArticleDetail /> {/* 渲染 ArticleDetail 組件 */}
        </div>
      </div>
    </div>
  );
}
