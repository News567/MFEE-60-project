import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.post("/myGroup", async (req, res) => {
    try {
        // res.json({message:"連接我的揪團成功"})
        const user = req.body.user
        const status = req.body.status || 0
        console.log(user);
        const groupIdSearchSql = `SELECT groups_id FROM groups_participants WHERE user_id = ${user} `
        const [getGroup] = await pool.execute(groupIdSearchSql)
        const groupId = [...new Set(getGroup.map(v => v.groups_id))]
        if (!groupId) {
            res.status(200).json({
                status: "error",
                message: "沒有相關資料"
            });
        }
        console.log(groupId);
        let sql = `SELECT groups.*, activity_city.name AS city_name, groups_image.img_url AS group_img FROM groups 
        LEFT JOIN activity_city ON groups.groups_city_id = activity_city.id
        LEFT JOIN groups_image ON groups.id = groups_image.groups_id 
        WHERE groups.user_id = ${user} `;
        
        let groupConditionArray = []
        groupId.forEach((v)=>{
            groupConditionArray.push(` groups.id = ${v} `)
        })
        const groupCondition = groupConditionArray.join(" OR ")
        sql += `OR ${groupCondition}`
        sql += ` ORDER BY sign_end_date ASC `
        // console.log(sql);
        const [rows] = await pool.execute(sql);
        console.log(rows);
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
