import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

// 獲取文章詳情
router.get("/:id", async (req, res) => {
  try {
    const articleId = req.params.id;

    // 1. 查詢文章基本信息
    const [articleRows] = await pool.execute(
      `
      SELECT 
        a.*,
        acs.name AS category_small_name,
        acb.name AS category_big_name,
        u.name AS author_name,
        ai.img_url AS img_url  -- 只獲取 is_main = 1 的圖片
      FROM article a
      LEFT JOIN article_category_small acs ON a.article_category_small_id = acs.id
      LEFT JOIN article_category_big acb ON acs.category_big_id = acb.id
      LEFT JOIN users u ON a.users_id = u.id
      LEFT JOIN article_tag_big atb ON a.id = atb.article_id
      LEFT JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
      -- 連接圖片表，並抓取所有與該文章相關的圖片
LEFT JOIN article_image ai ON a.id = ai.article_id AND ai.is_main = 1      
      `,
      [articleId]
    );

    if (articleRows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到該文章",
      });
    }

    const article = articleRows[0];

    // 2. 查詢文章圖片
    const [imageRows] = await pool.execute(
      `
      SELECT img_url, is_main
      FROM article_image
      WHERE article_id = ?
      `,
      [articleId]
    );

    // 3. 查詢文章標籤
    const [tagRows] = await pool.execute(
      `
      SELECT ats.tag_name
      FROM article_tag_big atb
      JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
      WHERE atb.article_id = ?
      `,
      [articleId]
    );

    // 4. 查詢文章留言
    const [replyRows] = await pool.execute(
      `
      SELECT 
        ar.*,
        u.name AS author_name
      FROM article_reply ar
      LEFT JOIN users u ON ar.users_id = u.id
      WHERE ar.article_id = ? AND ar.is_deleted = FALSE
      ORDER BY ar.floor_number ASC, ar.reply_number ASC
      `,
      [articleId]
    );

    // 5. 更新文章瀏覽量
    // await pool.execute(
    //   `
    //   UPDATE article
    //   SET view_count = view_count + 1
    //   WHERE id = ?
    //   `,
    //   [articleId]
    // );

    // 整理回傳資料
    const finalArticle = {
      ...article,
      images: imageRows, // 使用 `imageRows` 而不是 `images`
      tags: tagRows.map((tag) => tag.tag_name),
      replies: replyRows,
    };
    res.json({
      status: "success",
      data: finalArticle,
    });
  } catch (error) {
    console.error("❌ 獲取文章詳情失敗：", error);
    res.status(500).json({
      status: "error",
      message: "獲取文章詳情失敗",
      error: error.message,
    });
  }
});

export default router;
