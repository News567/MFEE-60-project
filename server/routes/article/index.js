import express from "express";
import { pool } from "../../config/mysql.js";
const router = express.Router();

// 獲取文章列表
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest", // newest, oldest, popular
      category_big_id,
      category_small_id,
      tag,
    } = req.query;

    const offset = (page - 1) * limit;

    // 排序條件
    let orderBy = "a.publish_at DESC";
    if (sort === "oldest") orderBy = "a.publish_at ASC";
    else if (sort === "popular") orderBy = "a.view_count DESC";

    // 篩選條件
    let whereClause = "a.is_deleted = FALSE";
    if (category_big_id) {
      whereClause += ` AND acb.id = ${category_big_id}`;
    }
    if (category_small_id) {
      whereClause += ` AND acs.id = ${category_small_id}`;
    }
    if (tag) {
      whereClause += ` AND ats.tag_name = '${tag}'`;
    }

    // 查詢文章列表
    const [rows] = await pool.execute(
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
      WHERE ${whereClause}
      GROUP BY a.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
      `,
      [Number(limit), Number(offset)]
    );

    // 查詢總數
    const [[{ totalCount }]] = await pool.execute(
      `
      SELECT COUNT(DISTINCT a.id) AS totalCount
      FROM article a
      LEFT JOIN article_category_small acs ON a.article_category_small_id = acs.id
      LEFT JOIN article_category_big acb ON acs.category_big_id = acb.id
      LEFT JOIN article_tag_big atb ON a.id = atb.article_id
      LEFT JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
      WHERE ${whereClause}
      `
    );

    // 返回结果
    res.json({
      status: "success",
      data: rows,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("❌ 獲取文章列表失敗：", error);
    console.error("SQL 查詢：", sqlQuery); // 打印完整的 SQL 查詢
    res.status(500).json({
      status: "error",
      message: "獲取文章列表失敗",
      error: error.message,
    });
  }
});

export default router;
