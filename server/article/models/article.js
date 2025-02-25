import db from "../../config/articleDb.js";  // 引入 articleDb.js

// 取得所有未刪除的文章
const getAllArticles = async () => {
  return await db.getArticles();
};

// 透過 ID 取得單篇文章
const getArticleById = async (id) => {
  return await db.getArticleById(id);
};

// 建立新文章
const createArticle = async ({ title, content, coverImage, category_id }) => {
  return await db.createArticle(title, content, coverImage, category_id);
};

// 更新文章
const updateArticle = async (id, { title, content, coverImage, category_id }) => {
  return await db.updateArticle(id, title, content, coverImage, category_id);
};

// 軟刪除文章
const deleteArticle = async (id) => {
  return await db.deleteArticle(id);
};

export default {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
    