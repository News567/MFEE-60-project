"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import ArticleForm from "../components/articleForm"; // 引入表單組件
import "../components/articleCreate.css";
// import { createArticle, uploadArticleImage } from '../api/forum';

export default function ArticleCreate() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // 載入分類和標籤資料
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/article/create-data");
      const data = await response.json();
      setCategories(data.categories);
      setTags(data.tags);
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        <Sidebar />
        <div className="article-create col-9">
       
          <ArticleForm categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
