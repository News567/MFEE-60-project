import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // res.json({message:"連接成功"})
        const sql = `SELECT groups.*, activity_city.name AS city_name, groups_image.img_url AS group_img , COUNT(groups_participants.id) AS participant_number FROM groups
        LEFT JOIN activity_city ON groups.groups_city_id = activity_city.id
        LEFT JOIN groups_image ON groups.id = groups_image.groups_id
        LEFT JOIN groups_participants ON groups_participants.groups_id = groups.id
        GROUP BY groups.id, activity_city.name, groups_image.img_url
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
