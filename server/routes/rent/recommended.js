import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 根據當前商品資料推薦相似商品
router.get("/recommended", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const { brand, category, id } = req.query;
  const parsedId = parseInt(id, 10); // 將 id 轉換為數字

  console.log("收到的 id:", id, "類型:", typeof id, "轉換後的 id:", parsedId);
  console.log("品牌:", brand);
  console.log("分類:", category);

  if (!brand || !category || !parsedId) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
    let rent_category_small_id = parseInt(category, 10); // 嘗試將 category 當成 ID 解析

    if (isNaN(rent_category_small_id)) {
      // 如果 category 不是數字，則假設它是名稱，先查詢對應的 ID
      const decodedCategory = decodeURIComponent(category).trim();
      const [categoryRows] = await pool.query(
        `SELECT id FROM rent_category_small WHERE LOWER(TRIM(name)) = LOWER(?) LIMIT 1`,
        [decodedCategory.trim()]
      );

      if (categoryRows.length === 0) {
        console.log("找不到對應的分類，category:", decodedCategory);
        return res
          .status(404)
          .json({ success: false, message: "找不到對應的分類" });
      }
      rent_category_small_id = categoryRows[0]?.id; // 取得分類 ID
    }

    console.log("對應的 rent_category_small_id:", rent_category_small_id);

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
    ri.updated_at, 
    ri.deposit, 
    ri.is_like,
    rcs.id AS rent_category_small_id,  -- 這是我們需要的分類 ID
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
          AND ((COALESCE(rb.name, '') = ? AND ? != '') OR rcs.name = ? OR ri.rent_category_small_id = ?)
          AND ri.id != ?
      GROUP BY 
          ri.id
      ORDER BY 
          RAND()
      LIMIT 4;
      `,
      [brand, rent_category_small_id, parsedId]
    );

    console.log("SQL 查詢結果:", rows); // 這裡確認資料庫回傳的資料

    // 將資料轉換為前端預期的格式
    const formattedData = rows.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      price2: item.price2,
      rent_category_small_id: item.rent_category_small_id, // 確保這裡返回 rent_category_small_id
      rent_category_small_name: item.rent_category_small_name, // 額外保留原始名稱
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
