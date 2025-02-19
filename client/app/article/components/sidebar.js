import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 的路由
import "./articleAside.css";

const Sidebar = () => {
  const router = useRouter();
  const [sidebarData, setSidebarData] = useState({ sidebar: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/article/sidebar");
        if (!res.ok) {
          throw new Error(`HTTP 错误！状态码: ${res.status}`);
        }
        const data = await res.json();
        setSidebarData(data);
      } catch (error) {
        console.error("❌ 获取 Sidebar 数据失败:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  if (loading || !sidebarData.sidebar) return <div>加载中...</div>;
  if (error) return <div>发生错误: {error}</div>;

  const {
    categoryBig = [],
    categorySmall = [],
    latest_articles = [],
    random_tags = [],
  } = sidebarData.sidebar || {};

  // 🔹 點擊分類篩選
  const handleCategoryClick = (categorySmallName) => {
    router.push(`/article?category=${encodeURIComponent(categorySmallName)}`);
  };

  // 🔹 點擊標籤篩選
  const handleTagClick = (tagName) => {
    router.push(`/article?tag=${encodeURIComponent(tagName)}`);
  };

  // 🔹 點擊最近文章跳轉
  const handleArticleClick = (articleId) => {
    router.push(`/article/${articleId}`);
  };

  return (
    <aside className="col-3">
      {/* 分类区域 */}
      {categoryBig.map((bigCategory) => (
        <div key={bigCategory.id} className="aside-category p-2 mb-2">
          <div className="aside-title">{bigCategory.name}</div>
          <div className="aside-category-list">
            {categorySmall
              .filter((small) => small.category_big_id === bigCategory.id)
              .map((smallCategory) => (
                <div
                  className="aside-category-item d-flex justify-content-between"
                  key={smallCategory.id}
                >
                  <div
                    className="aside-category-title"
                    onClick={() =>
                      handleCategoryClick(smallCategory.category_small_name)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {smallCategory.category_small_name}
                  </div>
                  <div className="aside-category-amount">
                    (<span>{smallCategory.article_count}</span>)
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* 最近文章 */}
      <div className="aside-recent p-2 mb-2">
        <div className="aside-recent-article-list">
          <div className="aside-title">最近文章</div>
          {latest_articles.map((article) => (
            <div
              className="aside-recent-article"
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="aside-recent-article-title">{article.title}</div>
              <div className="aside-recent-article-publish-time">
                {article.publish_at}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 标签区域 */}
      <div className="aside-tag p-2 mb-2">
        <div className="aside-title">標籤區域</div>
        <div className="aside-tag-area">
          {random_tags.map((tag) => (
            <span
              key={tag.id}
              className="aside-popular-tag"
              onClick={() => handleTagClick(tag.tag_name)}
              style={{ cursor: "pointer" }}
            >
              #{tag.tag_name}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
