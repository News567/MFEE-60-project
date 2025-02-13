import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // 1. 查詢商品基本信息
    const [productRows] = await pool.execute(
      `
      SELECT 
        p.*,
        ps.id as spec_id,
        b.name as brand_name,
        b.description as brand_description,
        m.name as material_name
      FROM product p
      LEFT JOIN product_specification ps ON p.id = ps.product_id AND ps.isDeleted = 0
      LEFT JOIN brand b ON ps.brand_id = b.id
      LEFT JOIN material m ON ps.material_id = m.id
      WHERE p.id = ? AND p.isDeleted = 0
      `,
      [productId]
    );

    if (productRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到該商品",
      });
    }

    // 並行查詢圖片與變體
    const [imageRows, variantRows] = await Promise.all([
      pool.execute(
        `
        SELECT 
          id, imgUrl, isMain
        FROM product_image
        WHERE product_id = ? 
        AND isDeleted = 0
        ORDER BY isMain DESC, id ASC
        `,
        [productId]
      ),
      pool.execute(
        `
        SELECT 
          pv.id as variant_id,
          pv.stock,
          c.id as color_id,
          c.name as color_name,
          c.code as color_code,
          s.id as size_id,
          s.name as size_name
        FROM product_variant pv
        JOIN color c ON pv.color_id = c.id
        JOIN size s ON pv.size_id = s.id
        WHERE pv.product_id = ?
        `,
        [productId]
      ),
    ]);

    const product = productRows[0];

    // 使用 Map去重  是一種js的資料結構，可以快速查找資料
    const colorMap = new Map();
    const sizeMap = new Map();

    /* 
[
  { variant_id: 1, color_id: 1, color_name: "紅色", color_code: "#FF0000", size_id: 1, size_name: "S" },
  { variant_id: 2, color_id: 1, color_name: "紅色", color_code: "#FF0000", size_id: 2, size_name: "M" },
  { variant_id: 3, color_id: 2, color_name: "藍色", color_code: "#0000FF", size_id: 1, size_name: "S" }
]


*/
    variantRows[0].forEach((v) => {
      if (!colorMap.has(v.color_id)) {
        colorMap.set(v.color_id, {
          id: v.color_id,
          name: v.color_name,
          code: v.color_code,
        });
      }
      if (!sizeMap.has(v.size_id)) {
        sizeMap.set(v.size_id, {
          id: v.size_id,
          name: v.size_name,
        });
      }
    });

    // 開始塞資料
    const finalProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      original_price: product.original_price,
      status: product.status,
      stock: product.stock,
      brand_name: product.brand_name,
      brand_description: product.brand_description,
      material_name: product.material_name,
      images: imageRows[0].map((img) => img.imgUrl),
      // 轉成陣列
      colors: Array.from(colorMap.values()),
      sizes: Array.from(sizeMap.values()),

      variants: variantRows[0].map((v) => ({
        id: v.variant_id,
        color_id: v.color_id,
        size_id: v.size_id,
        stock: v.stock,
      })),
    };

    res.json({
      status: "success",
      data: finalProduct,
    });
  } catch (error) {
    console.error("資料庫查詢錯誤:", error);
    res.status(500).json({
      status: "error",
      message: "資料庫查詢錯誤",
      error: error.message,
    });
  }
});

export default router;
