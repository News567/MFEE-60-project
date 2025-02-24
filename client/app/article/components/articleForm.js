import { useState } from "react";
import { createArticle } from "../../api/article/create";
import "./articleCreate.css";
import Myeditor from "../components/Myeditor";


const ArticleForm = ({ categories, tags }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryBig, setCategoryBig] = useState("");
  const [categorySmall, setCategorySmall] = useState("");
  const [newTag, setNewTag] = useState("");
  const [tagsList, setTagsList] = useState(tags || []);
  const [coverImage, setCoverImage] = useState(null);

  // 處理標籤輸入
  const handleTagInput = (e) => setNewTag(e.target.value);

  const addTag = (e) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      setTagsList([...tagsList, newTag.trim()]);
      setNewTag("");
      e.preventDefault(); // 防止按下 Enter 會觸發其他預設行為，如提交表單
    }
  };

  const removeTag = (tagToRemove) => {
    setTagsList(tagsList.filter((tag) => tag !== tagToRemove));
  };

  // 表單提交邏輯
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryBig", categoryBig);
    formData.append("categorySmall", categorySmall);
    formData.append("tags", JSON.stringify(tagsList));

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const response = await createArticle(formData); // ✅ 直接使用 createArticle

      if (response.success) {
        alert("文章發表成功！");
      } else {
        alert("發表失敗，請重試！");
      }
    } catch (error) {
      alert("提交錯誤，請稍後再試！");
    }
  };

  // 處理封面圖片的選擇
  const [previewImage, setPreviewImage] = useState(null); // 用來儲存預覽圖片的狀態
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // 設置圖片預覽
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="create-form">
      <form onSubmit={handleSubmit}>
        <div className="create-title">發表新文章</div>
        {/* 封面圖 */}
        <div className="secondaryTitle">上傳封面縮圖</div>
        <div className="image-upload-box">
          <label htmlFor="coverImage" className="upload-square">
            {previewImage ? (
              <img src={previewImage} alt="封面預覽" className="upload-image" />
            ) : (
              <>
                <div className="upload-square-icon"></div> {/* 顯示 + 標誌 */}
              </>
            )}
          </label>

          <input
            type="file"
            id="coverImage"
            className="form-control"
            onChange={handleImageChange}
            style={{ display: "none" }} // 隱藏實際的 input
          />
        </div>

        {/* 標題 */}
        <div className="secondaryTitle">標題</div>
        <input
          type="text"
          className="form-control"
          placeholder="限 60 個中英字母"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* 顯示分類選項 */}
        <div className="secondaryTitle">文章分類</div>
        <div className="category-container">
          <select
            className="form-control category-big"
            value={categoryBig}
            onChange={(e) => setCategoryBig(e.target.value)}
            required
          >
            <option value="">請選擇大分類</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {/* 小分類 */}
          <select
            className="form-control category-small"
            value={categorySmall}
            onChange={(e) => setCategorySmall(e.target.value)}
            required
          >
            <option value="">請選擇小分類</option>
            {/* 可根據大分類的選擇顯示小分類選項 */}
          </select>
        </div>
        {/* 文章內容 (CKEditor) */}
        <div className="secondaryTitle">內容</div>
        <Myeditor
          name="content"
          value={content}
          editorLoaded={true}
          onChange={(data) => setContent(data)}
        />

        {/* 標籤 */}
        <div className="secondaryTitle">標籤</div>
        <input
          type="text"
          className="form-control create-tag"
          placeholder="請輸入標籤內容，按enter即可新增"
          value={newTag}
          onChange={handleTagInput}
          onKeyDown={addTag}
        />
        <div>
          {tagsList.map((tag, index) => (
            <span key={index} className="new-tag">
              #{tag}{" "}
              <button
                type="button"
                className="close-tag-btn"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* 提交按鈕 */}
        <div className="btnarea">
          <button className="btn article-create-btn">儲存草稿</button>
          <button className="btn article-create-btn">發表文章</button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
