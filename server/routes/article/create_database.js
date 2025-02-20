import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 1️⃣ 查詢標籤
router.get("/article_tag_small", async (req, res) => {
  const { query } = req.query;  // 查詢字根
  if (!query) {
    return res.json([]);  // 若沒有 query 參數，回傳空陣列
  }

  try {
    const [tagsResult] = await pool.execute(
      `
      SELECT tag_name FROM article_tag_small
      WHERE tag_name LIKE ?
      LIMIT 10
      `,
      [`${query}%`]  // 使用 LIKE 查詢相似的標籤
    );

    res.json(tagsResult.map(tag => tag.tag_name));
  } catch (error) {
    console.error("❌ 查詢標籤失敗：", error);
    res.status(500).json({
      status: "error",
      message: "標籤查詢失敗"
    });
  }
});

// 2️⃣ 查詢小分類
router.get("/article_category_big", async (req, res) => {
  const { category_big_id } = req.query;
  if (!category_big_id) {
    return res.status(400).json({
      status: "error",
      message: "缺少大分類ID"
    });
  }

  try {
    const [smallCategories] = await pool.execute(
      `
      SELECT id, name FROM article_category_small
      WHERE category_big_id = ?
      `,
      [category_big_id]
    );

    res.json(smallCategories);
  } catch (error) {
    console.error("❌ 查詢小分類失敗：", error);
    res.status(500).json({
      status: "error",
      message: "小分類查詢失敗"
    });
  }
});

export default router;
