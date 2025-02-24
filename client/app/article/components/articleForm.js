import { useState } from "react";
// import Forum from "../api/forum"; // 引入 forum.js API
import dynamic from "next/dynamic";
import "./articleCreate.css";

// 動態加載 CKEditor，避免在伺服器端渲染時出現錯誤
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react"), { ssr: false });
const ClassicEditor = dynamic(() => import("@ckeditor/ckeditor5-build-classic"), { ssr: false });

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
      const response = await Forum.submitArticle(formData); // 使用 forum.js 提交文章
      if (response.success) {
        alert("文章發表成功！");
      } else {
        alert("發表失敗，請重試！");
      }
    } catch (error) {
      alert("提交錯誤，請稍後再試！");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 標題 */}
      <div className="title">發表新文章</div>
      <div className="form-group">
        <label>標題</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* 顯示分類選項 */}
      <div className="form-group">
        <label>大分類</label>
        <select
          className="form-control"
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
      </div>

      {/* 小分類 */}
      <div className="form-group">
        <label>小分類</label>
        <select
          className="form-control"
          value={categorySmall}
          onChange={(e) => setCategorySmall(e.target.value)}
          required
        >
          <option value="">請選擇小分類</option>
          {/* 可根據大分類的選擇顯示小分類選項 */}
        </select>
      </div>

      {/* 文章內容 (CKEditor) */}
      <div className="form-group">
        <label>內容</label>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => setContent(editor.getData())}
        />
      </div>

      {/* 標籤 */}
      <div className="form-group">
        <label>標籤</label>
        <input
          type="text"
          className="form-control"
          value={newTag}
          onChange={handleTagInput}
          onKeyDown={addTag}
        />
        <div>
          {tagsList.map((tag, index) => (
            <span key={index} className="badge badge-primary">
              {tag}{" "}
              <button
                type="button"
                className="close"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 上傳封面圖片 */}
      <div className="form-group">
        <label>封面圖片</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setCoverImage(e.target.files[0])}
        />
      </div>

      {/* 提交按鈕 */}
      <button type="submit" className="btn btn-primary">
        提交
      </button>
    </form>
  );
};

export default ArticleForm;
