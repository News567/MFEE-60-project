// routes/products/byCategory.js
import express from "express";
import { pool } from "../../config/mysql.js";
import {
  buildProductQuery,
  parseProductColors,
} from "../../helpers/productQuery.js";

const router = express.Router();

// 🔥 查小分類
router.get("/category/:categoryId", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const offset = (page - 1) * limit;
    const sort = parseInt(req.query.sort) || 1;
    const colorIds = req.query.color_id
      ? req.query.color_id.split(",").map(Number)
      : [];
    const minPrice = req.query.min_price
      ? parseFloat(req.query.min_price)
      : undefined;
    const maxPrice = req.query.max_price
      ? parseFloat(req.query.max_price)
      : undefined;

    // ✅ 呼叫 Helper，篩選小分類
    const { sql, queryParams, whereClause } = buildProductQuery({
      brandId: null,
      categoryId,
      bigCategoryId: null, // 小分類查詢時不傳遞大分類
      colorIds,
      sort,
      offset,
      limit,
      minPrice,
      maxPrice,
    });

    const totalCountSql = `SELECT COUNT(DISTINCT p.id) AS totalCount FROM product p ${whereClause}`;
    const [[{ totalCount }]] = await pool.execute(totalCountSql, queryParams);
    const [rows] = await pool.execute(sql, queryParams);
    const totalPages = Math.ceil(totalCount / limit);

    const parsedRows = parseProductColors(rows);

    res.json({
      status: "success",
      data: parsedRows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error querying products by category:", error);
    res.status(500).json({
      status: "error",
      message: "Database query error",
      error: error.message,
    });
  }
});

// 🔥 查大分類
router.get("/category/big/:bigCategoryId", async (req, res) => {
  try {
    const bigCategoryId = req.params.bigCategoryId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const offset = (page - 1) * limit;
    const sort = parseInt(req.query.sort) || 1;
    const colorIds = req.query.color_id
      ? req.query.color_id.split(",").map(Number)
      : [];

    // ✅ 呼叫 Helper，篩選大分類
    const { sql, queryParams, whereClause } = buildProductQuery({
      brandId: null,
      categoryId: null, // 大分類查詢時不傳遞小分類
      bigCategoryId,
      colorIds,
      sort,
      offset,
      limit,
    });

    console.log("🚀 DEBUG Big Category SQL:", sql);
    console.log("🚀 DEBUG Params:", queryParams);

    const totalCountSql = `SELECT COUNT(DISTINCT p.id) AS totalCount FROM product p ${whereClause}`;
    const [[{ totalCount }]] = await pool.execute(totalCountSql, queryParams);
    const [rows] = await pool.execute(sql, queryParams);
    const totalPages = Math.ceil(totalCount / limit);

    const parsedRows = parseProductColors(rows);

    res.json({
      status: "success",
      data: parsedRows,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error querying products by big category:", error);
    res.status(500).json({
      status: "error",
      message: "Database query error",
      error: error.message,
    });
  }
});

export default router;
