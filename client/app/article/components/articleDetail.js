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

  useEffect(() => {
    // 從 API 獲取文章數據
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/api/article/${id}`);
        setArticle(res.data); // 設置文章數據
      } catch (err) {
        setError(err.message); // 設置錯誤訊息
      } finally {
        setLoading(false); // 加載完成
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading...</div>; // 加載中顯示 Loading
  if (error) return <div>Error: {error}</div>; // 錯誤時顯示錯誤訊息
  if (!article) return <div>No article found</div>; // 如果沒有數據，顯示提示
  return (
    <div className="articleDetail">
      <div className="title">
        <div className="textArea">潛水新手入門指南{article.title}</div>
        <div className="authorArea">
          <i className="fa-solid fa-user"></i>Tom{article.author}
        </div>
        <div className="publishTimeArea">
          <i className="fa-solid fa-calendar-days"></i>2024.12.13 14:05
          {article.publishTime}
        </div>
      </div>
      <div className="main-photo">
        <img
          src="../img/article/article-ex-main-photo.jpeg"
          className="img-fluid"
          alt="main-photo"
        />
      </div>
      <div className="articleContentArea">
        想嘗試潛水活動，我應該如何開始?
        <br />
        如果您沒有嘗試過浮潛或體驗潛水，不確定自己是否在海中舒適，可以先參加我們的體驗潛水活動。想要取得執照到世界各地探索海洋美景，您可以開始第一個開放水域潛水員課程。
        <br />
        參加水肺課程有什麼特別的資格規定或考量嗎?
        <br />
        年滿12歲的健康人士都可以參加。您必須填寫一份健康聲明書。如果聲明書上發現有任何潛水會導致的問題，就必須就醫診斷，確定您是否可以潛水。
        <br />
        近視是否可以戴隱形眼鏡潛水?
        <br />
        可以，可以戴軟式隱形眼鏡。或是潛水中心有提供近視度數的面鏡，最高到700度
        <br />
        不會游泳是否可以學習潛水課程?
        <br />
        您只要具備基本的游泳技巧、且在水中有舒適感。如果有長時間沒有游泳，建議上課前到泳池泡泡水，先適應。
        <br />
        課程結束前您必須要能不間斷地游完200公尺，沒有時間或姿勢限制，或是帶著面鏡、蛙鞋和呼吸管游完300公尺。您也要表現10分鐘的水上漂浮能力
        (別擔心，我們會協助您完成)。
        <br />
        潛水課程時間安排，需要多少時間?
        <br />
        各課程需要時間不等，體驗潛水活動需要3-4小時。
        <br />
        第一個潛水執照的開放水域潛水員課程需要至少四天時間。
        PADI課程是以動作表現要求為標準，也就是說，只要您達到技巧和知識標準，就能獲得您的證書。因為每個人的學習步調不同，所以課程長短便因人而異。PADI開放水域潛水員課程包含知識發展、平靜水域及開放水域，上課時數從四天到動作技巧、學科測驗通過為止。
        <br />
        相關課程時間安排請參閱各潛水課程內容 <br />
      </div>
      <div className="tagArea">
        <span className="tag1">#Q&A</span>
        <span className="tag2">#新手</span>
      </div>

      <div className="replyArea">
        <div className="replyFilter">
          <div className="totalReply">共10筆留言</div>
          <div className="timeSort">
            新舊排序<i className="fa-solid fa-arrows-up-down"></i>
          </div>
        </div>
        {/* reply1 */}
        <div className="reply1">
          <img
            src="../img/article/reply1.jpg"
            className="reply-avatar1"
            alt=""
          />
          <div className="reply-details1">
            <div className="reply-header1">
              <div>
                <span className="reply-author1">Ben</span>
                <span className="popular-reply1">熱門留言</span>
              </div>
              <div className="reply-publish-time1">2024.12.21 15:28</div>
            </div>
            <div className="reply-content1">請問潛水需要很專業的技能嗎？</div>
            <div className="others-reply-area1">
              <div className="good1">
                <i className="fa-regular fa-thumbs-up"></i>120
              </div>
              <div className="bad1">
                <i className="fa-regular fa-thumbs-down"></i>10
              </div>
              <div className="others-reply1">回覆</div>
            </div>
          </div>
        </div>
        {/* reply1-1 */}
        <div className="reply2">
          <img
            src="../img/article/reply2.jpg"
            className="reply-avatar2"
            alt=""
          />
          <div className="reply-details2">
            <div className="reply-header2">
              <div>
                <span className="reply-author2">Newt</span>
              </div>
              <div className="reply-publish-time2">2024.12.21 16:28</div>
            </div>
            <div className="reply-content2">初學者同問！看起來好棒！</div>
            <div className="others-reply-area2">
              <div className="good2">
                <i className="fa-regular fa-thumbs-up"></i>2
              </div>
              <div className="bad2">
                <i className="fa-regular fa-thumbs-down"></i>1
              </div>
              <div className="others-reply2">回覆</div>
            </div>
          </div>
        </div>
        {/* reply1-2 */}
        <div className="reply2">
          <img
            src="../img/article/reply3.jpg"
            className="reply-avatar2"
            alt=""
          />
          <div className="reply-details2">
            <div className="reply-header2">
              <div>
                <span className="reply-author2">Tom</span>
                <span className="author-reply">樓主回復</span>
              </div>
              <div className="reply-publish-time2">2024.12.21 16:50</div>
            </div>
            <div className="reply-content2">
              不需要專業 的技能喔！
              初學者只要有教練帶，基本都沒問題喔，安全第一！
            </div>
            <div className="others-reply-area2">
              <div className="good2">
                <i className="fa-regular fa-thumbs-up"></i>10
              </div>
              <div className="bad2">
                <i className="fa-regular fa-thumbs-down"></i>
              </div>
              <div className="others-reply2">回覆</div>
            </div>
          </div>
        </div>
      </div>
      {/* reply2 */}
      <div className="reply1">
        <img src="../img/article/reply2.jpg" className="reply-avatar1" alt="" />
        <div className="reply-details1">
          <div className="reply-header1">
            <div>
              <span className="reply-author2">Newt</span>
            </div>
            <div className="reply-publish-time1">2024.12.21 15:28</div>
          </div>
          <div className="reply-content1">請問潛水需要很專業的技能嗎？</div>
          <div className="others-reply-area1">
            <div className="good1">
              <i className="fa-regular fa-thumbs-up"></i>1
            </div>
            <div className="bad1">
              <i className="fa-regular fa-thumbs-down"></i>10
            </div>
            <div className="others-reply1">回覆</div>
          </div>
        </div>
      </div>
      {/* more reply */}
      <div className="more-reply">
        <img src="../img/article/reply3.jpg" className="reply-avatar1" alt="" />
        <input type="search" className="form-control" placeholder="留言..." />
      </div>
      <div className="button-container">
        <button className="more-btn">更多</button>
      </div>
      {/* related article */}
      <div className="related-article-area-title">相關文章</div>
      <div className="related-article-area row row-cols-1 row-cols-md-2 g-4">
        <div
          className="card m-3"
          style={{ maxWidth: "540px", borderRadius: "0", border: "none" }}
        >
          <div className="row">
            <div className="col-md-6">
              <img src="../img/article/article-ex-main-photo.jpeg" alt="..." />
            </div>
            <div className="col-md-6">
              <div className="card-body">
                <div className="card-title">潛水課程Q&A</div>
                <div className="tag-area">
                  <span className="tag1">#Q&A</span>
                  <span className="tag2">#新手</span>
                </div>
                <div className="others-reply-area1">
                  <div className="good1">
                    <i className="fa-regular fa-thumbs-up"></i>1
                  </div>
                  <div className="comment">
                    <i className="fa-regular fa-thumbs-down"></i>10
                  </div>
                  <div className="others-reply1">回覆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="card m-3"
          style={{ maxWidth: "540px", borderRadius: "0", border: "none" }}
        >
          <div className="row">
            <div className="col-md-6">
              <img src="../img/article/article-ex-main-photo.jpeg" alt="..." />
            </div>
            <div className="col-md-6">
              <div className="card-body">
                <div className="card-title">潛水課程Q&A</div>
                <div className="tag-area">
                  <span className="tag1">#Q&A</span>
                  <span className="tag2">#新手</span>
                </div>
                <div className="others-reply-area1">
                  <div className="good1">
                    <i className="fa-regular fa-thumbs-up"></i>1
                  </div>
                  <div className="comment">
                    <i className="fa-regular fa-thumbs-down"></i>10
                  </div>
                  <div className="others-reply1">回覆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
