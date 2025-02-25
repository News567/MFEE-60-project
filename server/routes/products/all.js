// routes/products/all.js
import express from "express";
import { pool } from "../../config/mysql.js";
import {
  buildProductQuery,
  parseProductColors,
} from "../../helpers/productQuery.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // 分頁與排序參數
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const offset = (page - 1) * limit;
    const sort = parseInt(req.query.sort) || 1;
    const colorIds = req.query.color_id
      ? req.query.color_id
          .split(",")
          .map(Number)
          .filter((num) => !isNaN(num))
      : [];

    const minPrice = req.query.min_price
      ? parseFloat(req.query.min_price)
      : undefined;
    const maxPrice = req.query.max_price
      ? parseFloat(req.query.max_price)
      : undefined;

    // 此處沒有傳入 brandId 或 categoryId，表示查詢所有商品
    const { sql, queryParams, whereClause } = buildProductQuery({
      brandId: null,
      categoryId: null,
      colorIds,
      minPrice,
      maxPrice,
      sort,
      offset,
      limit,
    });

    // 取得全部符合條件的總筆數
    const totalCountSql = `SELECT COUNT(DISTINCT p.id) AS totalCount FROM product p ${
      whereClause || "WHERE 1=1"
    }`;

    const [[{ totalCount }]] = await pool.execute(totalCountSql, queryParams);

    // 取得產品資料
    const [rows] = await pool.execute(sql, queryParams);
    const totalPages = Math.ceil(totalCount / limit);

    // 使用 helper 函數處理顏色
    const parsedRows = parseProductColors(rows);

    // 確保每個產品的 price 字段都被 min_price 替代（為了向後兼容）
    const compatibleRows = parsedRows.map(product => ({
      ...product,
      price: product.min_price || product.price
    }));

    res.json({
      status: "success",
      data: compatibleRows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error querying all products:", error);
    res.status(500).json({
      status: "error",
      message: "Database query error",
      error: error.message,
    });
  }
});

export default router;