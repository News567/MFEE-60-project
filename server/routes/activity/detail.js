import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT activity.*, activity_city.name AS city_name, activity_country.name AS country, GROUP_CONCAT(activity_image.img_url) AS images
    FROM activity 
    LEFT JOIN activity_image ON activity.id = activity_image.activity_id
    LEFT JOIN activity_city ON activity.activity_city_id = activity_city.id
    LEFT JOIN activity_country ON activity_city.activity_country_id = activity_country.id
    WHERE activity.id = ?
    GROUP BY activity.id `;
        const [rows] = await pool.execute(sql, [id]);

        const projectSQL = `SELECT * FROM activity_project WHERE activity_id = ${id}`;
        const [project] = await pool.execute(projectSQL);

        const citiyId = rows[0].activity_city_id;
        const recommendSQL = `SELECT activity.*, activity_image.img_url, activity_city.name AS recommedCity
                                FROM activity
                                LEFT JOIN activity_image ON activity_image.activity_id = activity.id
                                LEFT JOIN activity_city ON activity.activity_city_id = activity_city.id
                                WHERE activity.activity_city_id = ${citiyId} AND activity_image.is_main = 1 AND activity.id <> ${id}
                                ORDER BY activity.price DESC `;
        const [recommend] = await pool.execute(recommendSQL);
        console.log(rows);
        res.status(200).json({
            status: "success",
            message: "成功取得資料",
            data: rows,
            project: project,
            recommend: recommend,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});
export default router;
