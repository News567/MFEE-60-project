import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 取得大分類和小分類的資料
router.get("/filter", async (req, res) => {
  const { categoryBig, categorySmall, page = 1, limit = 16, sort } = req.query;

  const offset = (page - 1) * limit; // 計算偏移量

  // 根據排序方式動態設置 ORDER BY 條件
  let orderBy = "";
  if (sort === "price_desc") {
    orderBy = "ORDER BY COALESCE(ri.price2, ri.price) DESC"; // 價格由高到低
  } else if (sort === "price_asc") {
    orderBy = "ORDER BY COALESCE(ri.price2, ri.price) ASC"; // 價格由低到高
  } else if (sort === "newest") {
    orderBy = "ORDER BY ri.created_at DESC"; // 上架時間：由新到舊
  } else if (sort === "oldest") {
    orderBy = "ORDER BY ri.created_at ASC"; // 上架時間：由舊到新
  }

  // 動態篩選條件
  let filterConditions = "WHERE ri.is_deleted = FALSE";
  const queryParams = [];

  // 篩選條件
  if (categorySmall) {
    filterConditions += " AND rcs.name = ?";
    queryParams.push(categorySmall);
  }
  if (categoryBig) {
    filterConditions += " AND rcb.name = ?";
    queryParams.push(categoryBig);
  }

  try {
    // 獲取符合條件的商品
    const [rows] = await pool.query(
      `SELECT
          ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
          ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like,
          rcs.name AS category_small, rcb.name AS category_big,
          ri_img.img_url AS img_url,  -- 只獲取 is_main = 1 的圖片
          rb.id AS brand_id,  -- 取得品牌 ID
          rb.name AS brand_name,  -- 取得品牌名稱
          GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC) AS color_name,  -- 顏色名稱
          GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC) AS color_rgb  -- 顏色 RGB 值
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1  -- 只獲取主圖
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      LEFT JOIN rent_color rc ON rs.color_id = rc.id
      ${filterConditions}  -- 篩選條件
      ${orderBy}  -- 排序條件
      LIMIT ? OFFSET ?;`,
      [...queryParams, limit, offset] // 參數
    );

    // 獲取總商品數量
    const [totalRows] = await pool.query(
      `SELECT COUNT(DISTINCT ri.id) AS total
      FROM rent_item ri
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      ${filterConditions};`,
      queryParams
    );

    const total = totalRows[0].total; // 總商品數量

    // 返回分頁資料
    const responseData = {
      data: rows, // 當前頁的商品
      page, // 當前頁數
      limit, // 每頁顯示的商品數量
      total, // 總商品數量
      totalPages: Math.ceil(total / limit), // 總頁數
    };

    res.json(responseData); // 返回查詢結果
  } catch (err) {
    console.error("SQL 錯誤:", err);
    res.status(500).send({ error: "Server error", message: err.message });
  }
});

export default router;
