import { pool } from "./mysql.js"; // 使用 mysql 連線池

// 共用的 SQL 執行函數
const query = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error("資料庫錯誤：", error);
    throw error;
  } finally {
    connection.release();
  }
};

export const db = {
  // 取得所有文章
  getArticles: async () => {
    return query("SELECT * FROM article WHERE isDeleted = 0 ORDER BY created_at DESC");
  },

  // 透過 ID 取得單篇文章
  getArticleById: async (id) => {
    return query("SELECT * FROM article WHERE id = ? AND isDeleted = 0", [id]);
  },

  // 建立新文章
  createArticle: async (title, content, coverImage, category_id) => {
    return query(
      "INSERT INTO article (title, content, coverImage, category_id, created_at) VALUES (?, ?, ?, ?, NOW())",
      [title, content, coverImage, category_id]
    );
  },

  // 更新文章
  updateArticle: async (id, title, content, coverImage, category_id) => {
    return query(
      "UPDATE article SET title = ?, content = ?, coverImage = ?, category_id = ?, updated_at = NOW() WHERE id = ?",
      [title, content, coverImage, category_id, id]
    );
  },

  // 軟刪除文章
  deleteArticle: async (id) => {
    return query("UPDATE article SET isDeleted = 1 WHERE id = ?", [id]);
  },
};
