import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const sql = `SELECT 
    a.*, 
    ac.name AS city_name, 
    ai.imgUrl AS main_image
FROM activity a
LEFT JOIN activity_city ac ON a.activityCity_id = ac.id
LEFT JOIN activity_image ai ON a.id = ai.activity_id AND ai.isMain = 1;
`;
        const [rows] = await pool.execute(sql);
        // console.log(rows);
        res.status(200).json({
            status: "success",
            data: rows,
            message: "取得資料成功",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});

export default router;
