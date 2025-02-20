import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 文章点赞/倒赞
router.post("/article/like/:id", async (req, res) => {
  const { id } = req.params;
  const { memberId, isLike } = req.body; // isLike: true for like, false for dislike

  try {
    // 检查用户是否已经对该文章点赞/倒赞
    const [existingLike] = await pool.execute(`
      SELECT * FROM article_like WHERE article_id = ? AND member_id = ?
    `, [id, memberId]);

    if (existingLike.length > 0) {
      // 如果已经存在，更新状态
      await pool.execute(`
        UPDATE article_like 
        SET is_like = ?
        WHERE article_id = ? AND member_id = ?
      `, [isLike, id, memberId]);
    } else {
      // 否则，新增点赞记录
      await pool.execute(`
        INSERT INTO article_like (article_id, member_id, is_like)
        VALUES (?, ?, ?)
      `, [id, memberId, isLike]);
    }

    res.json({
      status: "success",
      message: isLike ? "点赞成功" : "倒赞成功"
    });
  } catch (error) {
    console.error("❌ 文章点赞/倒赞失败：", error);
    res.status(500).json({
      status: "error",
      message: "文章点赞/倒赞失败",
      error: error.message,
    });
  }
});

// 留言点赞/倒赞
router.post("/reply/like/:replyId", async (req, res) => {
  const { replyId } = req.params;
  const { memberId, isLike } = req.body; // isLike: true for like, false for dislike

  try {
    // 检查用户是否已经对该留言点赞/倒赞
    const [existingLike] = await pool.execute(`
      SELECT * FROM article_reply_like WHERE reply_id = ? AND member_id = ?
    `, [replyId, memberId]);

    if (existingLike.length > 0) {
      // 如果已经存在，更新状态
      await pool.execute(`
        UPDATE article_reply_like 
        SET is_like = ?
        WHERE reply_id = ? AND member_id = ?
      `, [isLike, replyId, memberId]);
    } else {
      // 否则，新增点赞记录
      await pool.execute(`
        INSERT INTO article_reply_like (reply_id, member_id, is_like)
        VALUES (?, ?, ?)
      `, [replyId, memberId, isLike]);
    }

    res.json({
      status: "success",
      message: isLike ? "留言点赞成功" : "留言倒赞成功"
    });
  } catch (error) {
    console.error("❌ 留言点赞/倒赞失败：", error);
    res.status(500).json({
      status: "error",
      message: "留言点赞/倒赞失败",
      error: error.message,
    });
  }
});

export default router;
