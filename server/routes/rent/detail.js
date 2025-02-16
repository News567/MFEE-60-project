import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 根據 ID 獲取單個租借商品
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT 
        ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2, 
        ri.stock, ri.created_at, ri.updated_at, ri.deposit, ri.is_like, 
        rcs.name AS category_small, rcb.name AS category_big
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.product_category_big_id = rcb.id
      WHERE ri.id = ? AND ri.is_deleted = FALSE
    `, [id]);

    if (rows.length > 0) {
      const product = rows[0];

      // 獲取商品規格
      const [specifications] = await pool.query(`
        SELECT rs.id, c.name AS color, t.name AS thickness
        FROM rent_specification rs
        JOIN color c ON rs.color_id = c.id
        LEFT JOIN thickness t ON rs.thickness_id = t.id
        WHERE rs.rent_item_id = ? AND rs.is_deleted = FALSE
      `, [id]);

      product.specifications = specifications;
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;