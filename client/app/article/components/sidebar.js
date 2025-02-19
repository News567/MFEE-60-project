import React, { useEffect, useState } from "react";
import "./articleAside.css";

const Sidebar = () => {
  const [sidebarData, setSidebarData] = useState({ sidebar: {} });
  const [loading, setLoading] = useState(true); // ✅ 确保 useState 定义了 setLoading
  const [error, setError] = useState(null); // ✅ 确保 useState 定义了 setError

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/article/sidebar");
        if (!res.ok) {
          throw new Error(`HTTP 错误！状态码: ${res.status}`);
        }
        const data = await res.json();
        setSidebarData(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ 获取 Sidebar 数据失败:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  if (loading || !sidebarData.sidebar) return <div>加载中...</div>;
  if (error) return <div>发生错误: {error}</div>;

  // 安全解构
  const {
    categoryBig = [],
    categorySmall = [],
    latest_articles = [],
    random_tags = [],
  } = sidebarData.sidebar || {};

  return (
    <aside className="col-3">
      {/* 分类区域 */}
      {categoryBig.map((bigCategory) => (
        <div key={bigCategory.id} className="aside-category p-2 mb-2">
          <div className="aside-title">{bigCategory.name}</div>
          <div className="aside-category-list">
            {categorySmall
              .filter((small) => small.category_big_id === bigCategory.id)
              .map((smallCategory, index) => (
                <div
                  className="aside-category-item d-flex justify-content-between"
                  key={index}
                >
                  <div className="aside-category-title">
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
            <div className="aside-recent-article" key={article.id}>
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
          {random_tags.map((tag, index) => (
            <span key={index} className="aside-popular-tag">
              #{tag.tag_name}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
