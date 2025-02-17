"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./articleCreate.css";
import "../components/articleAside.css";

export default function ArticleCreate() {
  const router = useRouter();
  const [title, setTitle] = useState(""); // 文章標題
  const [content, setContent] = useState(""); // 文章內容
  const [categoryBig, setCategoryBig] = useState(""); // 大分類
  const [categorySmall, setCategorySmall] = useState(""); // 小分類
  const [tags, setTags] = useState([]); // 標籤列表
  const [newTag, setNewTag] = useState(""); // 新增標籤輸入框的值
  const [coverImage, setCoverImage] = useState(null); // 封面圖片
  const [isLoading, setIsLoading] = useState(false); // 加載狀態

  // 處理標籤輸入
  const handleTagInput = (e) => {
    setNewTag(e.target.value);
  };

  // 新增標籤
  const addTag = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  // 移除標籤
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 處理封面圖片上傳
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  // 提交表單
  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("article_category_small_id", categorySmall);
    formData.append("users_id", 1); // 假設用戶 ID 為 1，實際應從登入狀態獲取
    formData.append("tags", JSON.stringify(tags)); // 將標籤轉為 JSON 字串
    if (coverImage) {
      formData.append("cover_image", coverImage);
    }

    try {
      const response = await fetch("/api/article/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("文章創建成功！");
        router.push(`/article/${result.articleId}`); // 跳轉到文章詳情頁面
      } else {
        const errorData = await response.json();
        alert(`文章創建失敗：${errorData.message}`);
      }
    } catch (error) {
      console.error("❌ 提交表單失敗：", error);
      alert("提交表單失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
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
                <span key={index} className="aside-popular-tag">
                  {tag}
                  <button className="close-btn" onClick={() => removeTag(tag)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </aside>
        {/* Right ArticleCreate (3/4) */}
        <div className="article-create col-9">
          <div className="title">發表新文章</div>

          {/* 上傳封面縮圖 */}
          <div className="secondaryTitle">上傳封面縮圖</div>
          <div className="image-upload-box mt-3">
            <label htmlFor="imageUpload" className="upload-square">
              {coverImage ? (
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="封面圖片"
                  className="uploaded-image"
                />
              ) : (
                <span>點擊上傳圖片</span>
              )}
              <input
                type="file"
                id="imageUpload"
                className="d-none"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* 文章標題 */}
          <div className="secondaryTitle">標題</div>
          <input
            id="title"
            name="title"
            type="text"
            className="form-input col__12"
            placeholder="限 60 個中英字母"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* 文章分類選擇 */}
          <div className="secondaryTitle">文章分類</div>
          <div className="form-item item-bottom">
            <select
              name="active"
              id="sltActive"
              className="category1"
              value={categoryBig}
              onChange={(e) => setCategoryBig(e.target.value)}
            >
              <option value="">請選擇</option>
              <option value="official">官方資訊</option>
              <option value="course">課程與體驗</option>
              <option value="exchange">交流</option>
            </select>
            <select
              name="subcategory"
              id="sltSubCategory"
              className="category2"
              value={categorySmall}
              onChange={(e) => setCategorySmall(e.target.value)}
              disabled={!categoryBig}
            >
              <option value="">請選擇</option>
              {/* 根據大分類動態加載小分類 */}
              {categoryBig === "official" && (
                <>
                  <option value="1">公告</option>
                  <option value="2">活動</option>
                </>
              )}
              {categoryBig === "course" && (
                <>
                  <option value="3">課程</option>
                  <option value="4">體驗</option>
                </>
              )}
              {categoryBig === "exchange" && (
                <>
                  <option value="5">討論</option>
                  <option value="6">分享</option>
                </>
              )}
            </select>
          </div>

          {/* 文章內容 */}
          <div className="secondaryTitle">內容</div>
          <textarea
            id="content"
            name="content"
            className="form-input col__12"
            placeholder="請輸入文章內容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
          />

          {/* 標籤 */}
          <div className="secondaryTitle Tag">標籤</div>
          <div className="tag">
            {tags.map((tag, index) => (
              <span key={index} className="tag1">
                {tag}
                <button className="close-btn" onClick={() => removeTag(tag)}>
                  ×
                </button>
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

          {/* 按鈕區域 */}
          <div className="btnarea">
            <button
              className="btn article-create-btn"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
            >
              {isLoading ? "儲存中..." : "儲存草稿"}
            </button>
            <button
              className="btn article-create-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "發表中..." : "發表文章"}
            </button>
          </div>
        </div>{" "}
      </div>{" "}
    </div>
  );
}
