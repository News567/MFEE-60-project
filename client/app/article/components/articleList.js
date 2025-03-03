"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "./articleList.css";
import "./articleAside.css";
import Sidebar from "./sidebar";
import ArticleCard from "./articleCard";
import useLocalStorage from "../../hooks/use-localstorage.js"; // 用戶登入

const API_BASE_URL = "http://localhost:3005/api";

const ArticleListPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  // 搜尋
  const [searchQuery, setSearchQuery] = useState(""); // 搜尋框的輸入值
  const [filteredArticles, setFilteredArticles] = useState([]); // 篩選後的文章

  const handleSearch = () => {
    if (!searchQuery) {
      // 如果搜尋框為空，顯示所有文章
      setFilteredArticles(articles);
      return;
    }

    // 篩選出 title 或 content 包含搜尋文字的文章
    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredArticles(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery(""); // 清空搜尋框
    setFilteredArticles(articles); // 重置搜尋結果為所有文章
  };

  // 文章篩選選項
  const [sortOption, setSortOption] = useState("all"); // 初始值為 all，表示顯示所有文章
  const [isMyArticles, setIsMyArticles] = useState(false); // 控制是否顯示「我的文章」
  const [statusOption, setStatusOption] = useState("all"); // 新增狀態篩選的狀態

  // 獲取用戶的 ID
  const [usersId, setUsersId] = useState(54); // 改為固定值 54
  const [loading, setLoading] = useState(true); // 新增 loading 狀態，防止渲染前頁面顯示不一致

  // 當 userId 改變時才會進行更新
  useEffect(() => {
    if (usersId !== null) {
      setLoading(false);
    }
  }, [usersId]);

  //刷新页面后保持我的文章选择
  useEffect(() => {
    setIsMyArticles(searchParams.get("myArticles") === "true");
  }, [searchParams]);

  // 修正依賴陣列，保持一致性
  useEffect(() => {
    const fetchArticles = async () => {
      const page = parseInt(searchParams.get("page")) || 1;
      const category = searchParams.get("category");
      const tag = searchParams.get("tag");
      const sort = searchParams.get("sort");
      const status = searchParams.get("status"); // 新增狀態篩選

      let url = `${API_BASE_URL}/article`; // 基礎 URL
      const params = new URLSearchParams(); // 使用 URLSearchParams 來管理查詢參數

      // 添加分頁參數
      params.set("page", page);
      params.set("limit", 10);

      // 添加分類參數
      if (category) {
        params.set("category", category);
      }

      // 添加標籤參數
      if (tag) {
        params.set("tag", tag);
      }

      // 添加排序參數
      if (sort) {
        params.set("sort", sort);
      }

      // 添加文章發表狀態參數
      if (status) {
        params.set("status", status);
      }

      // 如果是「我的文章」，添加 users_id 參數
      if (isMyArticles && usersId) {
        params.set("users_id", usersId);
      }

      // 將查詢參數附加到 URL
      url += `?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.pagination) {
        console.error("Pagination data is missing in API response");
        return;
      }

      setArticles(data.data);
      setPagination({
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
      });
    };

    // 確保用戶已經登入或載入完成
    if (!loading) {
      fetchArticles();
    }
  }, [searchParams, sortOption, isMyArticles, usersId, loading]); // 確保依賴陣列正確

  // 切換頁面
  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page); // 更新 URL 的 page 參數
    router.push(`?${params.toString()}`); // 更新網址，觸發 useEffect
  };

  // 處理篩選條件變更
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOption(newSort);

    const params = new URLSearchParams(searchParams);

    // 更新排序條件
    if (newSort === "all") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }

    // 更新網址
    router.push(`/article?${params.toString()}`);
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusOption(newStatus);

    const params = new URLSearchParams(searchParams);

    // 更新狀態條件
    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }

    // 更新網址
    router.push(`/article?${params.toString()}`);
  };

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  // 我的文章 按鈕點擊
  const handleMyArticlesClick = () => {
    if (!usersId) {
      alert("請先登入才能查看我的文章");
      return;
    }

    setIsMyArticles(!isMyArticles);
    setShowStatusFilter(!isMyArticles); // 顯示或隱藏狀態篩選器

    const params = new URLSearchParams(searchParams);

    if (!isMyArticles) {
      params.set("myArticles", "true"); // 如果是我的文章，加入參數
    } else {
      params.delete("myArticles"); // 如果取消我的文章，移除參數
      router.push("/article"); // 返回文章列表首頁
    }

    router.push(`?${params.toString()}`); // 更新網址
  };

  //新增文章 按鈕跳轉
  const handleButtonClick = (path) => {
    router.push(path);
  };

  if (!articles) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <Sidebar />

        <div className="article-list col-9">
          <div className="article-controls">
            {/* 篩選 */}
            <div className="filter">
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="form-select"
              >
                <option value="all">所有文章</option>
                <option value="newest">最新文章</option>
                <option value="oldest">最舊文章</option>
                <option value="popular">熱門文章</option>
              </select>
              {showStatusFilter && (
                <select
                  value={statusOption}
                  onChange={handleStatusChange}
                  className="form-select"
                >
                  <option value="all">所有文章</option>
                  <option value="published">已發表</option>
                  <option value="draft">草稿夾</option>
                </select>
              )}
            </div>
            {/* 搜尋框 */}
            <div className="article-search-box">
              <input
                type="text"
                placeholder="搜尋文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* 清空按鈕 */}
              {searchQuery && (
                <button className="clear-button" onClick={handleClearSearch}>
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
              <button className="search-button" onClick={handleSearch}>
                搜尋
              </button>
            </div>

            {/* 跳頁面btn */}
            <div className="article-controls-btn">
              <button
                className="btn"
                onClick={() => handleButtonClick("/article/create")}
              >
                {" "}
                <span className="btn-icon">
                  <i className="fa-solid fa-pen"></i>
                </span>
                新增文章
              </button>
              <button className="btn" onClick={handleMyArticlesClick}>
                <span className="btn-icon">
                  <i className="fa-solid fa-bookmark"></i>
                </span>
                {isMyArticles ? "返回列表" : "我的文章"}
              </button>
            </div>
          </div>

          {/* 文章card */}
          {(searchQuery ? filteredArticles : articles).map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isMyArticles={isMyArticles} // 傳遞 isMyArticles
              onDeleteSuccess={() => {
                // 刪除成功後，重新載入文章
                setArticles((prevArticles) =>
                  prevArticles.filter((a) => a.id !== article.id)
                );
                setFilteredArticles((prevFilteredArticles) =>
                  prevFilteredArticles.filter((a) => a.id !== article.id)
                );
              }}
            />
          ))}
          {/* 分頁 */}
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
