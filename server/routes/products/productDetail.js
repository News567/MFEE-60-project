// routes/products/productDetail.js
import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const productSql = `
      SELECT 
        p.*, 
        b.name AS brand_name,
        (
          SELECT COUNT(*) 
          FROM reviews pr 
          WHERE pr.product_id = p.id
        ) AS review_count,
        (
          SELECT COALESCE(AVG(rating), 0)
          FROM reviews pr
          WHERE pr.product_id = p.id
        ) AS rating
      FROM product p
      LEFT JOIN brand b ON p.brand_id = b.id
      WHERE p.id = ?
    `;
    const [productRows] = await pool.execute(productSql, [productId]);
    if (productRows.length === 0) {
      return res.status(404).json({ status: "error", message: "目前無此商品" });
    }
    const product = productRows[0];

    const variantsSql = `
      SELECT 
        pv.*,
        c.name AS color_name,
        c.color_code,
        s.name AS size_name
      FROM product_variant pv
      LEFT JOIN color c ON pv.color_id = c.id
      LEFT JOIN size s ON pv.size_id = s.id
      WHERE pv.product_id = ? AND pv.isDeleted = 0
    `;
    const [variants] = await pool.execute(variantsSql, [productId]);

    const colors = [];
    const sizes = [];
    const colorMap = new Map();
    const sizeMap = new Map();

    variants.forEach((variant) => {
      if (variant.color_id && !colorMap.has(variant.color_id)) {
        colorMap.set(variant.color_id, {
          id: variant.color_id,
          name: variant.color_name,
          code: variant.color_code,
        });
      }
      if (variant.size_id && !sizeMap.has(variant.size_id)) {
        sizeMap.set(variant.size_id, {
          id: variant.size_id,
          name: variant.size_name,
        });
      }
    });

    product.colors = Array.from(colorMap.values());
    product.sizes = Array.from(sizeMap.values());
    product.variants = variants;

    const imagesSql = `
    SELECT pi.image_url, pi.variant_id
    FROM product_images pi
    WHERE pi.product_id = ?
    ORDER BY pi.is_main DESC, pi.sort_order ASC
  `;
    const [images] = await pool.execute(imagesSql, [productId]);

    // 建立一個變體對應的圖片 Map
    const variantImageMap = new Map();
    images.forEach((img) => {
      if (!variantImageMap.has(img.variant_id)) {
        variantImageMap.set(img.variant_id, []);
      }
      variantImageMap.get(img.variant_id).push(img.image_url);
    });

    // 把圖片加入對應變體
    product.variants = product.variants.map((variant) => ({
      ...variant,
      images: variantImageMap.get(variant.id) || [],
    }));

    // 獨立出商品的主要圖片（不屬於變體）
    product.images = variantImageMap.get(null) || [];

    res.json({ status: "success", data: product });
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({
      status: "error",
      message: "Database query error",
      error: error.message,
    });
  }
});

export default router;
