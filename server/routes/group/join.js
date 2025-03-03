import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

router.post("/join", async (req, res) => {
    try {
        console.log("連接成功");
        const group = parseInt(req.body.group_id)
        const user = parseInt(req.body.user_id)
        const count = parseInt(req.body.number)
        let values = []
        for (let i = 0; i < count; i++) {
            values.push(`(${group}, ${user})`);
        }
        const sql = `INSERT INTO groups_participants (groups_id, user_id) VALUES ${values.join(",")}`;
        const result = await pool.execute(sql)
        console.log(result);
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
