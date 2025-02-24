// routes/coupon/index.js
import express from "express";
import { pool } from "../../config/mysql.js"; // 從設定檔匯入已建立的連線池
import { checkToken } from "../../middleware/auth.js"; // 引入 JWT 驗證 middleware

// 使用 express.Router() 建立路由模組
const router = express.Router();

/**
 * 檢查使用者是否尚未領取該優惠券達到領取上限
 * @param {object} connection - 資料庫連線
 * @param {number} couponId - 優惠券 ID
 * @param {number|string} userId - 使用者 ID
 * @param {number} maxPerUser - 每人可領取的上限數量
 * @returns {boolean} 若領取數量小於上限，回傳 true；否則回傳 false
 */
async function checkUserQualification(connection, couponId, userId, maxPerUser) {
  const [rows] = await connection.execute(
    "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ?",
    [couponId, userId]
  );
  return rows[0].count < maxPerUser;
}

/**
 * GET /api/coupons
 * 取得優惠券列表 API：只回傳未被刪除且尚未過期的優惠券
 */
router.get("/", async (req, res) => {
  let connection;
  try {
    // 從連線池中取得連線
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM coupon WHERE is_deleted = FALSE AND end_date > NOW()"
    );
    // 回傳取得的優惠券資料
    res.json({ success: true, coupons: rows });
  } catch (error) {
    console.error("取得優惠券列表失敗:", error);
    res.status(500).json({ success: false, error: "伺服器錯誤" });
  } finally {
    // 釋放連線回連線池
    if (connection) connection.release();
  }
});

/**
 * POST /api/coupon/claim
 * 領取優惠券 API：支援依優惠代碼或優惠券 ID 領取
 * 此 API 必須通過 JWT 驗證才能領取優惠券，因此使用了 checkToken middleware
 */
router.post("/claim", checkToken, async (req, res) => {
  // 從 checkToken middleware 解析後取得使用者資訊（req.decoded）
  const userId = req.decoded.id;
  const { couponCode, couponId } = req.body;

  // 若未能取得使用者資訊，回傳錯誤
  if (!userId) {
    return res.status(400).json({ success: false, error: "缺少使用者資訊" });
  }

  let coupon;
  let connection;
  try {
    // 從連線池中取得連線
    connection = await pool.getConnection();

    // 先確認會員是否存在
    const [userRows] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    if (userRows.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "會員不存在，請先註冊或登入" });
    }

    // 根據優惠券代碼或優惠券 ID 查詢優惠券資料
    if (couponCode) {
      const [rows] = await connection.execute(
        "SELECT * FROM coupon WHERE code = ? AND is_deleted = FALSE AND end_date > NOW()",
        [couponCode]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "優惠券代碼錯誤或優惠券已過期" });
      }
      coupon = rows[0];
    } else if (couponId) {
      const [rows] = await connection.execute(
        "SELECT * FROM coupon WHERE id = ? AND is_deleted = FALSE AND end_date > NOW()",
        [couponId]
      );
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "優惠券不存在或已過期" });
      }
      coupon = rows[0];
    } else {
      return res
        .status(400)
        .json({ success: false, error: "請提供優惠券代碼或優惠券 ID" });
    }

    // 檢查會員是否已達領取上限
    const qualified = await checkUserQualification(connection, coupon.id, userId, coupon.max_per_user);
    if (!qualified) {
      return res
        .status(400)
        .json({ success: false, error: "您已領取該優惠券達上限" });
    }

    // 新增一筆優惠券使用紀錄，狀態設定為「已領取」
    await connection.execute(
      `INSERT INTO coupon_usage (coupon_id, users_id, order_id, used_at, status, is_deleted)
       VALUES (?, ?, NULL, NULL, '已領取', FALSE)`,
      [coupon.id, userId]
    );

    // 回傳成功訊息及優惠券資料
    res.json({ success: true, message: "優惠券領取成功", coupon });
  } catch (err) {
    console.error("優惠券領取失敗:", err);
    res.status(500).json({ success: false, error: "伺服器錯誤" });
  } finally {
    // 釋放連線
    if (connection) connection.release();
  }
});

// 將此 router 模組匯出，讓主程式可載入使用
export default router;
