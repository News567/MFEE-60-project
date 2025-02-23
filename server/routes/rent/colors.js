import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 獲取所有顏色
router.get("/colors", async (req, res) => {
  try {
    const query = "SELECT id, name, rgb FROM rent_color"; // 從 rent_color 表中獲取所有顏色
    const [rows] = await pool.query(query);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("獲取顏色資料失敗:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

// 獲取每個顏色下的商品
router.get("/colors/:colorId/items", async (req, res) => {
  const { colorId } = req.params; // 從 URL 參數中獲取 colorId

  try {
    const query = `
      SELECT 
        ri.id AS item_id,
        ri.name AS item_name,
        ri.price,
        ri.price2,
        ri.description,
        ri.description2,
        ri.stock,
        ri.created_at,
        ri.update_at,
        ri.deposit,
        ri.is_like,
        ri_img.img_url AS img_url
      FROM 
        rent_specification rs
      JOIN 
        rent_item ri ON rs.rent_item_id = ri.id
      LEFT JOIN 
        rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
      WHERE 
        rs.color_id = ?;
    `;

    console.log("顏色資料:", colors);
    
    const [rows] = await pool.query(query, [colorId]);

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("獲取顏色下的商品資料失敗:", err);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;