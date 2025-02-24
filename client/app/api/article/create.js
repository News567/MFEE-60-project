"use client";

// 處理上傳封面圖片
export async function uploadArticleImage(imageFile) {
  const formData = new FormData();
  formData.append("coverImage", imageFile);

  const response = await fetch("/api/article/create/upload-image", {
    method: "POST",
    body: formData,
  });
  return response.json();
}

// 獲取文章創建所需的數據（分類、標籤等）
export async function fetchArticleCreateData() {
  const response = await fetch("/api/article/create-data");
  if (!response.ok) {
    throw new Error("獲取文章創建數據失敗");
  }
  return response.json();
}

// 提交新文章
export async function createArticle(formData) {
  const response = await fetch("/api/article/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "文章創建失敗");
  }

  const data = await response.json();
  return data; // 返回文章創建後的數據（如文章ID）
}