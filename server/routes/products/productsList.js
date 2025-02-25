import express from "express";
import { pool } from "../../config/mysql.js";
import {
  buildProductQuery,
  parseProductColors,
} from "../../helpers/productQuery.js";

const router = express.Router();

// 獲取新品列表
router.get("/new", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3; // 限制數量，可以從 query 參數獲取，默認 3
    const sort = 2; // 使用 "最新上架" 排序 (對應 sort option 的 value: 2)

    const { sql, queryParams } = buildProductQuery({
      sort: sort,
      limit: limit,
      offset: 0, // 新品列表不需要分頁，offset 設為 0
      dateInterval: 30, // 新品時間間隔，例如 30 天內
    });

    const [rows] = await pool.execute(sql, queryParams);
    const parsedRows = parseProductColors(rows); // 使用 helper 函數處理顏色

    // 確保每個產品的 price 字段都被 min_price 替代（為了向後兼容）
    const compatibleRows = parsedRows.map((product) => ({
      ...product,
      price: product.min_price || product.price,
    }));

    res.json({ status: "success", data: compatibleRows });
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
