import express from "express";
import { pool } from "../../config/mysql.js";
import { sendJoinGroupSuccessMail, sendHostGroupSuccessMail } from "../../lib/mail.js";


const router = express.Router();

router.post("/join", async (req, res) => {
    try {
        console.log("連接成功");
        const group = parseInt(req.body.group_id)
        const user = parseInt(req.body.user_id)
        const count = parseInt(req.body.number)
        const groupName = req.body.group_name
        const groupDate = req.body.group_date
        let values = []
        for (let i = 0; i < count; i++) {
            values.push(`(${group}, ${user})`);
        }
        const sql = `INSERT INTO groups_participants (groups_id, user_id) VALUES ${values.join(",")}`;
        const result = await pool.execute(sql)
        console.log(result);
        const checkNumber = `
                            SELECT COUNT(groups_participants.id) AS participant_number
                            FROM groups
                            JOIN groups_participants ON groups.id = groups_participants.groups_id
                            WHERE groups.id = ${group}`;
        const [nowNumber] = await pool.execute(checkNumber)
        console.log(nowNumber[0].participant_number);
        const searchMaxNumber = `SELECT max_number FROM groups WHERE id = ${group}`
        const [maxNumber] = await pool.execute(searchMaxNumber)
        console.log(maxNumber[0].max_number);
        if (nowNumber[0].participant_number >= maxNumber[0].max_number) {
            const updateStatus = `UPDATE groups SET status = 1 WHERE id = ${group} `
            const doUpdateStatus = await pool.execute(updateStatus)
            console.log(doUpdateStatus);
            const getParticipants = `
                                    SELECT DISTINCT users.email, groups_participants.user_id
                                    FROM groups_participants
                                    JOIN users ON groups_participants.user_id = users.id
                                    WHERE groups_participants.groups_id = ${group};
                                    `;
            const [participants] = await pool.execute(getParticipants)
            const link = `http://localhost:3000/group/list/${group}`
            for (const participant of participants) {
                await sendJoinGroupSuccessMail(participant.email, groupName, groupDate, link);
            }
            const searchHoster = `SELECT users.email, groups.user_id FROM users JOIN groups ON groups.user_id = users.id WHERE groups.id = ${group}`
            const [hoster] = await pool.execute(searchHoster)
            await sendHostGroupSuccessMail(hoster[0].email,groupName, groupDate, link)
        }
        res.status(200).json({
            status: "success",
            message: "新建跟團資料成功"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: error.message ? error.message : "新建失敗",
        });
    }
});

export default router;
