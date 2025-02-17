import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
          b.id,
          b.name,
          COUNT(DISTINCT CASE 
              WHEN pv.isDeleted = 0 THEN p.id 
              ELSE NULL 
          END) AS product_count
      FROM brand b
      LEFT JOIN product p ON b.id = p.brand_id
      LEFT JOIN product_variant pv ON p.id = pv.product_id
      GROUP BY b.id, b.name
  `);

    res.json(rows);
  } catch (error) {
    console.error("獲取品牌列表錯誤：", error);
    res.status(400).json({
      status: "error",
      message: "獲取品牌列表失敗",
      error: error.message,
    });
  }
});

export default router;
