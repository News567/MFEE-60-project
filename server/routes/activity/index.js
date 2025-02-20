import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.get("/", async (req, res) => {
    console.log(req.query);
    // 從前端送來的網址抓取的篩選條件
    // 頁數
    const page = parseInt(req.query.page) || 1;
    // 每頁幾筆
    const limit = parseInt(req.query.limit) || 24;
    // 城市
    const location = parseInt(req.query.location) || null;
    // 國家
    const country = req.query.country;
    // 語言
    const language = req.query.language;
    // 價格區間
    const minPrice = req.query.minPrice || 1;
    const maxPrice = req.query.maxPrice || 10000000;

    // 設定當頁第一項資料
    const firstActivity = (page - 1) * limit;

    // 設定排序
    const sort = parseInt(req.query.sort) || 1;
    let orderBy = "id ASC";
    if (sort === 2) orderBy = "created_at DESC";
    if (sort === 3) orderBy = "price ASC";
    if (sort === 4) orderBy = "price DESC";

    // 設定行程時間查詢
    let duration = req.query.duration;

    try {
        let sql = `SELECT 
                activity.*, 
                activity_country.name AS country,
                activity_city.name AS city_name, 
                activity_image.imgUrl AS main_image
            FROM activity
            LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
            LEFT JOIN activity_image ON activity.id = activity_image.activity_id AND activity_image.isMain = 1
            LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
            WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice} `

        if (location) {
            sql += ` AND activity.activityCity_id = ${location} `
        }
        if (language) {
            // 確保 language 是陣列，如果不是，就轉換成陣列
            const languageArray = Array.isArray(language)
                ? language
                : [language];
            if (languageArray.length > 1) {
                const languageCondition = languageArray
                    .map((v) => {
                        return `activity.language LIKE '%${v}%'`;
                    })
                    .join(" OR ");
                sql += ` AND (${languageCondition}) `;
                console.log(sql);
            } else {
                sql += ` AND activity.language LIKE '%${languageArray[0]}%' `;
            }
        }
        if (country) {
            sql += ` AND activity_country.name LIKE '%${country}%' `;
        }
        if (duration) {
            const durationArray = (Array.isArray(duration) ? duration : [duration])
            let selectedDurations = []
            durationArray.forEach((v) => {
                if (v == "less4") {
                    selectedDurations.push("1小時", "2小時","2.5小時", "3小時", "4小時")
                }
                if (v == "4toDay") {
                    selectedDurations.push("5小時",
                        "6小時",
                        "7小時",
                        "8小時",
                        "9小時",
                        "10小時",
                        "11小時",
                        "12小時",
                        "13小時")

                }
                if (v == "oneToTwo") {
                    selectedDurations.push("1日",
                        "1天",
                        "1.5日",
                        "1.5天",
                        "2日",
                        "2天")
                }
                if (v == "twoDaysUp") {
                    selectedDurations.push("3日", "4日", "5日", "6日", "7日")
                }
            })
            if (selectedDurations.length > 0) {
                const durationCondition = selectedDurations
                    .map((v) => {
                        return `activity.duration LIKE '%${v}%'`;
                    })
                    .join(" OR ");
                sql += ` AND (${durationCondition}) `;
            }
            // let durationArray = [];
            // if (duration == "less4") {
            //     durationArray = [...durationArray, "1小時", "2小時", "3小時", "4小時"];
            // }
            // if (duration == "4toDay") {
            //     durationArray = [...durationArray,
            //         "5小時",
            //         "6小時",
            //         "7小時",
            //         "8小時",
            //         "9小時",
            //         "10小時",
            //         "11小時",
            //         "12小時",
            //         "13小時"]
            // }
            // if (duration == "oneToTwo") {
            //     durationArray = [...durationArray,
            //         "1日",
            //         "1天",
            //         "1.5日",
            //         "1.5天",
            //         "2日",
            //         "2天"
            //     ]
            // }
            // if (duration == "twoDaysUp") {
            //     durationArray = [...durationArray, "3日", "4日", "5日", "6日", "7日"]
            // }

        }
        sql += ` ORDER BY ${orderBy}
        LIMIT ? OFFSET ? `;
        console.log(sql);
        const [rows] = await pool.execute(sql, [limit, firstActivity]);

        // 取得產品總數
        const [[{ totalCount }]] = await pool.execute(`
        SELECT COUNT(*) AS totalCount FROM activity
      `);
        const totalPages = Math.ceil(totalCount / limit);

        // const totalPages =
        // console.log(rows);
        res.status(200).json({
            status: "success",
            data: rows,
            message: "取得資料成功",
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
                limit,
            },
            sql: sql
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});

export default router;
