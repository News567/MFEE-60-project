"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./articleCreate.css";
import Sidebar from "../components/sidebar";

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
  const [categorySmallOptions, setCategorySmallOptions] = useState([]); // 小分類選項
  const [categoryBigOptions, setCategoryBigOptions] = useState([]); // 大分類選項

  // 載入大分類資料
  useEffect(() => {
    const fetchCategoryBig = async () => {
      const response = await fetch("/api/article"); // 修正為正確的 API 路徑
      const data = await response.json();
      setCategoryBigOptions(data.data.bigCategories);
    };
    fetchCategoryBig();
  }, []);

  // 根據大分類載入小分類選項
  useEffect(() => {
    if (categoryBig) {
      const fetchCategorySmall = async () => {
        const response = await fetch(`/api/categorySmall?categoryBigId=${categoryBig}`);
        const data = await response.json();
        setCategorySmallOptions(data);
      };
      fetchCategorySmall();
    } else {
      setCategorySmallOptions([]);
      setCategorySmall(""); // 清除小分類選擇
    }
  }, [categoryBig]);

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

  // 驗證表單
  const validateForm = () => {
    if (title.length > 60) {
      alert("標題不能超過 60 個字！");
      return false;
    }
    if (!categoryBig || !categorySmall) {
      alert("請選擇完整的文章分類！");
      return false;
    }
    return true;
  };

  // 提交表單
  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("article_category_small_id", categorySmall);
    formData.append("users_id", 1); // 假設用戶 ID 為 1，實際應從登入狀態獲取
    formData.append("tags", JSON.stringify(tags)); // 將標籤轉為 JSON 字串
    formData.append("status", isDraft ? "draft" : "published"); // 設定狀態為草稿或已發表
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
        alert(isDraft ? "草稿儲存成功！" : "文章發表成功！");
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
        <Sidebar />
        <div className="article-create col-9">
          <div className="title">發表新文章</div>

          {/* 封面圖片 */}
          <div className="secondaryTitle">上傳封面縮圖</div>
          <div className="image-upload-box mt-3">
            <label htmlFor="imageUpload" className="upload-square">
              {coverImage ? (
                <img
                  src={URL.createObjectURL(coverImage)}
                  alt="封面圖片"
                  className="uploaded-image"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }} // 設定圖片為 150x150
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

          {/* 標題 */}
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

          {/* 文章分類 */}
          <div className="secondaryTitle">文章分類</div>
          <div className="form-item item-bottom">
            <select
              id="sltActive"
              className="category1"
              value={categoryBig}
              onChange={(e) => setCategoryBig(e.target.value)}
            >
              <option value="">請選擇大分類</option>
              {categoryBigOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              id="sltSubCategory"
              className="category2"
              value={categorySmall}
              onChange={(e) => setCategorySmall(e.target.value)}
              disabled={!categoryBig}
            >
              <option value="">請選擇小分類</option>
              {categorySmallOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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

          {/* 提交按鈕 */}
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
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading}
            >
              {isLoading ? "儲存中..." : "發表文章"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
