import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 獲取新品列表
router.get("/new", async (req, res) => {
  try {
    const [newProducts] = await pool.execute(
      `SELECT p.*, b.name AS brand_name 
       FROM product p
       LEFT JOIN brand b ON p.brand_id = b.id
       LEFT JOIN product_variant pv ON p.id = pv.product_id
       LEFT JOIN product_images pi ON p.id = pi.product_id
       WHERE p.createdAt >= NOW() - INTERVAL ? DAY
       ORDER BY p.createdAt DESC
       LIMIT ?`,
      [30, 3] // 使用參數化查詢，避免 SQL 注入
    );
    res.json({ status: "success", data: newProducts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// 獲取特惠商品列表
// router.get("/special", async (req, res) => {
//   try {
//     const [specialProducts] = await pool.execute(
//       `SELECT p.*, b.name AS brand_name
//        FROM product p
//        LEFT JOIN brand b ON p.brand_id = b.id
//        WHERE p.price > 0 AND p.price < p.original_price
//        ORDER BY (p.original_price - p.price) DESC
//        LIMIT ?`,
//       [3] // 限制最多顯示 3 筆資料
//     );
//     res.json({ status: "success", data: specialProducts });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// });

export default router;
