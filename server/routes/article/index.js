import express from "express";
import { pool } from "../../config/mysql.js";
import articleSidebarRouter from "./sidebar.js"; 
import articleCreateRouter from "./create.js"; 
import articleReplyRouter from "./reply.js"; 
import articleLikeRouter from "./like.js"; // 文章 & 留言按讚

const router = express.Router();

router.use("/sidebar", articleSidebarRouter);
router.use("/create", articleCreateRouter);
router.use("/reply", articleReplyRouter);
router.use("/like", articleLikeRouter);

/** 📝 獲取文章列表 */
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "newest", // newest, oldest, popular
      category,
      tag,
    } = req.query;

    const offset = (page - 1) * limit;

    // 排序條件
    let orderBy = "a.publish_at DESC";
    if (sort === "oldest") orderBy = "a.publish_at ASC";
    else if (sort === "popular") orderBy = "a.view_count DESC";

    // 篩選條件
    let whereClause = "a.is_deleted = FALSE";
    let params = [];

    if (category) {
      whereClause += " AND acs.name = ?";
      params.push(category);
    }
    if (tag) {
      whereClause += " AND ats.tag_name = ?";
      params.push(tag);
    }

    // 查詢文章列表
    const [rows] = await pool.execute(
      `
      SELECT 
        a.*, 
        acs.name AS category_small_name, 
        acb.name AS category_big_name, 
        u.name AS author_name, 
        ai.img_url AS img_url,
        (SELECT COUNT(ar.id) FROM article_reply ar WHERE ar.article_id = a.id) AS reply_count
      FROM article a
      LEFT JOIN article_category_small acs ON a.article_category_small_id = acs.id
      LEFT JOIN article_category_big acb ON acs.category_big_id = acb.id
      LEFT JOIN users u ON a.users_id = u.id
      LEFT JOIN article_tag_big atb ON a.id = atb.article_id
      LEFT JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
      LEFT JOIN article_image ai ON a.id = ai.article_id AND ai.is_main = 1
      WHERE ${whereClause}
      GROUP BY a.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
      `,
      [...params, Number(limit), Number(offset)]
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
      `,
      params
    );

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
    res.status(500).json({
      status: "error",
      message: "獲取文章列表失敗",
      error: error.message,
    });
  }
});

/** 📝 獲取單篇文章 */
router.get("/:id", async (req, res) => {
  try {
    const articleId = req.params.id;

    // 查詢文章基本資訊
    const [articleRows] = await pool.execute(
      `
      SELECT 
        a.*,
        acs.name AS category_small_name,
        acb.name AS category_big_name,
        u.name AS author_name,
        ai.img_url AS img_url
      FROM article a
      LEFT JOIN article_category_small acs ON a.article_category_small_id = acs.id
      LEFT JOIN article_category_big acb ON acs.category_big_id = acb.id
      LEFT JOIN users u ON a.users_id = u.id
      LEFT JOIN article_tag_big atb ON a.id = atb.article_id
      LEFT JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
      LEFT JOIN article_image ai ON a.id = ai.article_id AND ai.is_main = 1
      WHERE a.id = ?
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

    // 查詢文章圖片
    const [imageRows] = await pool.execute(
      `
      SELECT img_url, is_main
      FROM article_image
      WHERE article_id = ?
      `,
      [articleId]
    );

    // 查詢文章標籤
    const [tagRows] = await pool.execute(
      `
      SELECT ats.tag_name
      FROM article_tag_big atb
      JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
      WHERE atb.article_id = ?
      `,
      [articleId]
    );

    // 查詢文章留言
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

    // 查詢相關文章
    const [relatedArticles] = await pool.execute(
      `
      SELECT 
        a.id,
        a.title,
        a.content,
        a.article_category_small_id,
        ai.img_url AS img_url,
        (SELECT GROUP_CONCAT(ats.tag_name SEPARATOR ', ') 
         FROM article_tag_big atb
         JOIN article_tag_small ats ON atb.article_tag_small_id = ats.id
         WHERE atb.article_id = a.id) AS tags
      FROM article a
      LEFT JOIN article_image ai ON a.id = ai.article_id AND ai.is_main = 1
      WHERE a.article_category_small_id = ? AND a.is_deleted = FALSE
      ORDER BY RAND() 
      LIMIT 4
      `,
      [article.article_category_small_id]
    );

    res.json({
      status: "success",
      data: {
        ...article,
        images: imageRows,
        tags: tagRows.map((tag) => tag.tag_name),
        replies: replyRows,
        relatedArticles,
      },
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

/** 📝 新增文章 */
router.post("/", async (req, res) => {
  try {
    const { title, content, category_small_id, user_id, tags, images } = req.body;

    // 插入文章
    const [result] = await pool.execute(
      `
      INSERT INTO article (title, content, article_category_small_id, users_id, publish_at)
      VALUES (?, ?, ?, ?, NOW())
      `,
      [title, content, category_small_id, user_id]
    );

    const articleId = result.insertId;

    // 插入標籤
    if (tags && tags.length > 0) {
      await Promise.all(
        tags.map((tagId) =>
          pool.execute("INSERT INTO article_tag_big (article_id, article_tag_small_id) VALUES (?, ?)", [articleId, tagId])
        )
      );
    }

    res.json({
      status: "success",
      message: "文章新增成功",
      articleId,
    });
  } catch (error) {
    console.error("❌ 新增文章失敗：", error);
    res.status(500).json({ status: "error", message: "新增文章失敗", error: error.message });
  }
});

export default router;
