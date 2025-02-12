import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const [brands] = await pool.execute(`SELECT id, name FROM brand`);
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: "無法取得品牌資料" });
  }
});

export default router;
