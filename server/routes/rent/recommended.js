import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 根據當前商品 ID 推薦相似商品
router.get("/:id/rentRecommendedRouter", async (req, res) => {
  const { id } = req.params;

 // 1. 驗證 ID 是否為有效數字
 if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "無效的商品 ID ！",
    });
  }

  try {
     // 2. 先獲取當前商品的類別和品牌
     const [currentProduct] = await pool.query(
        `
        SELECT 
          ri.rent_category_small_id, 
          rb.id AS brand_id
        FROM rent_item ri
        LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
        LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
        WHERE ri.id = ? AND ri.is_deleted = FALSE
        `,
        [id]
      );
  
      // 3. 檢查商品是否存在
      if (currentProduct.length === 0) {
        return res.status(404).json({
          success: false,
          message: "找不到該商品",
        });
      }
  
      const { rent_category_small_id, brand_id } = currentProduct[0];
  
      // 4. 查詢推薦商品（相同類別或相同品牌，最多 4 個）
      const [recommendedProducts] = await pool.query(
        `
        SELECT 
          ri.id, 
          ri.name, 
          ri.price, 
          ri.price2, 
          ri.stock,
          rb.name AS brand_name,
          GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC) AS color_name,
          GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC) AS color_rgb
        FROM rent_item ri
        LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
        LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
        LEFT JOIN rent_color rc ON rs.color_id = rc.id
        WHERE 
          (ri.rent_category_small_id = ? OR rb.id = ?)  -- 相同類別或品牌
          AND ri.id != ?  -- 排除當前商品
          AND ri.is_deleted = FALSE
        GROUP BY ri.id
        ORDER BY RAND()  -- 隨機排序
        LIMIT 4          -- 限制 4 筆
        `,
        [rent_category_small_id, brand_id, id]
      );
  
      // 5. 為每個推薦商品查詢圖片
      for (let product of recommendedProducts) {
        const [images] = await pool.query(
          `
          SELECT img_url, is_main
          FROM rent_image
          WHERE rent_item_id = ?
          ORDER BY is_main DESC
          `,
          [product.id]
        );
        product.images = images;
      }
  
      // 6. 返回推薦商品
      res.status(200).json({
        success: true,
        data: recommendedProducts,
      });
    } catch (err) {
      console.error("Error fetching recommended products:", err);
      res.status(500).json({
        success: false,
        message: "伺服器錯誤，無法取得推薦商品！",
        error: err.message || err,
      });
    }
  });
  
  export default router;