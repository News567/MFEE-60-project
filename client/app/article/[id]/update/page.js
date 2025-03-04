"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Sidebar from "../../components/sidebar";
import Edit from "../../components/edit"; // 引入編輯組件
import "../../components/articleCreate.css";

export default function ArticleUpdate() {
  const { id } = useParams(); // 獲取文章 ID
  const router = useRouter();
  const [initialData, setInitialData] = useState(null);

  // 獲取文章初始數據
  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/article/${id}`
        );
        if (response.data.status === "success") {
          setInitialData(response.data.data); // 確保數據結構正確
        } else {
          console.error("❌ 獲取文章數據失敗");
        }
      } catch (error) {
        console.error("❌ 獲取文章數據失敗：", error);
      }
    };

    fetchArticleData();
  }, [id]);

  // 處理保存
  const handleSave = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:3005/api/article/update/${id}`, // 更新 URL
        formData
      );
      if (response.data.success) {
        alert("文章更新成功！");
        router.push(`/article/${id}`);
      } else {
        alert("更新文章失敗");
      }
    } catch (error) {
      console.error("❌ 提交表單失敗：", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <Sidebar />
        <div className="article-create col-9">
          {initialData && (
            <Edit initialData={initialData} onSave={handleSave} />
          )}
        </div>
      </div>
    </div>
  );
}
