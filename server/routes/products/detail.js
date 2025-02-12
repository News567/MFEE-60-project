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

    // 2. 查詢商品圖片
    const [imageRows] = await pool.execute(
      `
      SELECT id, imgUrl, isMain
      FROM product_image
      WHERE product_id = ? AND isDeleted = 0
      ORDER BY isMain DESC, id ASC
      `,
      [productId]
    );

    // 3. 查詢商品規格（顏色和尺寸）
    const [variantRows] = await pool.execute(
      `
      SELECT DISTINCT
        c.id as color_id,
        c.name as color_name,
        c.code as color_code,
        s.id as size_id,
        s.name as size_name,
        pv.stock,
        pv.price as variant_price
      FROM product_variant pv
      JOIN color c ON pv.color_id = c.id
      JOIN size s ON pv.size_id = s.id
      WHERE pv.product_id = ?
      `,
      [productId]
    );

    // 4. 整理資料格式
    const product = productRows[0];
    const finalProduct = {
      ...product,
      images: imageRows.map((img) => img.imgUrl),
      colors: [
        ...new Set(
          variantRows.map((v) => ({
            id: v.color_id,
            name: v.color_name,
            code: v.color_code,
          }))
        ),
      ],
      sizes: [...new Set(variantRows.map((v) => v.size_name))],
      variants: variantRows.map((v) => ({
        color_id: v.color_id,
        size_id: v.size_id,
        stock: v.stock,
        price: v.variant_price,
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
    });
  }
});

export default router;
