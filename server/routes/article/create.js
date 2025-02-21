import express from "express";
import multer from "multer";
import { pool } from "../../config/mysql.js";

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; //生成唯一的識別碼，創建不重複的 ID 
// import { validateUser } from "../../middlewares/auth"; // 用戶認證中介，已註解掉

const router = express.Router();

// Multer 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./public/uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 文章創建 API 路由
router.post(
  "/create",
  // validateUser, // 註解掉用戶認證中介
  upload.single("cover_image"),
  async (req, res) => {
    const {
      title,
      content,
      article_category_small_id,
      users_id,
      tags,
      status,
    } = req.body;
    const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      // 檢查必要的字段
      if (!title || !content || !article_category_small_id || !tags) {
        return res.status(400).json({ message: "所有字段都是必需的！" });
      }

      // 插入文章資料
      const [articleResult] = await pool.query(
        "INSERT INTO article (title, content, article_category_small_id, users_id, status, cover_image) VALUES (?, ?, ?, ?, ?, ?)",
        [
          title,
          content,
          article_category_small_id,
          users_id,
          status,
          coverImagePath,
        ]
      );
      const articleId = articleResult.insertId;

      // 插入並關聯標籤
      const tagArray = JSON.parse(tags);
      for (let tag of tagArray) {
        // 插入標籤（如果標籤不存在則忽略）
        const [tagResult] = await pool.query(
          "INSERT IGNORE INTO tags (name) VALUES (?)",
          [tag]
        );
        const tagId = tagResult.insertId;

        // 關聯標籤與文章
        await pool.query(
          "INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?)",
          [articleId, tagId]
        );
      }

      // 返回成功的響應
      res.status(200).json({ message: "文章創建成功！", articleId });
    } catch (error) {
      console.error("❌ 文章創建失敗：", error);
      res.status(500).json({ message: "創建文章時發生錯誤" });
    }
  }
);

// 更新文章 API
router.put(
  "/update/:id",
  // validateUser, // 註解掉用戶認證中介
  upload.single("cover_image"),
  async (req, res) => {
    const articleId = req.params.id;
    const { title, content, article_category_small_id, status, tags } =
      req.body;
    const coverImagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      // 檢查必要的字段
      if (!title || !content || !article_category_small_id || !tags) {
        return res.status(400).json({ message: "所有字段都是必需的！" });
      }

      // 更新文章資料
      await pool.query(
        "UPDATE article SET title = ?, content = ?, article_category_small_id = ?, status = ?, cover_image = ? WHERE id = ?",
        [
          title,
          content,
          article_category_small_id,
          status,
          coverImagePath,
          articleId,
        ]
      );

      // 刪除舊的標籤關聯
      await pool.query("DELETE FROM article_tag WHERE article_id = ?", [
        articleId,
      ]);

      // 重新關聯標籤
      const tagArray = JSON.parse(tags);
      for (let tag of tagArray) {
        // 插入標籤（如果標籤不存在則忽略）
        const [tagResult] = await pool.query(
          "INSERT IGNORE INTO tags (name) VALUES (?)",
          [tag]
        );
        const tagId = tagResult.insertId;

        // 關聯標籤與文章
        await pool.query(
          "INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?)",
          [articleId, tagId]
        );
      }

      res.status(200).json({ message: "文章更新成功！", articleId });
    } catch (error) {
      console.error("❌ 文章更新失敗：", error);
      res.status(500).json({ message: "更新文章時發生錯誤" });
    }
  }
);

// 草稿儲存 API
router.post("/save-draft", 
  // validateUser, // 註解掉用戶認證中介
  async (req, res) => {
    const { title, content, article_category_small_id, users_id, tags } =
      req.body;

    try {
      // 檢查必要的字段
      if (!title || !content || !article_category_small_id || !tags) {
        return res.status(400).json({ message: "所有字段都是必需的！" });
      }

      // 插入草稿資料
      const [draftResult] = await pool.query(
        "INSERT INTO article (title, content, article_category_small_id, users_id, status) VALUES (?, ?, ?, ?, 'draft')",
        [title, content, article_category_small_id, users_id]
      );
      const draftId = draftResult.insertId;

      // 插入並關聯標籤
      const tagArray = JSON.parse(tags);
      for (let tag of tagArray) {
        const [tagResult] = await pool.query(
          "INSERT IGNORE INTO tags (name) VALUES (?)",
          [tag]
        );
        const tagId = tagResult.insertId;

        // 關聯標籤與草稿文章
        await pool.query(
          "INSERT INTO article_tag (article_id, tag_id) VALUES (?, ?)",
          [draftId, tagId]
        );
      }

      res.status(200).json({ message: "草稿儲存成功！", draftId });
    } catch (error) {
      console.error("❌ 草稿儲存失敗：", error);
      res.status(500).json({ message: "儲存草稿時發生錯誤" });
    }
  }
);

export default router;
