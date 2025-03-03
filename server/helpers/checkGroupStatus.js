import express from "express";
import { pool } from "../config/mysql.js";
import { sendJoinGroupCancelMail, sendHostGroupCancelMail } from "../lib/mail.js";

export async function checkAndUpdateGroupStatus() {
    try {
        const sql = "SELECT groups.* ,users.email AS email FROM groups JOIN users ON users.id = groups.user_id WHERE groups.status = 0"
        const now = new Date()
        const [rows] = await pool.execute(sql)
        // console.log(rows);
        for (const row of rows) { // ✅ 改用 for...of
            if (new Date(row.sign_end_date) < now) {
                await pool.execute("UPDATE groups SET status = 2 WHERE id = ?", [row.id]); // ✅ 修正 SQL Injection
                console.log(`揪團id${row.id} ${row.name} 超過報名截止日期，已自動取消`);
                const getParticipants = `
                                            SELECT DISTINCT users.email, groups_participants.user_id
                                            FROM groups_participants
                                            JOIN users ON groups_participants.user_id = users.id
                                            WHERE groups_participants.groups_id = ${row.id};
                                            `;
                    const [participants] = await pool.execute(getParticipants)
                    for (const participant of participants) {
                        await sendJoinGroupCancelMail(participant.email, row.name, row.date);
                    }
                await sendHostGroupCancelMail(row.email, row.name, row.date)
            }
        }
    } catch (error) {
        console.log(error);
    }
}