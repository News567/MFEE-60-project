// server/routes/article/update.js
import express from "express";
import multer from "multer";
import { pool } from "../../config/mysql.js";

const router = express.Router();
const upload = multer();

router.put("/:id", upload.single("coverImage"), async (req, res) => {
  const { id } = req.params;
  const { title, content, article_category_small_id, tags, status } = req.body;

  const connection = await pool.getConnection();

  try {
    // 開始交易
    await connection.beginTransaction();

    // 1. 更新文章基本資訊
    await connection.execute(
      `
      UPDATE article 
      SET 
        title = ?, 
        content = ?, 
        article_category_small_id = ?, 
        status = ?, 
        updated_at = NOW()
      WHERE id = ?
      `,
      [
        title || null, // 確保 title 不是 undefined
        content || null, // 確保 content 不是 undefined
        article_category_small_id || null, // 確保 article_category_small_id 不是 undefined
        status || "draft", // 確保 status 不是 undefined
        id,
      ]
    );

    // 2. 刪除舊的標籤
    await connection.execute(
      `DELETE FROM article_tag_big WHERE article_id = ?`,
      [id]
    );

    // 3. 插入新的標籤
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await connection.execute(
          `
          INSERT INTO article_tag_big (article_id, article_tag_small_id)
          SELECT ?, id FROM article_tag_small WHERE tag_name = ?
          `,
          [id, tag || null] // 確保 tag 不是 undefined
        );
      }
    }

    // 4. 處理封面圖片
    if (req.file) {
      const coverImagePath = `/uploads/article/${req.file.filename}`;
      await connection.execute(
        `UPDATE article_image SET img_url = ? WHERE article_id = ? AND is_main = 1`,
        [coverImagePath, id]
      );
    }

    // 提交交易
    await connection.commit();

    // 回傳成功訊息
    res.json({
      status: "success",
      message: "文章已成功更新",
    });
  } catch (error) {
    // 回滾交易
    await connection.rollback();

    console.error("❌ 更新文章失敗：", error);

    res.status(500).json({
      status: "error",
      message: "更新文章失敗",
      error: error.message,
    });
  } finally {
    // 釋放連接
    connection.release();
  }
});

export default router;