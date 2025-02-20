import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 获取文章留言
router.get("/", async (req, res) => {
  const { articleId } = req.params;

  try {
    // 查询留言
    const [replies] = await pool.execute(`
      SELECT 
        r.id, r.content, r.floor_number, r.reply_number, r.level, r.created_at, r.member_id,
        m.username AS member_name
      FROM article_reply r
      JOIN member m ON r.member_id = m.id
      WHERE r.article_id = ? AND r.is_deleted = FALSE
      ORDER BY r.created_at DESC
    `, [articleId]);

    res.json({
      status: "success",
      replies
    });
  } catch (error) {
    console.error("❌ 获取留言失败：", error);
    res.status(500).json({
      status: "error",
      message: "获取留言失败",
      error: error.message,
    });
  }
});

// 新增文章留言
router.post("/:articleId", async (req, res) => {
  const { articleId } = req.params;
  const { content, memberId } = req.body;

  try {
    // 新增留言
    const [result] = await pool.execute(`
      INSERT INTO article_reply (article_id, content, member_id, floor_number, level, created_at)
      VALUES (?, ?, ?, 1, 1, NOW())
    `, [articleId, content, memberId]);

    res.json({
      status: "success",
      replyId: result.insertId
    });
  } catch (error) {
    console.error("❌ 新增留言失败：", error);
    res.status(500).json({
      status: "error",
      message: "新增留言失败",
      error: error.message,
    });
  }
});

// 回复留言
router.post("/:articleId/:replyId", async (req, res) => {
  const { articleId, replyId } = req.params;
  const { content, memberId } = req.body;

  try {
    // 回复留言
    const [result] = await pool.execute(`
      INSERT INTO article_reply (article_id, content, member_id, reply_number, level, created_at)
      VALUES (?, ?, ?, ?, 2, NOW())
    `, [articleId, content, memberId, replyId]);

    res.json({
      status: "success",
      replyId: result.insertId
    });
  } catch (error) {
    console.error("❌ 回复留言失败：", error);
    res.status(500).json({
      status: "error",
      message: "回复留言失败",
      error: error.message,
    });
  }
});

export default router;
