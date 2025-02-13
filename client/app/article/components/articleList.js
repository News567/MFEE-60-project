"use client";

import React from 'react';
import "./articleList.css";
import "./articleAside.css";

const ArticleListPage = () => {
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
                  <div className={`aside-recent-article-title aside-recent-article-title${index}`}>
                    體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水
                  </div>
                  <div className={`aside-recent-article-publish-time aside-recent-article-publish-time${index}`}>
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
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div className="article-list-card" key={index}>
              <img
                className="article-list-card-photo img-fluid"
                src="./img/article/article-ex-main-photo.jpeg"
                alt="Article Thumbnail"
              />
              <div className="article-list-card-title">旅遊潛水</div>
              <div className="article-list-card-info">
                <div className="article-list-card-author">
                  <i className="fa-solid fa-user"></i>vicky
                </div>
                <div className="article-list-card-publishtime">
                  <i className="fa-solid fa-calendar-days"></i>202412123
                </div>
                <div className="article-list-card-comment">
                  <i className="fa-regular fa-comment-dots"></i>13則評論
                </div>
              </div>
              <div className="article-list-card-content">
                初次嘗試潛水的緊張與期待<br /><br />
                報名潛水課程時，我其實有些猶豫，因為我並不是游泳高手，甚至對深水有一點點恐懼。但教練的耐心解說以及身邊朋友的鼓勵，讓我決定跨出這一步。<br /><br />
                在正式潛水前，我參加了一次體驗潛水活動。教練先在泳池中向我們介紹裝備的使用，像是面鏡、調節器與蛙鞋，並教導我們如何進行耳壓平衡。這些準備讓我安心了不少，也讓我對正式下水充滿期待。
              </div>
              <div className="article-list-card-btn">
                <button className="btn">更多</button>
              </div>
            </div>
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
