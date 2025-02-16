"use client";
import React, { useEffect, useState } from "react";
import "./articleList.css";
import "./articleAside.css";


import ArticleCard from "./articleCard";

const API_BASE_URL = "http://localhost:3005/api";

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // 客戶端請求文章資料
    const fetchArticles = async () => {
      const res = await fetch("http://localhost:3005/api/article");

      const data = await res.json();
      setArticles(data.data); // 根據後端返回的結構設定
    };

    fetchArticles();
  }, []);

  if (!articles) {
    return <div>載入中...</div>;
  }

  return (
    <div className="container mt-4">
      {/* Grid Layout */}
      <div className="row">
        {/* Left Aside (1/4) */}
        <aside className="col-3">
          {/* aside-category1 */}
          <div className="aside-category1 p-2 mb-2">
            <div className="aside-title">官方資訊</div>
            <div className="aside-category-list">
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category1-title1">活動與促銷</div>
                <div className="aside-category-amount aside-category1-amount1">
                  (<span>10</span>)
                </div>
              </div>
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category1-title2">潛水教育</div>
                <div className="aside-category-amount aside-category1-amount2">
                  (<span>20</span>)
                </div>
              </div>
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category1-title3">安全與規範</div>
                <div className="aside-category-amount aside-category1-amount3">
                  (<span>5</span>)
                </div>
              </div>
            </div>
          </div>

          {/* aside-category2 */}
          <div className="aside-category2 p-2 mb-2">
            <div className="aside-title">課程與體驗</div>
            <div className="aside-category-list">
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category2-title1">體驗潛水</div>
                <div className="aside-category-amount aside-category2-amount1">
                  (<span>10</span>)
                </div>
              </div>
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category2-title2">潛水課程</div>
                <div className="aside-category-amount aside-category2-amount2">
                  (<span>20</span>)
                </div>
              </div>
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category2-title3">旅遊潛水</div>
                <div className="aside-category-amount aside-category2-amount3">
                  (<span>5</span>)
                </div>
              </div>
            </div>
          </div>

          {/* aside-category3 */}
          <div className="aside-category3 p-2 mb-2">
            <div className="aside-title">交流</div>
            <div className="aside-category-list">
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category3-title1">相片分享</div>
                <div className="aside-category-amount aside-category3-amount1">
                  (<span>10</span>)
                </div>
              </div>
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category3-title2">設備討論</div>
                <div className="aside-category-amount aside-category3-amount2">
                  (<span>20</span>)
                </div>
              </div>
              <div className="aside-category-item d-flex justify-content-between">
                <div className="aside-category3-title3">規劃行程</div>
                <div className="aside-category-amount aside-category-amount3">
                  (<span>5</span>)
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles aside-recent */}
          <div className="aside-recent p-2 mb-2">
            <div className="aside-recent-article-list">
              <div className="aside-title">最近文章</div>
              {[1, 2, 3].map((index) => (
                <div className="aside-recent-article" key={index}>
                  <div
                    className={`aside-recent-article-title aside-recent-article-title${index}`}
                  >
                    體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水
                  </div>
                  <div
                    className={`aside-recent-article-publish-time aside-recent-article-publish-time${index}`}
                  >
                    2024-09-10
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tag Section aside-tag */}
          <div className="aside-tag p-2 mb-2">
            <div className="aside-title">標籤區域</div>
            <div className="aside-tag-area">
              <span className="aside-popular-tag aside-tag1">#旅遊</span>
              <span className="aside-popular-tag aside-tag2">#體驗潛水</span>
              <span className="aside-popular-tag aside-tag3">#初學者潛水</span>
            </div>
          </div>
        </aside>

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
