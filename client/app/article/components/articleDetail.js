"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import "./articleList.css";

export default function ArticleDetail() {
  const { id } = useParams(); // 從 URL 中獲取文章 ID
  const [article, setArticle] = useState(null); // 文章數據
  const [loading, setLoading] = useState(true); // 加載狀態
  const [error, setError] = useState(null); // 錯誤狀態
  const [relatedArticles, setRelatedArticles] = useState([]); // 相關文章

  useEffect(() => {
    // 從 API 獲取文章數據
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/api/article/${id}`);
        setArticle(res.data.data); // 根據返回結果，設置數據
      } catch (err) {
        setError(err.message); // 設置錯誤訊息
      } finally {
        setLoading(false); // 加載完成
      }
    };

    const fetchRelatedArticles = async (categoryId) => {
      try {
        const res = await axios.get(
          `http://localhost:3005/api/article/related/${categoryId}`
        );
        setRelatedArticles(res.data.data); // 設置相關文章數據
      } catch (err) {
        console.error("Error fetching related articles:", err.message);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/api/article/${id}`);
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading...</div>; // 加載中顯示 Loading
  if (error) return <div>Error: {error}</div>; // 錯誤時顯示錯誤訊息
  if (!article) return <div>No article found</div>; // 如果沒有數據，顯示提示

  // 渲染回覆
  const renderReplies = () => {
    // 如果沒有回覆或回覆數量為 0，顯示提示文字
    if (!article.replies || article.replies.length === 0) {
      return <div>目前沒有留言</div>;
    }

    // 如果有回覆，則開始渲染
    return article.replies.map((reply) => (
      <div key={reply.id}>
        {/* 層級1回覆 */}
        {Number(reply.level) === 1 && (
          <div className="reply1">
            <img
              src="../img/article/reply1.jpg"
              className="reply-avatar1"
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

  return (
    <div className="article col-9">
      <div className="articleDetail">
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
        <div className="main-photo">
          <img
            src={
              article.img_url && article.img_url !== ""
                ? article.img_url
                : "/default-image.jpg"
            }
            className="img-fluid"
            alt="main-photo"
          />
        </div>
        <div className="article-content-area">{article.content}</div>
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
        {/* tag點擊事件 */}

        {/* import { useHistory } from 'react-router-dom';

const TagList = ({ tags }) => {
  const history = useHistory();

  // 點擊標籤時觸發的函數
  const handleTagClick = (tag) => {
    // 假設有一個搜尋頁面，根據 tag 查詢文章
    history.push(`/search?tag=${tag}`);
  }; */}

        {/* <div className="tag-area">
      {Array.isArray(tags) ? (
        tags.map((tag, index) => (
          <span
            key={index}
            className="tag"
            onClick={() => handleTagClick(tag)}
          >
            #{tag.trim()}
          </span>
        ))
      ) : (
        <span>No tags available</span>
      )}
    </div> */}

        <div className="replyArea">
          <div className="replyFilter">
            <div className="totalReply">共10筆留言</div>
            <div className="timeSort">
              新舊排序<i className="fa-solid fa-arrows-up-down"></i>
            </div>
          </div>{" "}
        </div>

        <div className="articleDetail">
          <div className="replyArea">
            {renderReplies()} {/* 渲染已加載的回覆 */}
          </div>
        </div>

        {/* more reply */}
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
        {/* related article */}
        <div className="related-article-area-title">相關文章</div>

        <div className="related-article-area row row-cols-1 row-cols-md-2">
          {relatedArticles.map((relatedArticle, index) => (
            <div className="related-card" key={index}>
              <div className="img-container">
                <img
                  src={
                    relatedArticle.img_url ||
                    "../img/article/article-ex-main-photo.jpeg"
                  }
                  alt="..."
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
                    <i className="fa-regular fa-thumbs-up"></i>1
                  </div>
                  <div className="comment">
                    <i className="fa-regular fa-thumbs-down"></i>10
                  </div>
                  <div className="others-reply">回覆</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
