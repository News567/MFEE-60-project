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
    const maxPrice = req.query.maxPrice || 1000000;

    // 設定當頁第一項資料
    const firstActivity = (page - 1) * limit;

    // 設定排序
    const sort = parseInt(req.query.sort) || 1;
    let orderBy = "id ASC";
    if (sort === 2) orderBy = "created_at DESC";
    if (sort === 3) orderBy = "price ASC";
    if (sort === 4) orderBy = "price DESC";

    // 設定行程時間查詢
    const duration = req.query.duration;
    let durationCondition = "";

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
            WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice}
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?`;
        if (location) {
            sql = `
                SELECT 
                    activity.*, 
                    activity_country.name AS country,
                    activity_city.name AS city_name, 
                    activity_image.imgUrl AS main_image
                FROM activity
                LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
                LEFT JOIN activity_image ON activity.id = activity_image.activity_id AND activity_image.isMain = 1
                LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
                WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice}
                AND
                activity.activityCity_id = ${location}
                ORDER BY ${orderBy}
                LIMIT ? OFFSET ?`;
        }
        if (language) {
            // 確保 language 是陣列，如果不是，就轉換成陣列
            const languageArray = Array.isArray(language)
                ? language
                : [language];
            if (languageArray.length > 1) {
                const languageCondition = languageArray
                    .map((v, i) => {
                        return `activity.language LIKE '%${v}%'`;
                    })
                    .join(" OR ");
                sql = `
                    SELECT 
                        activity.*, 
                        activity_country.name AS country,
                        activity_city.name AS city_name, 
                        activity_image.imgUrl AS main_image
                    FROM activity
                    LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
                    LEFT JOIN activity_image ON activity.id = activity_image.activity_id AND activity_image.isMain = 1
                    LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
                    WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice}
                AND ${languageCondition}
                    ORDER BY ${orderBy}
                    LIMIT ? OFFSET ?`;
                console.log(sql);
            } else {
                sql = `
                SELECT 
                    activity.*, 
                    activity_country.name AS country,
                    activity_city.name AS city_name, 
                    activity_image.imgUrl AS main_image
                FROM activity
                LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
                LEFT JOIN activity_image ON activity.id = activity_image.activity_id AND activity_image.isMain = 1
                LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
                WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice}
                AND activity.language LIKE '%${languageArray[0]}%'
                ORDER BY ${orderBy}
                LIMIT ? OFFSET ?`;
            }
        }
        if (country) {
            console.log("country" + country);
            sql = `
                SELECT 
                    activity.*, 
                    activity_country.name AS country,
                    activity_city.name AS city_name, 
                    activity_image.imgUrl AS main_image
                FROM activity
                LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
                LEFT JOIN activity_image ON activity.id = activity_image.activity_id AND activity_image.isMain = 1
                LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
                WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice}
                AND activity_country.name LIKE '%${country}%'
                ORDER BY ${orderBy}
                LIMIT ? OFFSET ?`;
        }
        if (duration) {
            let durationArray = [];
            switch (duration) {
                case "less4":
                    console.log("less4");
                    durationArray=["1小時", "2小時", "3小時", "4小時"];
                    durationCondition = durationArray
                        .map((v) => {
                            return `activity.duration LIKE '%${v}%'`;
                        })
                        .join(" OR ");
                    break;
                case "4toDay":
                    console.log("4toDay");
                    durationArray = [
                        "5小時",
                        "6小時",
                        "7小時",
                        "8小時",
                        "9小時",
                        "10小時",
                        "11小時",
                        "12小時",
                        "13小時"
                    ];
                    durationCondition = durationArray
                        .map((v) => {
                            return `activity.duration LIKE '%${v}%'`;
                        })
                        .join(" OR ");
                    break;

                case "oneToTwo":
                    durationArray = [
                        "1日",
                        "1天",
                        "1.5日",
                        "1.5天",
                        "2日",
                        "2天"
                    ];
                    durationCondition = durationArray
                        .map((v) => {
                            return `activity.duration LIKE '%${v}%'`;
                        })
                        .join(" OR ");
                    break;
                case "twoDaysUp":
                    break;
            }
            sql = `
            SELECT 
                activity.*, 
                activity_country.name AS country,
                activity_city.name AS city_name, 
                activity_image.imgUrl AS main_image
            FROM activity
            LEFT JOIN activity_city ON activity.activityCity_id = activity_city.id
            LEFT JOIN activity_image ON activity.id = activity_image.activity_id AND activity_image.isMain = 1
            LEFT JOIN activity_country ON activity_city.activityCountry_id = activity_country.id
            WHERE activity.price BETWEEN ${minPrice} AND ${maxPrice}
            AND ${durationCondition}
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?`;
        }

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
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});

export default router;
