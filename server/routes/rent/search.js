import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 搜索接口
router.get("/search", async (req, res) => {

  console.log("收到請求，參數:", req.query); // 添加日誌

  const { search, page = 1, limit = 16, sort } = req.query; // 搜尋關鍵字、分頁、排序
  const offset = (parseInt(page) - 1) * parseInt(limit); // 確保 offset 是數字

  // 如果搜尋關鍵字是中文
  const decodedSearch = decodeURIComponent(search);

  // 檢查搜尋關鍵字是否為空
  if (!decodedSearch) {
    return res.status(400).json({ error: "搜尋關鍵字不能為空" });
  }

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

  try {
    // 獲取符合條件的商品
    const [rows] = await pool.query(
    `SELECT DISTINCT
          ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
          ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like,
          rcs.name AS category_small, rcb.name AS category_big,
          ri_img.img_url AS img_url,
          rb.id AS brand_id,
          rb.name AS brand_name
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      LEFT JOIN rent_color rc ON rs.color_id = rc.id
      WHERE ri.is_deleted = FALSE AND (ri.name LIKE ? OR rb.name LIKE ?)
      ${orderBy}
      LIMIT ? OFFSET ?;`,
      [`%${decodedSearch}%`, `%${decodedSearch}%`, parseInt(limit), parseInt(offset)]
    );

    // 獲取總商品數量
    const [totalRows] = await pool.query(
      `SELECT COUNT(DISTINCT ri.id) AS total
      FROM rent_item ri
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      WHERE ri.is_deleted = FALSE AND (ri.name LIKE ? OR rb.name LIKE ?);`,
      [`%${decodedSearch}%`, `%${decodedSearch}%`]
    );

    const total = totalRows[0].total; // 總商品數量

    // 返回分頁資料
    const responseData = {
      data: rows, // 當前頁的商品
      page: parseInt(page), // 當前頁數
      limit: parseInt(limit), // 每頁顯示的商品數量
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
