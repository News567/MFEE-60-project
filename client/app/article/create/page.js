"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import articleForm from "../components/articleForm"; // 引入表單組件
import "../components/articleCreate.css";

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
       
          <articleForm categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
