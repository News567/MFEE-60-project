import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 獲取特惠商品（有特價 price2），隨機推薦 3 件
router.get("/new-discounted", async (req, res) => {
  try {
    const query = `
      SELECT 
        ri.id, 
        ri.name, 
        ri.price, 
        ri.price2, 
        ri.description, 
        ri.stock, 
        ri.deposit, 
        ri.is_like,
        rcs.id AS rent_category_small_id,  
        rcs.name AS rent_category_small_name, 
        rcb.name AS category_big, 
        ri_img.img_url AS img_url,
        rb.id AS brand_id, 
        rb.name AS brand_name,
        NULLIF(GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC SEPARATOR ', '), '') AS color_name, 
        NULLIF(GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC SEPARATOR ', '), '') AS color_rgb
      FROM 
        rent_item ri
      JOIN 
        rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN 
        rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN 
        rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
      LEFT JOIN 
        rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN 
        rent_brand rb ON rs.brand_id = rb.id
      LEFT JOIN 
        rent_color rc ON rs.color_id = rc.id
      WHERE 
        ri.is_deleted = FALSE
        AND ri.price2 IS NOT NULL  -- 確保 price2 有值
        AND ri.price2 > 0  -- 確保 price2 為正數
      GROUP BY 
        ri.id
      ORDER BY 
        RAND()  -- 隨機排序
      LIMIT 3;  -- 限制推薦數量
    `;

    const [rows] = await pool.query(query);

    // 格式化返回的資料
    const formattedData = rows.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      price2: product.price2, // 確保回傳特價
      rent_category_small_id: product.rent_category_small_id,
      rent_category_small_name: product.rent_category_small_name,
      category_big: product.category_big,
      brand: product.brand_name,
      img_url: product.img_url || null,
      color_rgb: product.color_rgb,
    }));

    console.log("推薦特價商品:", formattedData);

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("獲取特價商品失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
