import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 6️ 取得所有大分類及其對應的小分類
router.get("/all", async (req, res) => {
  try {
    // 取得所有大分類
    const [bigCategories] = await pool.execute(
      `SELECT id, name FROM category_big`
    );

    // 取得所有小分類
    const [smallCategories] = await pool.execute(
      `SELECT cs.id, cs.name, cs.category_big_id
           FROM category_small cs`
    );

    // 將小分類整理成 { bigCategoryId: [...小分類] } 的格式
    const smallCategoriesMap = {};
    smallCategories.forEach((small) => {
      if (!smallCategoriesMap[small.category_big_id]) {
        smallCategoriesMap[small.category_big_id] = [];
        // { "1": [] }
        // 為何不用map 因為 map是產生新的陣列 我這裡要做的是整理資料
      }
      smallCategoriesMap[small.category_big_id].push({
        id: small.id,
        name: small.name,
      });
      // { "1": [{ id: 1, name: "小分類1" }, { id: 2, name: "小分類2" }] }
    });

    // 回傳結構化的分類資料
    res.json({
      bigCategories,
      smallCategories: smallCategoriesMap,
    });
  } catch (error) {
    res.status(500).json({ error: "無法取得分類資料" });
  }
});

export default router;

// // 1️ 取得所有大分類
// router.get("/big", async (req, res) => {
//   try {
//     const [categories] = await pool.execute(
//       `SELECT id, name FROM category_big`
//     );
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: "無法取得大分類" });
//   }
// });

// // 2️ 取得單一大分類
// router.get("/big/:bigCategoryId", async (req, res) => {
//   const { bigCategoryId } = req.params;
//   try {
//     const [category] = await pool.execute(
//       `SELECT id, name FROM category_big WHERE id = ?`,
//       [bigCategoryId]
//     );
//     if (category.length === 0) {
//       return res.status(404).json({ error: "找不到該大分類" });
//     }
//     res.json(category[0]); // 只回傳單筆物件
//   } catch (error) {
//     res.status(500).json({ error: "無法取得大分類" });
//   }
// });

// // 3️ 取得某個大分類底下的小分類
// router.get("/big/:bigCategoryId/small", async (req, res) => {
//   const { bigCategoryId } = req.params;
//   try {
//     const [categories] = await pool.execute(
//       `SELECT cs.id, cs.name, cs.category_big_id, cb.name AS big_category_name
//        FROM category_small cs
//        JOIN category_big cb ON cs.category_big_id = cb.id
//        WHERE cs.category_big_id = ?`,
//       [bigCategoryId]
//     );
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: "無法取得小分類" });
//   }
// });

// // 4️ 取得所有小分類
// router.get("/small", async (req, res) => {
//   try {
//     const [categories] = await pool.execute(
//       `SELECT cs.id, cs.name, cs.category_big_id, cb.name AS big_category_name
//        FROM category_small cs
//        JOIN category_big cb ON cs.category_big_id = cb.id`
//     );
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ error: "無法取得小分類" });
//   }
// });

// // 5️ 取得單一小分類
// router.get("/small/:smallCategoryId", async (req, res) => {
//   const { smallCategoryId } = req.params;
//   try {
//     const [category] = await pool.execute(
//       `SELECT cs.id, cs.name, cs.category_big_id, cb.name AS big_category_name
//        FROM category_small cs
//        JOIN category_big cb ON cs.category_big_id = cb.id
//        WHERE cs.id = ?`,
//       [smallCategoryId]
//     );
//     if (category.length === 0) {
//       return res.status(404).json({ error: "找不到該小分類" });
//     }
//     res.json(category[0]);
//   } catch (error) {
//     res.status(500).json({ error: "無法取得小分類" });
//   }
// });
