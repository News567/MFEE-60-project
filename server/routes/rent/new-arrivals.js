import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 獲取最近一周上架的商品，並隨機排序
router.get("/new-arrivals", async (req, res) => {
  try {
    const query = `
      SELECT 
        ri.id, 
        ri.name, 
        ri.price, 
        ri.price2, 
        ri.description, 
        ri.description2,
        ri.stock, 
        ri.created_at, 
        ri.update_at, 
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
        AND ri.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)  -- 過濾最近一周的商品
      GROUP BY 
        ri.id
      ORDER BY 
        RAND()  -- 隨機排序
      LIMIT 3;  -- 限制推薦數量
    `;

    const [rows] = await pool.query(query);

    // 將資料轉換為前端預期的格式
    const formattedData = rows.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      price2: product.price2,
      rent_category_small_id: product.rent_category_small_id,
      rent_category_small_name: product.rent_category_small_name,
      category_big: product.category_big,
      brand: product.brand_name,
      img_url: product.img_url || null,
      color_rgb: product.color_rgb,
      created_at: product.created_at, // 新增 created_at
      update_at: product.update_at,  // 新增 updated_at
    }));

    console.log("格式化後的資料:", formattedData);

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("獲取推薦新商品失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;