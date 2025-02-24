import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // res.json({message:"連接成功"})
        const sql = `SELECT groups.*, activity_city.name AS city_name, groups_image.img_url AS group_img FROM groups 
        LEFT JOIN activity_city ON groups.groups_city_id = activity_city.id
        LEFT JOIN groups_image ON groups.id = groups_image.groups_id
        ORDER BY created_at DESC `;
        const [rows] = await pool.execute(sql);
        // console.log(rows[0]);
        res.status(200).json({
            status: "success",
            message: "成功獲取資料",
            data: rows,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});

export default router;
