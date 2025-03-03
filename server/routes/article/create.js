import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "../../config/articleDb.js";

const router = express.Router();

// 計算 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer 設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "article");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif"]);
  if (allowedTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ 不支援的圖片格式"), false);
  }
};

const upload = multer({ storage, fileFilter });

//ckeditor編輯器 圖片暫存用
const tempStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(process.cwd(), "public", "uploads", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const tempUpload = multer({ storage: tempStorage });

// ckeditor編輯器暫存圖片上傳路由
router.post(
  "/upload-ckeditor-image-temp",
  tempUpload.single("articleImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "未接收到圖片文件" });
      }

      const tempImageUrl = `/uploads/temp/${req.file.filename}`;
      res.status(200).json({ success: true, url: tempImageUrl }); // 只發送一次回應
    } catch (error) {
      console.error("❌ 暫存圖片上傳失敗：", error);
      res.status(500).json({ success: false, message: "暫存圖片上傳失敗" }); // 只發送一次回應
    }
  }
);

// 在 handleTags 函式中添加更多錯誤檢查
const handleTags = async (tags, articleId) => {
  if (!Array.isArray(tags)) {
    throw new Error("標籤格式錯誤：標籤應為陣列");
  }

  try {
    for (let tag of tags) {
      // 檢查標籤是否存在
      const { results: existingTag } = await db.query(
        "SELECT id FROM article_tag_small WHERE tag_name = ?",
        [tag]
      );

      let tagId;
      if (existingTag && existingTag.length > 0) {
        tagId = existingTag[0].id; // 使用現有標籤的 ID
      } else {
        // 插入新標籤
        const { results: tagResult } = await db.query(
          "INSERT INTO article_tag_small (tag_name) VALUES (?)",
          [tag]
        );
        if (!tagResult || !tagResult.insertId) {
          throw new Error("標籤插入失敗");
        }
        tagId = tagResult.insertId; // 獲取新插入標籤的 ID
      }

      // 將標籤與文章關聯
      await db.query(
        "INSERT INTO article_tag_big (article_id, article_tag_small_id) VALUES (?, ?)",
        [articleId, tagId]
      );
    }
  } catch (error) {
    console.error("❌ 處理標籤時發生錯誤：", error);
    throw error; // 將錯誤拋出，讓上層函式處理
  }
};

// 文章創建 API 路由
router.post("/create", upload.single("new_coverImage"), async (req, res) => {
  console.log("req.body:", req.body); // 調試：打印非文件字段
  console.log("req.file:", req.file); // 調試：打印文件字段

  // 確保 new_tags 已經正確解析
  let {
    new_title,
    new_content,
    new_categorySmall,
    new_tags,
    status = "draft",
    ckeditor_images,
  } = req.body;

  // 解析 CKEditor 圖片 URL
  const ckeditorImages = JSON.parse(ckeditor_images || "[]");

  // 確保 new_tags 是陣列
  try {
    if (typeof new_tags === "string") {
      new_tags = JSON.parse(new_tags);
    }
    if (!Array.isArray(new_tags)) {
      throw new Error("標籤應為 JSON 陣列");
    }
  } catch (error) {
    return res.status(400).json({ message: "標籤格式錯誤，應為 JSON 陣列" });
  }

  console.log("接收到的 tags:", new_tags); // 確保變數已經正確初始化

  const coverImagePath = req.file
    ? `/uploads/article/${req.file.filename}`
    : null;
  const currentDate = new Date();
  const publishAt = status === "published" ? currentDate : null;

  if (!new_title || !new_content || !new_categorySmall || !new_tags) {
    return res.status(400).json({ message: "所有字段都是必需的！" });
  }

  try {
    // 插入文章資料
    const userId = 1; // 假設用戶 ID 為 1
    const { results: articleResult } = await db.query(
      "INSERT INTO article (title, content, article_category_small_id, users_id, status, created_at, publish_at, view_count, reply_count, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        new_title,
        new_content, // 先使用原始的 content
        new_categorySmall,
        userId,
        status,
        new Date(),
        status === "published" ? new Date() : null,
        0,
        0,
        0,
      ]
    );
    if (!articleResult || articleResult.insertId === 0) {
      throw new Error("無法獲取文章 ID");
    }
    const articleId = articleResult.insertId;

    // 更新 content 中的圖片 URL
    let updatedContent = new_content; // 複製原始的 content
    if (ckeditorImages.length > 0) {
      for (const tempImageUrl of ckeditorImages) {
        // 確保 tempImageUrl 是相對路徑
        const tempImagePath = path.join(process.cwd(), "public", tempImageUrl);
        const finalImagePath = path.join(
          process.cwd(),
          "public",
          "uploads",
          "article",
          path.basename(tempImageUrl)
        );

        // 將圖片從暫存目錄移動到正式目錄
        fs.renameSync(tempImagePath, finalImagePath);

        // 插入圖片資料
        const finalImageUrl = `/uploads/article/${path.basename(tempImageUrl)}`;
        await db.insertImage(articleId, finalImageUrl, 0);

        // 更新 content 中的圖片 URL
        updatedContent = updatedContent.replace(tempImageUrl, finalImageUrl);
      }

      // 更新文章內容中的圖片 URL
      await db.query("UPDATE article SET content = ? WHERE id = ?", [
        updatedContent,
        articleId,
      ]);
    }

    // 插入封面圖片資料
    if (req.file) {
      const coverImagePath = `/uploads/article/${req.file.filename}`;
      await db.insertImage(articleId, coverImagePath, 1);
    }

    // 處理標籤
    await handleTags(new_tags, articleId);

    res
      .status(200)
      .json({ success: true, message: "文章創建成功！", articleId });
  } catch (error) {
    console.error("❌ 文章創建失敗：", error);
    res.status(500).json({ success: false, message: "創建文章時發生錯誤" });
  }
});

// 草稿儲存 API
router.post("/save-draft", async (req, res) => {
  const { new_title, new_content, new_article_category_small_id, new_tags } =
    req.body;

  if (
    !new_title ||
    !new_content ||
    !new_article_category_small_id ||
    !new_tags
  ) {
    return res.status(400).json({ message: "所有字段都是必需的！" });
  }

  try {
    const draftResult = await db.query(
      'INSERT INTO article (title, content, article_category_small_id, status) VALUES (?, ?, ?, "draft")',
      [new_title, new_content, new_article_category_small_id]
    );
    const draftId = draftResult.insertId;

    // 處理標籤
    await handleTags(new_tags, draftId);

    res.status(200).json({ success: true, message: "草稿儲存成功！", draftId });
  } catch (error) {
    console.error("❌ 草稿儲存失敗：", error);
    res.status(500).json({ success: false, message: "儲存草稿時發生錯誤" });
  }
});

// 新建文章所需分類與標籤資料 API (GET)
router.get("/data", async (req, res) => {
  try {
    const { category_big, category_small } = await db.getCategories();
    const tags = await db.getTags();

    res.status(200).json({
      success: true,
      category_big,
      category_small,
      tags,
    });
  } catch (error) {
    console.error("❌ 無法獲取分類與標籤：", error);
    res.status(500).json({ success: false, message: "獲取資料失敗" });
  }
});

// 圖片上傳路由
// router.post("/upload-image", (req, res) => handleImageUpload(req, res, 1));
router.post("/upload", (req, res) => handleImageUpload(req, res, 0));

// 新增 CKEditor 圖片上傳路由
router.post(
  "/upload-ckeditor-image",
  upload.single("articleImage"), // 使用 multer 處理圖片上傳
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "未接收到圖片文件" });
      }

      // 取得圖片路徑
      const imageUrl = `/uploads/article/${req.file.filename}`; // 確保路徑正確
      res.status(200).json({ success: true, url: imageUrl });

      // 取得文章 ID（如果有的話）
      const articleId = req.body.article_id || null;

      // 將圖片資訊存入 article_image 資料表，is_main 設為 0
      const insertId = await db.insertImage(articleId, imageUrl, 0);

      if (!insertId) {
        throw new Error("圖片插入資料庫失敗");
      }

      // 返回成功訊息和圖片 URL
      res.status(200).json({ success: true, url: imageUrl });
    } catch (error) {
      console.error("❌ CKEditor 圖片上傳失敗：", error);
      res.status(500).json({ success: false, message: "圖片上傳失敗" });
    }
  }
);

export default router;
