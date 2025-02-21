import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 獲取所有品牌資料及其商品
router.get("/brandcategories", async (req, res) => {
  try {
    // 執行查詢
    const [rows] = await pool.query(
      `
      SELECT
        rb.id AS brand_id,
        rb.name AS brand_name,
        rb.description AS brand_description,
        rb.imgUrl AS brand_imgUrl,
        ri.id AS item_id,
        ri.name AS item_name,
        ri.price AS item_price,
        ri.price2 AS item_price2,
        ri_img.img_url AS item_img_url,
        COUNT(ri.id) OVER (PARTITION BY rb.id) AS item_count
      FROM rent_brand rb
      LEFT JOIN rent_specification rs ON rb.id = rs.brand_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_item ri ON rs.rent_item_id = ri.id AND ri.is_deleted = FALSE
      LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1 AND ri_img.is_deleted = FALSE
      GROUP BY rb.id, ri.id
      ORDER BY rb.name ASC, ri.name ASC;
      `
    );

    // 將資料按品牌分組
    const brandsMap = new Map();
    rows.forEach((row) => {
      const brandId = row.brand_id;
      if (!brandsMap.has(brandId)) {
        brandsMap.set(brandId, {
          brand_id: row.brand_id,
          brand_name: row.brand_name,
          brand_description: row.brand_description,
          brand_imgUrl: row.brand_imgUrl,
          item_count: row.item_count,
          items: [],
        });
      }
      if (row.item_id) {
        brandsMap.get(brandId).items.push({
          item_id: row.item_id,
          item_name: row.item_name,
          item_price: row.item_price,
          item_price2: row.item_price2,
          item_img_url: row.item_img_url,
        });
      }
    });

    // 將 Map 轉換為陣列
    const brands = Array.from(brandsMap.values());

    // 返回品牌資料
    res.status(200).json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error("獲取品牌資料失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取品牌資料失敗",
    });
  }
});

export default router;