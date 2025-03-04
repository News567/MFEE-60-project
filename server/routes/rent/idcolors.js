// 用於獲取指定商品的所有顏色選項，在購物車修改顏色的時候使用

import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

router.get("/:id/colors", async (req, res) => {
  const { id } = req.params; // 獲取商品 ID

  try {
    // 1. 從 cart_rental_items 表中獲取 rental_id
    const [cartItem] = await pool.execute(
      `SELECT rental_id FROM cart_rental_items WHERE id = ?`,
      [id]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到指定的購物車項目",
      });
    }

    const rentalId = cartItem[0].rental_id; // 獲取 rental_id

    // 2. 查詢該商品的所有顏色選項
    const [colors] = await pool.execute(
      `SELECT 
        rc.id AS color_id,
        rc.name AS color_name,
        rc.rgb AS color_rgb
      FROM rent_specification rs
      JOIN rent_color rc ON rs.color_id = rc.id
      WHERE rs.rent_item_id = ?`, // 使用 rental_id 來查詢顏色
      [rentalId]
    );

    res.json({
      success: true,
      data: colors,
    });
  } catch (error) {
    console.error("獲取商品顏色選項失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取商品顏色選項失敗",
    });
  }
});

export default router;
