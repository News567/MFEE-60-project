import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 根據當前商品資料推薦相似商品
router.get("/recommended", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");

  const { brand, category_small, id } = req.query;
  const parsedId = parseInt(id, 10); // 將 id 轉換為數字

  console.log("收到的 id:", id, "類型:", typeof id, "轉換後的 id:", parsedId);
  console.log("品牌:", brand);
  console.log("分類:", category_small);

  if (!brand || !category_small || !parsedId) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  const decodedCategorySmall = decodeURIComponent(category_small);

  try {
    const [rows] = await pool.query(
      `
      SELECT
        ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
        ri.stock, ri.created_at, ri.updated_at, ri.deposit, ri.is_like,
        rcs.id AS rent_category_small_id,
        rcs.name AS rent_category_small_name,
        rcb.name AS category_big,
        ri_img.img_url AS img_url,
        rb.id AS brand_id,
        rb.name AS brand_name,
        COALESCE(GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC SEPARATOR ', '), '無顏色') AS color_name,
        COALESCE(GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC SEPARATOR ', '), '無顏色') AS color_rgb
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      LEFT JOIN rent_color rc ON rs.color_id = rc.id
      WHERE ri.is_deleted = FALSE
        AND (rb.name = ? OR rcs.id = ?)
        AND ri.id != ?
      GROUP BY ri.id
      ORDER BY RAND()
      LIMIT 4;
      `,
      [brand, decodedCategorySmall, parsedId]
    );

    // 將資料轉換為前端預期的格式
    const formattedData = rows.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      price2: item.price2,
      brand: item.brand_name, // 品牌名稱
      images: [{ img_url: item.img_url }], // 圖片 URL
      specifications: item.color_rgb ? [{ color_rgb: item.color_rgb }] : [], // 顏色 RGB 值
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("獲取推薦商品失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
