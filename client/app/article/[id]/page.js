"use client";
import React from "react";
import ArticleDetail from "../components/articleDetail";
import Sidebar from "../components/sidebar";
import "./article.css";
import "../components/articleAside.css";

export default function ArticlePage() {
  return (
    <div className="container mt-4">
      <div className="row">
        <Sidebar />
        <ArticleDetail />
      </div>
    </div>
  );
}
