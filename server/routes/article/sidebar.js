import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 获取侧边栏数据
router.get("/", async (req, res) => {
  try {
    // 获取大分类
    const [categoryBig] = await pool.execute(`
      SELECT id, name FROM article_category_big
    `);

    // 获取小分类及其文章数量
    const [categorySmall] = await pool.execute(`
      SELECT 
        acs.id,
        acs.category_big_id,  
        acs.name AS category_small_name,
        COUNT(a.id) AS article_count
      FROM article_category_small acs
      LEFT JOIN article a 
        ON acs.id = a.article_category_small_id 
        AND a.is_deleted = FALSE
      GROUP BY acs.id, acs.category_big_id, acs.name
    `);

    // 获取最新 3 篇文章
    const [latest_articles] = await pool.execute(`
      SELECT id, title, publish_at
      FROM article
      WHERE status = 'published' AND is_deleted = FALSE
      ORDER BY publish_at DESC
      LIMIT 3
    `);

    // 获取随机 3 个标签
    const [random_tags] = await pool.execute(`
      SELECT id, tag_name FROM article_tag_small
      ORDER BY RAND()
      LIMIT 3
    `);

    res.json({
      status: "success",
      sidebar: {
        categoryBig,
        categorySmall,
        latest_articles,
        random_tags,
      },
    });
  } catch (error) {
    console.error("❌ 获取侧边栏数据失败：", error);
    res.status(500).json({
      status: "error",
      message: "获取侧边栏数据失败",
      error: error.message,
    });
  }
});

export default router;
