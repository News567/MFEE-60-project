import multer from 'multer';  // 使用 ES 模块导入
// 或者如果使用 CommonJS 语法：
// const multer = require('multer');

import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.post("/", upload.single("cover_image"), async (req, res) => {
  const { title, content, article_category_small_id, users_id, tags } = req.body;
  const coverImage = req.file;

  try {
    // 插入文章
    const [articleResult] = await pool.execute(
      `
      INSERT INTO article (title, content, article_category_small_id, users_id)
      VALUES (?, ?, ?, ?)
      `,
      [title, content, article_category_small_id, users_id]
    );

    const articleId = articleResult.insertId;

    // 處理封面圖片
    if (coverImage) {
      await pool.execute(
        `
        INSERT INTO article_image (article_id, img_url, is_main)
        VALUES (?, ?, TRUE)
        `,
        [articleId, `/uploads/${coverImage.filename}`]
      );
    }

    // 處理標籤
    const tagList = JSON.parse(tags);
    for (const tagName of tagList) {
      // 檢查標籤是否存在
      const [tagResult] = await pool.execute(
        `
        SELECT id FROM article_tag_small WHERE tag_name = ?
        `,
        [tagName]
      );

      let tagId;
      if (tagResult.length === 0) {
        // 如果標籤不存在，則創建新標籤
        const [newTagResult] = await pool.execute(
          `
          INSERT INTO article_tag_small (tag_name)
          VALUES (?)
          `,
          [tagName]
        );
        tagId = newTagResult.insertId;
      } else {
        tagId = tagResult[0].id;
      }

      // 將標籤與文章關聯
      await pool.execute(
        `
        INSERT INTO article_tag_big (article_id, article_tag_small_id)
        VALUES (?, ?)
        `,
        [articleId, tagId]
      );
    }

    res.json({
      status: "success",
      articleId,
    });
  } catch (error) {
    console.error("❌ 創建文章失敗：", error);
    res.status(500).json({
      status: "error",
      message: "創建文章失敗",
    });
  }
});

export default router;
