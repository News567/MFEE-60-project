import express from "express";
import { pool } from "../../config/mysql.js";
import { sendJoinGroupCancelMail } from "../../lib/mail.js";
const router = express.Router();

router.post("/myGroup", async (req, res) => {
    try {
        // res.json({message:"連接我的揪團成功"})
        const user = req.body.user
        const status = req.body.status || 0
        console.log(user);
        const groupIdSearchSql = `SELECT groups_id FROM groups_participants WHERE user_id = ?`;
        const [getGroup] = await pool.execute(groupIdSearchSql, [user]);

        const sql = `
                    SELECT groups.*, 
                        activity_city.name AS city_name, 
                        groups_image.img_url AS group_img,
                        COUNT(groups_participants.id) AS participant_number
                    FROM groups 
                    LEFT JOIN activity_city ON groups.groups_city_id = activity_city.id
                    LEFT JOIN groups_image ON groups.id = groups_image.groups_id
                    LEFT JOIN groups_participants ON groups.id = groups_participants.groups_id
                    WHERE groups.user_id = ? 
                    OR groups.id IN (SELECT groups_id FROM groups_participants WHERE user_id = ?)
                    GROUP BY groups.id, activity_city.name, groups_image.img_url
                    ORDER BY sign_end_date ASC
                    `;

        const [rows] = await pool.execute(sql, [user, user]);

        res.status(200).json({
            status: "success",
            message: "成功獲取資料",
            data: rows,
        });
        // const groupIdSearchSql = `SELECT groups_id FROM groups_participants WHERE user_id = ${user} `
        // const [getGroup] = await pool.execute(groupIdSearchSql)
        // const groupId = [...new Set(getGroup.map(v => v.groups_id))]
        // if (!groupId) {
        //     res.status(200).json({
        //         status: "error",
        //         message: "沒有相關資料"
        //     });
        // }
        // console.log(groupId);
        // let sql = `SELECT groups.*, activity_city.name AS city_name, groups_image.img_url AS group_img FROM groups 
        // LEFT JOIN activity_city ON groups.groups_city_id = activity_city.id
        // LEFT JOIN groups_image ON groups.id = groups_image.groups_id 
        // WHERE groups.user_id = ${user} `;

        // let groupConditionArray = []
        // groupId.forEach((v)=>{
        //     groupConditionArray.push(` groups.id = ${v} `)
        // })
        // const groupCondition = groupConditionArray.join(" OR ")
        // sql += `OR ${groupCondition}`
        // sql += ` ORDER BY sign_end_date ASC `
        // // console.log(sql);
        // const [rows] = await pool.execute(sql);
        // console.log(rows);
        // res.status(200).json({
        //     status: "success",
        //     message: "成功獲取資料",
        //     data: rows,
        // });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "取得資料失敗",
        });
    }
});
router.put("/myGroup/:id", async (req, res) => {
    const id = req.params.id
    const sql = `UPDATE groups SET status = 2 WHERE id = ${id} `
    await pool.execute(sql)
    const getParticipants = `
                            SELECT DISTINCT users.email, groups_participants.user_id
                            FROM groups_participants
                            JOIN users ON groups_participants.user_id = users.id
                            WHERE groups_participants.groups_id = ${id};
                            `;
    const [participants] = await pool.execute(getParticipants)
    for (const participant of participants) {
        await sendJoinGroupCancelMail(participant.email, groupName, groupDate);
    }
    res.status(200).json({
        status: "success",
        message: "成功取消揪團"
    });
});

export default router;
