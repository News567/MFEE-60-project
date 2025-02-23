"use client";
import { useState } from "react";

// 处理上传封面图片
export async function uploadCoverImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("/api/article/create/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("封面图片上传失败");
  }

  const data = await response.json();
  return data.filePath;  // 返回上传后的文件路径
}

// 获取文章创建所需的数据（分类、标签等）
export async function fetchArticleCreateData() {
  const response = await fetch("/api/article/create-data");
  if (!response.ok) {
    throw new Error("获取文章创建数据失败");
  }

  return response.json();
}

// 提交新文章
export async function createArticle(formData) {
  const response = await fetch("/api/article/create", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "文章创建失败");
  }

  const data = await response.json();
  return data;  // 返回文章创建后的数据（如文章ID）
}
