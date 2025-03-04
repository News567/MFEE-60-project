"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import DOMPurify from "dompurify"; // 用於清理 HTML 內容
import "./article.css";

// ArticleContent 組件：用於顯示 CKEditor 的 HTML 內容
const ArticleContent = ({ article }) => {
  const [sanitizedContent, setSanitizedContent] = useState("");

  // 當 article.content 變化時，清理 HTML 內容
  useEffect(() => {
    if (article.content) {
      const cleanedContent = DOMPurify.sanitize(article.content);
      setSanitizedContent(cleanedContent);
    }
  }, [article.content]);

  return (
    <div className="article-content-area">
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
};

// ArticleDetail 組件：用於顯示文章詳情
export default function ArticleDetail() {
  const { id } = useParams(); // 從 URL 中獲取文章 ID
  const [article, setArticle] = useState(null); // 文章數據
  const [loading, setLoading] = useState(true); // 加載狀態
  const [error, setError] = useState(null); // 錯誤狀態
  const [relatedArticles, setRelatedArticles] = useState([]); // 相關文章

  const backendURL = "http://localhost:3005";
  const defaultImage = "/uploads/article/no_is_main.png";
  const [imageUrl, setImageUrl] = useState(defaultImage);

  // 當 article.img_url 變化時，設置圖片 URL
  // useEffect(() => {
  //     if (article && article.img_url) {
  //         const fullImageUrl = article.img_url.startsWith("http")
  //             ? article.img_url
  //             : `${backendURL}${article.img_url || defaultImage}`;
  //         setImageUrl(fullImageUrl);
  //     }
  // }, [article]);

  // 從 API 獲取文章數據
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/article/${id}`);
        const data = res.data.data;

        // 將 tags 字串轉為陣列
        const formattedRelatedArticles = data.relatedArticles.map(
          (article) => ({
            ...article,
            tags: article.tags
              ? article.tags.split(",").map((tag) => tag.trim())
              : [],
          })
        );

        setArticle(data);
        setRelatedArticles(formattedRelatedArticles); // 更新相關文章

        // 找到符合條件的封面圖片
        if (article?.images) {
          const mainImage = article.images.find(
            (img) => img.is_main === 1 && img.is_deleted === 0
          );

          const fullImageUrl = mainImage
            ? `${backendURL}${mainImage.img_url}`
            : defaultImage;

          setImageUrl(fullImageUrl);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 渲染回覆
  const renderReplies = () => {
    if (!article.replies || article.replies.length === 0) {
      return <div>目前沒有留言</div>;
    }

    return article.replies.map((reply) => (
      <div key={reply.id}>
        {/* 層級1回覆 */}
        {Number(reply.level) === 1 && (
          <div className="reply1">
            <img
              src="../img/article/reply2.jpg"
              className="reply-avatar2"
              alt=""
            />
            <div className="reply-details1">
              <div className="reply-header1">
                <div>
                  <span className="reply-author1">{reply.author_name}</span>
                  {reply.level === 1 && (
                    <span className="popular-reply1">熱門留言</span>
                  )}
                </div>
                <div className="reply-publish-time1">{reply.created_at}</div>
              </div>
              <div className="reply-content1">{reply.content}</div>
              <div className="others-reply-area1">
                <div className="good1">
                  <i className="fa-regular fa-thumbs-up"></i>{" "}
                  {reply.likes_count}
                </div>
                <div className="bad1">
                  <i className="fa-regular fa-thumbs-down"></i>{" "}
                  {reply.dislikes_count}
                </div>
                <div className="others-reply1">回覆</div>
              </div>
            </div>
          </div>
        )}

        {/* 層級2回覆 */}
        {Number(reply.level) === 2 && (
          <div className="reply2">
            <img
              src="../img/article/reply2.jpg"
              className="reply-avatar2"
              alt=""
            />
            <div className="reply-details2">
              <div className="reply-header2">
                <div>
                  <span className="reply-author2">{reply.author_name}</span>
                </div>
                <div className="reply-publish-time2">{reply.created_at}</div>
              </div>
              <div className="reply-content2">{reply.content}</div>
              <div className="others-reply-area2">
                <div className="good2">
                  <i className="fa-regular fa-thumbs-up"></i>{" "}
                  {reply.likes_count}
                </div>
                <div className="bad2">
                  <i className="fa-regular fa-thumbs-down"></i>{" "}
                  {reply.dislikes_count}
                </div>
                <div className="others-reply2">回覆</div>
              </div>
            </div>
          </div>
        )}
      </div>
    ));
  };

  // 加載中顯示 Loading
  if (loading) return <div>Loading...</div>;

  // 錯誤時顯示錯誤訊息
  if (error) return <div>Error: {error}</div>;

  // 如果沒有數據，顯示提示
  if (!article) return <div>No article found</div>;

  return (
    <div className="article col-9">
      <div className="articleDetail">
        {/* 文章標題 */}
        <div className="title">
          <div className="text-area">{article.title}</div>
          <div className="author-area">
            <i className="fa-solid fa-user"></i>
            {article.author_name}
          </div>
          <div className="publish-time-area">
            <i className="fa-solid fa-calendar-days"></i>
            {article.publish_at}
          </div>
        </div>

        {/* 文章主圖 */}
        <div className="main-photo">
          <Image
            src={imageUrl}
            alt="Article Thumbnail"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => setImageUrl(defaultImage)} // 这里修正了默认图片路径
          />
        </div>

        {/* 文章內容 */}
        {article && (
          <div className="article-content-area">
            <ArticleContent article={article} />
          </div>
        )}

        {/* 文章標籤 */}
        <div className="tag-area">
          {Array.isArray(article.tags) ? (
            article.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag.trim()}
              </span>
            ))
          ) : (
            <span>No tags available</span>
          )}
        </div>

        {/* 留言區 */}
        <div className="replyArea">
          <div className="replyFilter">
            <div className="totalReply">共10筆留言</div>
            <div className="timeSort">
              新舊排序<i className="fa-solid fa-arrows-up-down"></i>
            </div>
          </div>
          <div className="articleDetail">
            <div className="replyArea">{renderReplies()}</div>
          </div>
        </div>

        {/* 更多留言輸入框 */}
        <div className="more-reply">
          <img
            src="../img/article/reply3.jpg"
            className="reply-avatar1"
            alt=""
          />
          <input type="search" className="form-control" placeholder="留言..." />
        </div>
        <div className="button-container">
          <button className="more-btn">更多</button>
        </div>

        {/* 相關文章 */}
        <div className="related-article-area-title">相關文章</div>
        <div className="related-article-area row row-cols-1 row-cols-md-2">
          {relatedArticles.map((relatedArticle, index) => {
            const relatedImageUrl = relatedArticle.img_url?.startsWith("http")
              ? relatedArticle.img_url
              : `${backendURL}${relatedArticle.img_url || defaultImage}`;

            return (
              <div className="related-card" key={index}>
                <div className="img-container">
                  <Image
                    className="article-list-card-photo-img"
                    src={relatedImageUrl}
                    alt="Article Thumbnail"
                    width={300}
                    height={200}
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                </div>
                <div className="card-body">
                  <div className="card-title">{relatedArticle.title}</div>
                  <div className="card-content">{relatedArticle.content}</div>
                  <div className="related-tag-area">
                    {Array.isArray(relatedArticle.tags) ? (
                      relatedArticle.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          #{tag.trim()}
                        </span>
                      ))
                    ) : (
                      <span>No tags available</span>
                    )}
                  </div>
                  <div className="others-reply-area">
                    <div className="good1">
                      <i className="fa-regular fa-thumbs-up"></i>
                      {relatedArticle.likes_count || 0}
                    </div>
                    <div className="comment">
                      <i className="fa-regular fa-thumbs-down"></i>
                      {relatedArticle.dislikes_count || 0}
                    </div>
                    <div className="others-reply">回覆</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
