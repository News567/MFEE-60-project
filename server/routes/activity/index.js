import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/", async (req, res) => {
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;
    const sort = parseInt(req.query.sort) || 1;
    const firstActivity = (page - 1) * limit;
    let orderBy = "id ASC";
    if (sort === 2) orderBy = "created_at DESC";
    if (sort === 3) orderBy = "price ASC";
    if (sort === 4) orderBy = "price DESC";

    try {
        const sql = `SELECT 
    a.*, 
    ac.name AS city_name, 
    ai.imgUrl AS main_image
FROM activity a
LEFT JOIN activity_city ac ON a.activityCity_id = ac.id
LEFT JOIN activity_image ai ON a.id = ai.activity_id AND ai.isMain = 1
ORDER BY ${orderBy}
LIMIT ? OFFSET ?;
`;
        const [rows] = await pool.execute(sql, [limit, firstActivity]);
        // 取得產品總數
        const [[{ totalCount }]] = await pool.execute(`
        SELECT COUNT(*) AS totalCount FROM activity
      `);
        const totalPages = Math.ceil(totalCount / limit);

        // const totalPages =
        console.log(rows);
        res.status(200).json({
            status: "success",
            data: rows,
            message: "取得資料成功",
            // TODO: 回傳分頁資料給前端
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});

export default router;
