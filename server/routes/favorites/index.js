import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 1. 取得收藏清單
router.get("/", async (req, res) => {
  try {
    const userId = 1; // 之後從 JWT 取得

    // 分別獲取三種類型的收藏
    const [products] = await pool.execute(
      `SELECT f.*, p.name, p.description, pi.image_url, pv.price 
       FROM favorites f
       JOIN product p ON f.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_main = 1
       LEFT JOIN product_variant pv ON p.id = pv.product_id
       WHERE f.user_id = ? AND f.product_id != 0`,
      [userId]
    );

    const [activities] = await pool.execute(
      `SELECT f.*, a.name, a.introduction, ai.img_url as image_url, a.price
       FROM favorites f
       JOIN activity a ON f.activity_id = a.id
       LEFT JOIN activity_image ai ON a.id = ai.activity_id AND ai.is_main = 1
       WHERE f.user_id = ? AND f.activity_id != 0`,
      [userId]
    );

    const [rentals] = await pool.execute(
      `SELECT f.*, ri.name, ri.description, rim.img_url as image_url, ri.price
       FROM favorites f
       JOIN rent_item ri ON f.rental_id = ri.id
       LEFT JOIN rent_image rim ON ri.id = rim.rent_item_id AND rim.is_main = 1
       WHERE f.user_id = ? AND f.rental_id != 0`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        products,
        activities,
        rentals,
      },
    });
  } catch (error) {
    console.error("取得收藏清單錯誤:", error);
    res.status(500).json({
      success: false,
      message: "取得收藏清單失敗",
    });
  }
});

// 加入收藏
router.post("/add", async (req, res) => {
  try {
    const userId = 1; // 之後從 JWT 取得
    const { type, itemIds } = req.body;

    // 基本驗證
    if (!type || !itemIds) {
      return res.status(400).json({
        success: false,
        message: "缺少必要參數",
      });
    }

    // 確保 itemIds 是陣列
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
    
    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "請提供至少一個項目ID",
      });
    }

    // 驗證收藏類型
    if (!["product", "activity", "rental"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "無效的收藏類型",
      });
    }

    // 檢查項目是否存在
    const tableName = type === "product" ? "product" : 
                     type === "activity" ? "activity" : "rent_item";
    
    const [existingItems] = await pool.execute(
      `SELECT id FROM ${tableName} WHERE id IN (${ids.join(",")})`,
    );

    if (existingItems.length !== ids.length) {
      return res.status(400).json({
        success: false,
        message: "部分項目不存在",
      });
    }

    // 檢查是否已收藏
    const [existingFavorites] = await pool.execute(
      `SELECT ${type}_id FROM favorites 
       WHERE user_id = ? AND 
       ${type}_id IN (${ids.join(",")})`,
      [userId]
    );

    const existingIds = existingFavorites.map(f => f[`${type}_id`]);
    const newIds = ids.filter(id => !existingIds.includes(parseInt(id)));

    if (newIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "所選項目都已在收藏中",
      });
    }

    // 準備批量插入的值
    const values = newIds.map(id => {
      return `(${userId}, ${
        type === "product" ? id : 0
      }, ${
        type === "activity" ? id : 0
      }, ${
        type === "rental" ? id : 0
      })`;
    }).join(",");

    // 批量插入收藏
    await pool.execute(
      `INSERT INTO favorites 
       (user_id, product_id, activity_id, rental_id) 
       VALUES ${values}`
    );

    res.json({
      success: true,
      message: "已加入收藏",
    });

  } catch (error) {
    console.error("加入收藏錯誤:", error);
    res.status(500).json({
      success: false,
      message: "加入收藏失敗",
    });
  }
});

// 移除收藏
router.post("/remove", async (req, res) => {
  try {
    const userId = 1; // 之後從 JWT 取得
    const { type, itemIds } = req.body;

    // 基本驗證
    if (!type || !itemIds) {
      return res.status(400).json({
        success: false,
        message: "缺少必要參數",
      });
    }

    // 確保 itemIds 是陣列
    const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
    
    if (ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "請提供至少一個項目ID",
      });
    }

    // 驗證收藏類型
    if (!["product", "activity", "rental"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "無效的收藏類型",
      });
    }

    // 檢查項目是否在收藏中並直接刪除
    const [result] = await pool.execute(
      `DELETE FROM favorites 
       WHERE user_id = ? AND 
       ${type}_id IN (${ids.join(",")})`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        success: false,
        message: "沒有找到要移除的收藏項目",
      });
    }

    res.json({
      success: true,
      message: "已移除收藏",
    });

  } catch (error) {
    console.error("移除收藏錯誤:", error);
    res.status(500).json({
      success: false,
      message: "移除收藏失敗",
    });
  }
});




export default router;
