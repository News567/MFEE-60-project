// routes/products/byBrand.js
import express from "express";
import { pool } from "../../config/mysql.js";
import {
  buildProductQuery,
  parseProductColors,
} from "../../helpers/productQuery.js";

const router = express.Router();

router.get("/brand/:brandId", async (req, res) => {
  try {
    const brandId = req.params.brandId;
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

    const { sql, queryParams, whereClause } = buildProductQuery({
      brandId,
      categoryId: null, // 僅使用品牌過濾
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
    console.error("Error querying products by brand:", error);
    res.status(500).json({
      status: "error",
      message: "Database query error",
      error: error.message,
    });
  }
});

export default router;
