import express from "express";
import { pool } from "../../config/mysql.js";
import articleSidebarRouter from "./sidebar.js";
import articleCreateRouter from "./create.js";
import articleUpdateRouter from "./update.js"; 
import articleReplyRouter from "./reply.js";
import articleLikeRouter from "./like.js"; // 文章 & 留言按讚

const router = express.Router();

router.use("/sidebar", articleSidebarRouter);
router.use("/create", articleCreateRouter);
router.use("/update", articleUpdateRouter); 
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
      status, // 新增 status 參數
    } = req.query;

    const offset = (page - 1) * limit;

    // 排序條件
    let orderBy = "a.publish_at DESC"; // 預設最新
    if (sort === "oldest") orderBy = "a.publish_at ASC";
    else if (sort === "popular") orderBy = "a.view_count DESC";
    else if (sort === "all") orderBy = "a.id DESC"; // 顯示所有文章（不依照熱門或最新）

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
    if (status) {
      whereClause += " AND a.status = ?";
      params.push(status);
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

    // 處理圖片 URL
    const fullRows = rows.map((row) => {
      // 如果 img_url 存在並且是相對路徑
      if (
        row.img_url &&
        !row.img_url.startsWith("http") &&
        !row.img_url.startsWith("/uploads")
      ) {
        row.img_url = `/uploads${row.img_url}`;
      }

      // 如果 img_url 為 null 或空值，補充預設圖片
      if (!row.img_url) {
        row.img_url = "/uploads/article/no_is_main.png";
      }

      return row;
    });
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
      data: fullRows, // 返回完整的圖片 URL
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
        u.name AS author_name
      FROM article a
      LEFT JOIN article_category_small acs ON a.article_category_small_id = acs.id
      LEFT JOIN article_category_big acb ON acs.category_big_id = acb.id
      LEFT JOIN users u ON a.users_id = u.id
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

    // 查詢文章封面，僅返回 is_main = 1 的圖片
    const [imageRows] = await pool.execute(
      `
  SELECT img_url, is_main
  FROM article_image
  WHERE article_id = ? AND is_main = 1
  `,
      [articleId]
    );

    // 如果沒有找到主圖片，則補上預設圖片
    let mainImage = imageRows.find((img) => img.is_main === 1);
    if (!mainImage) {
      mainImage = {
        img_url: "/public/uploads/article/no_is_main.png",
        is_main: 1,
      };
    }

    // 處理圖片 URL
    imageRows.forEach((image) => {
      if (image.img_url && !image.img_url.startsWith("http")) {
        image.img_url = `${image.img_url}`;
      }
    });

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

/** 📝 獲取某個用戶的文章列表 */
router.get("/users/:users_id", async (req, res) => {
  try {
    const { users_id } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = "newest", // newest, oldest, popular
    } = req.query;

    const offset = (page - 1) * limit;

    // 排序條件
    let orderBy = "a.publish_at DESC";
    if (sort === "oldest") orderBy = "a.publish_at ASC";
    else if (sort === "popular") orderBy = "a.view_count DESC";

    // 篩選條件
    let whereClause = "a.is_deleted = FALSE AND a.users_id = ?";
    const params = [users_id];

    // 查詢文章列表
    const [rows] = await pool.execute(
      `
      SELECT 
        a.id, 
        a.title, 
        a.publish_at, 
        a.view_count,
        acs.name AS category_small_name, 
        acb.name AS category_big_name, 
        u.name AS author_name, 
        ai.img_url AS img_url
      FROM article a
      LEFT JOIN article_category_small acs ON a.article_category_small_id = acs.id
      LEFT JOIN article_category_big acb ON acs.category_big_id = acb.id
      LEFT JOIN users u ON a.users_id = u.id
      LEFT JOIN article_image ai ON a.id = ai.article_id AND ai.is_main = 1
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
      `,
      [...params, Number(limit), Number(offset)]
    );

    // 處理圖片 URL
    const fullRows = rows.map((row) => {
      if (
        row.img_url &&
        !row.img_url.startsWith("http") &&
        !row.img_url.startsWith("/uploads")
      ) {
        row.img_url = `/uploads${row.img_url}`;
      }
      if (!row.img_url) {
        row.img_url = "/uploads/article/no_is_main.png";
      }
      return row;
    });

    // 查詢總數
    const [[{ totalCount }]] = await pool.execute(
      `
      SELECT COUNT(DISTINCT a.id) AS totalCount
      FROM article a
      WHERE ${whereClause}
      `,
      params
    );

    res.json({
      status: "success",
      data: fullRows,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("❌ 獲取用戶文章列表失敗：", error);
    res.status(500).json({
      status: "error",
      message: "獲取用戶文章列表失敗",
      error: error.message,
    });
  }
});

// 刪除文章路由
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const connection = await pool.getConnection();

  try {
    // 開始交易
    await connection.beginTransaction();

    // 1. 更新 article 表中的 is_deleted 為 1
    await connection.execute(`UPDATE article SET is_deleted = 1 WHERE id = ?`, [
      id,
    ]);

    // 2. 更新 article_image 表中的 is_deleted 為 1
    await connection.execute(
      `UPDATE article_image SET is_deleted = 1 WHERE article_id = ?`,
      [id]
    );

    // 3. 刪除 article_likes_dislikes 表中的資料
    await connection.execute(
      `DELETE FROM article_likes_dislikes WHERE article_id = ?`,
      [id]
    );

    // 4. 更新 article_reply 表中的 is_deleted 為 1
    await connection.execute(
      `UPDATE article_reply SET is_deleted = 1 WHERE article_id = ?`,
      [id]
    );

    // 5. 刪除 article_tag_big 表中的資料
    await connection.execute(
      `DELETE FROM article_tag_big WHERE article_id = ?`,
      [id]
    );

    // 提交交易
    await connection.commit();

    // 回傳成功訊息
    res.json({
      status: "success",
      message: "文章及相關資料已成功刪除",
    });
  } catch (error) {
    // 回滾交易
    await connection.rollback();

    console.error("❌ 刪除文章及相關資料失敗：", error);

    res.status(500).json({
      status: "error",
      message: "刪除文章及相關資料失敗",
      error: error.message,
    });
  } finally {
    // 釋放連接
    connection.release();
  }
});

export default router;
