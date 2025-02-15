"use client";
import React, { useState } from 'react';
import "./articleCreate.css";
import "../components/articleAside.css";

const ArticleCreate = () => {
  const [tags, setTags] = useState(["#旅遊", "#心得"]); // Example of pre-added tags
  const [newTag, setNewTag] = useState("");

  const handleTagInput = (e) => {
    setNewTag(e.target.value);
  };

  const addTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, `#${newTag.trim()}`]);
      setNewTag(""); // Clear input after adding tag
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="container mt-4">
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

          {/* 最近文章 aside-recent */}
          <div className="aside-recent p-2 mb-2">
            <div className="aside-recent-article-list">
              <div className="aside-title">最近文章</div>
              <div className="aside-recent-article">
                <div className="aside-recent-article-title aside-recent-article-title1">
                  體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水體驗潛水
                </div>
                <div className="aside-recent-article-publish-time aside-recent-article-publish-time1">
                  2024-09-10
                </div>
              </div>
              <div className="aside-recent-article">
                <div className="aside-recent-article-title aside-recent-article-title2">
                  體驗潛水體驗潛水體驗潛水
                </div>
                <div className="aside-recent-article-publish-time aside-recent-article-publish-time2">
                  2024-09-10
                </div>
              </div>
              <div className="aside-recent-article">
                <div className="aside-recent-article-title aside-recent-article-title3">
                  體驗潛水體驗潛水
                </div>
                <div className="aside-recent-article-publish-time aside-recent-article-publish-time3">
                  2024-09-10
                </div>
              </div>
            </div>
          </div>

          {/* 標籤 aside-tag */}
          <div className="aside-tag p-2 mb-2">
            <div className="aside-title">標籤區域</div>
            <div className="aside-tag-area">
              {tags.map((tag, index) => (
                <span key={index} className="aside-popular-tag">{tag}
                  <button className="close-btn" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right ArticleCreate (3/4) */}
        <div className="article-create col-9">
          <div className="title">發表新文章</div>
          <div className="secondaryTitle">上傳封面縮圖</div>
          <div className="image-upload-box mt-3">
            <label htmlFor="imageUpload" className="upload-square">
              <input type="file" id="imageUpload" className="d-none" />
            </label>
          </div>

          <div className="secondaryTitle">標題</div>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input col__12"
            placeholder="限 60 個中英字母"
            value=""
          />

          {/* 文章分類選擇 */}
          <div className="secondaryTitle">文章分類</div>
          <div className="form-item item-bottom">
            <select name="active" id="sltActive" className="category1">
              <option value="">請選擇</option>
              <option value="official">官方資訊</option>
              <option value="course">課程與體驗</option>
              <option value="exchange">交流</option>
            </select>
            <select
              name="subcategory"
              id="sltSubCategory"
              className="category2"
              disabled
            >
              <option value="">請選擇</option>
            </select>
          </div>

          <div className="secondaryTitle">內容</div>
          <div className="secondaryTitle Tag">標籤</div>
          <div className="tag">
            {tags.map((tag, index) => (
              <span key={index} className="tag1">
                {tag}
                <button className="close-btn" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
          </div>

          <input
            id="tagInput"
            name="tags"
            type="text"
            className="form-input"
            placeholder="請輸入標籤內容，按 Enter 新增"
            value={newTag}
            onChange={handleTagInput}
            onKeyDown={addTag}
          />

          <div className="btnarea">
            <button className="btn article-create-btn">儲存草稿</button>
            <button className="btn article-create-btn">發表文章</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCreate;
