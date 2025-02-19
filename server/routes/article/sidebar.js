import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 获取侧边栏数据
router.get("/", async (req, res) => {
  try {
    // 获取大分类的 id 和 name
    const [categoryBig] = await pool.execute(`
  SELECT id, name FROM article_category_big
`);

    // 获取小分类的 id、name 和对应的文章数量
    const [categorySmall] = await pool.execute(`
      SELECT 
        acs.category_big_id,  -- 获取 category_big_id
        acs.name AS category_small_name,
        COUNT(a.id) AS article_count
      FROM article_category_small acs
      LEFT JOIN article a ON acs.id = a.article_category_small_id AND a.is_deleted = FALSE
      GROUP BY acs.category_big_id, acs.name
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
      SELECT tag_name FROM article_tag_small
      ORDER BY RAND()
      LIMIT 3
    `);

    // 获取大分类和小分类的数量
    const [[{ total_big_categories, total_small_categories }]] =
      await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM article_category_big) AS total_big_categories,
        (SELECT COUNT(*) FROM article_category_small) AS total_small_categories
    `);

    res.json({
      status: "success",
      sidebar: {
        total_big_categories,
        total_small_categories,
        random_tags, // 随机 3 个标签
        categoryBig, // 返回大分类 id 和 name
        categorySmall, // 返回小分类 id、name 和文章数量
        latest_articles, // 最新文章
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
