import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 取得所有大分類及其對應的小分類
router.get("/categories", async (req, res) => {
  try {
    // 查詢所有大分類及對應的小分類
    const [rows] = await pool.query(
      `
      SELECT 
        rcb.id AS category_big_id, 
        rcb.name AS category_big_name,
        rcs.id AS category_small_id,
        rcs.name AS category_small_name
      FROM rent_category_big rcb
      LEFT JOIN rent_category_small rcs ON rcb.id = rcs.rent_category_big_id
      ORDER BY rcb.name, rcs.name;
      `
    );

    // 組織資料格式：將大分類和小分類分開
    const categories = [];
    let currentBigCategory = null;

    rows.forEach((row) => {
      // 檢查是否遇到新的大分類
      if (!currentBigCategory || currentBigCategory.category_big_id !== row.category_big_id) {
        // 先將上一個大分類資料推入結果陣列
        if (currentBigCategory) {
          categories.push(currentBigCategory);
        }

        // 創建新的大分類物件
        currentBigCategory = {
          category_big_id: row.category_big_id,
          category_big_name: row.category_big_name,
          category_small: [],
        };
      }

      // 推入小分類資料
      if (row.category_small_name) {
        currentBigCategory.category_small.push({
          id: row.category_small_id,
          name: row.category_small_name,
        });
      }
    });

    // 最後一個大分類需要推入結果
    if (currentBigCategory) {
      categories.push(currentBigCategory);
    }

    // 返回大分類及小分類資料
    res.json({ categories });
  } catch (err) {
    console.error("SQL 錯誤:", err);
    res.status(500).send({ error: "Server error", message: err.message });
  }
});

export default router;
