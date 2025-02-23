import { db } from "../../config/articleDb.js"; // 使用 articleDb.js 提供的 db 方法

const ArticleModel = {
  // 取得所有未刪除文章
  getAll: async () => {
    return await db.getArticles(); // 調用 articleDb.js 的 getArticles()
  },

  // 透過 ID 取得單篇文章
  getById: async (id) => {
    return await db.getArticleById(id); // 調用 articleDb.js 的 getArticleById()
  },

  // 建立新文章
  create: async ({ title, content, coverImage, category_id }) => {
    return await db.createArticle(title, content, coverImage, category_id); 
  },

  // 更新文章
  update: async (id, { title, content, coverImage, category_id }) => {
    return await db.updateArticle(id, title, content, coverImage, category_id);
  },

  // 軟刪除文章（標記為刪除）
  delete: async (id) => {
    return await db.deleteArticle(id);
  },
};

export default ArticleModel;
