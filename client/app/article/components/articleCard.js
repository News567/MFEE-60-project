"use client";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./articleList.css";
import axios from "axios";
import DOMPurify from "dompurify"; // 用於清理 HTML 內容

export default function ArticleCard({
  article,
  isMyArticles,
  onDeleteSuccess,
}) {
  const backendURL = "http://localhost:3005";
  const defaultImage = `${backendURL}/uploads/article/no_is_main.png`; // 定義預設圖片
  // 在 useState 內設定初始圖片網址
  const [imageUrl, setImageUrl] = useState(
    article.img_url?.startsWith("http")
      ? article.img_url
      : `${backendURL}${article.img_url || "/uploads/article/no_is_main.png"}`
  );

  // 清理 content
  const sanitizedContent = DOMPurify.sanitize(article.content || "");

  // 刪除文章
  const handleDelete = async () => {
    if (window.confirm("確定要刪除這篇文章嗎？")) {
      try {
        console.log(`Deleting article with ID: ${article.id}`); // 打印請求的 ID
        // 發送刪除請求
        const response = await axios.delete(
          `${backendURL}/api/article/${article.id}`
        );
        if (response.data.status === "success") {
          alert("文章刪除成功");
          onDeleteSuccess(); // 刪除成功後執行傳入的回調函數
        }
      } catch (error) {
        console.error("刪除失敗:", error);
        alert("刪除文章失敗");
      }
    }
  };

  // 生成完整的圖片 URL
  useEffect(() => {
    const fullImageUrl = article.img_url?.startsWith("http")
      ? article.img_url
      : `${backendURL}${article.img_url || "/uploads/article/no_is_main.png"}`;

    setImageUrl(fullImageUrl); // 更新 imageUrl 狀態
  }, [article.img_url]);

  // 動態插入清理後的內容 避免 Hydration failed
  const contentRef = useRef(null);
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = sanitizedContent;
    }
  }, [sanitizedContent]);

  return (
    <div className="article-list-card">
      <div className="article-list-card-photo">
        <Image
          className="article-list-card-photo-img"
          src={imageUrl}
          alt="Article Thumbnail"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw" // 根據視窗寬度設置大小
          onError={() => setImageUrl(defaultImage)}
        />
      </div>

      <div className="article-list-card-text">
        <div className="article-list-card-title">{article.title}</div>
        <div className="article-list-card-info">
          <div className="article-list-card-author">
            <span className="article-list-icon">
              {" "}
              <i className="fa-solid fa-user"></i>
            </span>

            {article.author_name}
          </div>
          <div className="article-list-card-publishtime">
            <span className="article-list-icon">
              {" "}
              <i className="fa-solid fa-calendar-days"></i>
            </span>

            {article.publish_at}
          </div>
          <div className="article-list-card-comment">
            <span className="article-list-icon">
              {" "}
              <i className="fa-regular fa-comment-dots"></i>
            </span>
            {article.reply_count} 則評論
          </div>
        </div>
        <div
          className="article-list-card-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} //去掉標籤
        />
        <div className="article-list-card-btn">
          {/* 只有在“我的文章”页面才显示删除按钮 */}
          {isMyArticles && (
            <>
              {/* 只有在“我的文章”页面才显示编辑按钮 */}
              <Link href={`/article/${article.id}/update`} passHref>
                <button className="btn btn-card btn-edit">編輯</button>
              </Link>
              <button
                className="btn btn-card btn-delete"
                onClick={handleDelete}
              >
                刪除
              </button>
            </>
          )}
          {/* 更多按钮 */}
          <Link href={`/article/${article.id}`} passHref>
            <button className="btn btn-card btn-more">更多</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
