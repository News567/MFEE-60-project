import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT * FROM activity WHERE id = ${id}`;
        const [rows] = await pool.execute(sql);
        // console.log(rows);
        res.status(200).json({ status: "success",message:"成功取得資料", data: rows });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});
export default router;
