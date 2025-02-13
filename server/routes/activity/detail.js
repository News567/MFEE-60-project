import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/:id", (req, res) => {
    try {
        console.log(req.params.id);
        res.status(200).json({ message: "成功連接" });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});
export default router;
