import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 根據 ID 獲取單個租借商品
router.get("/:id", async (req, res) => {
  const { id } = req.params;

    // 打印收到的 id，確保其正確
    console.log("Request ID: ", id);

  // 1. 驗證 ID 是否為有效數字
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "無效的商品 ID ！ 商品 ID 需為正數！",
    });
  }
  try {
    // 2. 查詢商品基本信息
    const [rows] = await pool.query(
      `
      SELECT 
        ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
        ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like,
        rcs.name AS category_small, rcb.name AS category_big,
        rb.id AS brand_id,  -- 取得品牌 ID
        rb.name AS brand_name,  -- 取得品牌名稱
        GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC) AS color_name,  -- 顏色名稱
        GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC) AS color_rgb  -- 顏色 RGB 值
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id  -- 連接 rent_brand 表
      LEFT JOIN rent_color rc ON rs.color_id = rc.id  -- 連接 rent_color 表
      WHERE ri.id = ? AND ri.is_deleted = FALSE
      GROUP BY ri.id  -- 只按商品 ID 分組
    `,
      [id]
    );

    // 打印查詢結果，確認查詢是否成功
    console.log("Database rows: ", rows);

    // 3. 檢查商品是否存在
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到該商品",
      });
    }

    const product = rows[0];

    // 4. 查詢商品圖片
    const [images] = await pool.query(
      `
     SELECT img_url, is_main
      FROM rent_image
      WHERE rent_item_id = ?
      ORDER BY is_main DESC  -- 主圖排在最前面
      `,
      [id]
    );

    // 5. 查詢商品規格
    const [specifications] = await pool.query(
      `
    SELECT 
        rs.id, 
        rc.name AS color, 
        rc.rgb AS color_rgb, 
        rt.name AS thickness,
        rb.id AS brand_id,  -- 品牌 ID
        rb.name AS brand_name  -- 品牌名稱
      FROM rent_specification rs
      LEFT JOIN rent_color rc ON rs.color_id = rc.id
      LEFT JOIN rent_thickness rt ON rs.thickness_id = rt.id
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      WHERE rs.rent_item_id = ? AND rs.is_deleted = FALSE
      `,
      [id]
    );

    // 6. 將圖片和規格附加到商品對象中
    product.images = images;
    product.specifications = specifications;

    // 7. 打印商品資料以檢查結構
    console.log("Product:", product);

    // 8. 返回標準化回應
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    console.error("Error fetching product details:", err);

    // 9. 返回標準化錯誤回應
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法取得商品詳情！",
      error: err.message || err, // 顯示具體錯誤訊息
    });
  }
});

export default router;
