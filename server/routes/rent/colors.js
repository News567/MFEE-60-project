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

export default router;
