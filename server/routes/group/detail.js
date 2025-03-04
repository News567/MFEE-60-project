import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/list/:id", async (req, res) => {
    try {
        // res.json({message:"連接成功"})
        const id = req.params.id;
        const sql = `SELECT groups.*, 
        activity_city.name AS city_name, 
        groups_image.img_url AS group_img, 
        activity_country.name AS country_name, 
        users.name AS user_name,
        COUNT(groups_participants.id) AS participant_number
        FROM groups 
        LEFT JOIN activity_city ON groups.groups_city_id = activity_city.id
        LEFT JOIN groups_image ON groups.id = groups_image.groups_id
        LEFT JOIN activity_country ON activity_city.activity_country_id = activity_country.id
        LEFT JOIN users ON groups.user_id = users.id
        LEFT JOIN groups_participants ON groups_participants.groups_id = groups.id
        WHERE groups.id = ${id}
        GROUP BY groups.id, activity_city.name, groups_image.img_url, activity_country.name, users.name `
        const [rows] = await pool.execute(sql);
        console.log(rows[0]);
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