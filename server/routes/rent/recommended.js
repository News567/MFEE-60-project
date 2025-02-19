import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 根據當前商品資料推薦相似商品
router.get("/:id/recommended", async (req, res) => {
  console.log("請求到達 /recommended 路由"); // 確認請求是否到達
  console.log("路由參數 ID:", req.params.id);  // 打印路由參數

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  // 從路由參數中提取 id
  const { id } = req.params;
  const { brand, category } = req.query;

  console.log("後端收到的 id:", id, "類型:", typeof id);

  // 轉換為數字
  const parsedId = parseInt(id, 10);

  console.log("收到的查詢參數:", req.query); // 輸出所有的查詢參數
  console.log("轉換後的 ID:", parsedId, "是否 NaN:", isNaN(parsedId));

  const rent_category_small_id = parseInt(category, 10); // 將 category 轉換為數字

  if (isNaN(parsedId) || parsedId <= 0) {
    console.log("無效的商品 ID:", parsedId); // 輸出錯誤訊息
    return res
      .status(400)
      .json({ success: false, message: "無效的商品 ID ！ 商品 ID 需為正數！" });
  }
  // 檢查參數是否有效
  if (isNaN(rent_category_small_id) || !brand?.trim()) {
    console.log("無效的分類 ID 或品牌:", rent_category_small_id, brand); // 輸出錯誤訊息
    return res.status(400).json({
      success: false,
      message: `無效的分類 ID: ${rent_category_small_id} 或品牌: ${brand}`,
    });
  }

  console.log("收到的 brand:", brand);
  console.log("收到的 category ID:", rent_category_small_id);
  console.log("收到的 id:", parsedId);

  try {
    const [rows] = await pool.query(
      `
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
    COALESCE(GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC SEPARATOR ', '), '無顏色') AS color_name, 
    COALESCE(GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC SEPARATOR ', '), '無顏色') AS color_rgb
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
    AND ri.id != ?  -- 排除當前商品
    AND (rb.name = ? OR ri.rent_category_small_id = ?)  -- 品牌或分類匹配
GROUP BY 
    ri.id
ORDER BY 
    CASE 
        WHEN rb.name = ? THEN 1  -- 品牌匹配優先
        WHEN ri.rent_category_small_id = ? THEN 2  -- 分類匹配次之
        ELSE 3
    END,
    RAND()  -- 隨機排序
LIMIT 4;  -- 限制推薦數量
      `,
      [parsedId, brand, rent_category_small_id, brand, rent_category_small_id]
    );

    console.log("SQL 查詢結果:", rows); // 這裡確認資料庫回傳的資料

    // 將資料轉換為前端預期的格式
    const formattedData = rows.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      price2: item.price2,
      rent_category_small_id: item.rent_category_small_id,
      rent_category_small_name: item.rent_category_small_name,
      category_big: item.category_big,
      brand: item.brand_name,
      images: item.img_url ? [{ img_url: item.img_url }] : [],
      specifications: item.color_rgb ? [{ color_rgb: item.color_rgb }] : [],
    }));

    console.log("格式化後的資料:", formattedData); // 確認格式化後的資料是否包含 rent_category_small_id

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("獲取推薦商品失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
