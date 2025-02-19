import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 當前頁數，默認為第 1 頁
  const limit = parseInt(req.query.limit) || 16; // 每頁顯示的商品數量，默認為 16
  const sort = req.query.sort; // 排序方式（先做price_desc 或 price_asc）

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
    // } else if (sort === "sales_desc") {
    //   orderBy = "ORDER BY ri.sales DESC"; // 銷量：由高到低
  }

  // 獲取所有租借商品
  // try {
  //   const [rows] = await pool.query(`
  //    SELECT
  //     ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
  //     ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like,
  //     rcs.name AS category_small, rcb.name AS category_big,
  //     ri_img.img_url AS img_url,
  //     b.name AS brand_name,  -- 取得品牌名稱
  //     GROUP_CONCAT(c.name ORDER BY c.id ASC) AS color_name,  -- 顏色名稱
  //     GROUP_CONCAT(c.rgb ORDER BY c.id ASC) AS color_rgb   -- 顏色 RGB 值
  //     FROM rent_item ri
  //     JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
  //     JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
  //     LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
  //     LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
  //     LEFT JOIN brand b ON rs.brand_id = b.id  -- 連接 brand 表
  //     LEFT JOIN color c ON rs.color_id = c.id
  //     WHERE ri.is_deleted = FALSE
  //     GROUP BY ri.id, b.name;
  //   `);
  //   res.json(rows); // 返回查詢結果
  // } catch (err) {
  //   console.error("SQL 錯誤:", err); // 顯示詳細的 SQL 錯誤
  //   res.status(500).send({ error: "Server error", message: err.message }); // 返回具體錯誤訊息
  // }

  // 分頁功能

  // try {
  //   // 檢查 limit 和 offset 的值
  //   console.log("limit:", limit, "offset:", offset);

  //   // 獲取當前頁的商品
  //   const [rows] = await pool.query(
  //     `
  //    SELECT
  //       ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
  //       ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like,
  //       rcs.name AS category_small, rcb.name AS category_big,
  //       ri_img.img_url AS img_url,  -- 只獲取 is_main = 1 的圖片
  //       b.id AS brand_id,  -- 取得品牌 ID
  //       b.name AS brand_name,  -- 取得品牌名稱
  //       GROUP_CONCAT(DISTINCT c.name ORDER BY c.id ASC) AS color_name,  -- 顏色名稱
  //       GROUP_CONCAT(DISTINCT c.rgb ORDER BY c.id ASC) AS color_rgb  -- 顏色 RGB 值
  //       FROM rent_item ri
  //       JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
  //       JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
  //       LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1  -- 只獲取主圖
  //       LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
  //       LEFT JOIN brand b ON rs.brand_id = b.id  -- 連接 brand 表
  //       LEFT JOIN color c ON rs.color_id = c.id  -- 連接 color 表
  //       WHERE ri.is_deleted = FALSE
  //       GROUP BY ri.id  -- 只按商品 ID 分組
  //       LIMIT ? OFFSET ?;
  //    `,
  //     [limit, offset]
  //   );

  //   // 獲取總商品數量，不需要 LIMIT 和 OFFSET
  //   const [totalRows] = await pool.query(`
  //    SELECT COUNT(DISTINCT ri.id) AS total
  //     FROM rent_item ri
  //     LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
  //     WHERE ri.is_deleted = FALSE;
  //  `);

  try {
    // 檢查 limit 和 offset 的值
    console.log("limit:", limit, "offset:", offset);

    // 獲取當前頁的商品
    const [rows] = await pool.query(
      `
      SELECT
        ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
        ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like, ri.rent_category_small_id,
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
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id  -- 連接 rent_brand 表
      LEFT JOIN rent_color rc ON rs.color_id = rc.id  -- 連接 rent_color 表
      WHERE ri.is_deleted = FALSE
      GROUP BY ri.id  -- 只按商品 ID 分組
      ${orderBy} -- 動態添加排序條件
      LIMIT ? OFFSET ?;
      `,
      [limit, offset]
    );

    // 獲取總商品數量，不需要 LIMIT 和 OFFSET
    const [totalRows] = await pool.query(`
      SELECT COUNT(DISTINCT ri.id) AS total
      FROM rent_item ri
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      WHERE ri.is_deleted = FALSE;
    `);

    const total = totalRows[0].total; // 總商品數量

    console.log("當前頁的商品資料:", rows); // 檢查當前頁的商品資料
    console.log("總商品數量:", total); // 檢查總商品數量

    // 返回分頁資料
    const responseData = {
      data: rows, // 當前頁的商品
      page, // 當前頁數
      limit, // 每頁顯示的商品數量
      total, // 總商品數量
      totalPages: Math.ceil(total / limit), // 總頁數
    };

    console.log("返回的資料:", responseData); // 檢查返回的資料
    res.json(responseData);
  } catch (err) {
    console.error("SQL 錯誤:", err);
    res.status(500).send({ error: "Server error", message: err.message });
  }
});

export default router;
