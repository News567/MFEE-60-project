import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT activity.*, activity_city.name AS city_name, activity_country.name AS country, GROUP_CONCAT(activity_image.imgUrl) AS images
    FROM activity 
    LEFT JOIN activity_image ON activity.id = activity_image.activity_id
    LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
    LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
    WHERE activity.id = ?
    GROUP BY activity.id `;
        const [rows] = await pool.execute(sql,[id]);
        console.log(rows);
        res.status(200).json({ status: "success",message:"成功取得資料", data: rows });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});
export default router;
