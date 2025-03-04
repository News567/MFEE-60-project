// 匯入 express 框架
import express from "express";
// 從設定檔中取得 MySQL 連線池
import { pool } from "../../config/mysql.js";

// 建立一個 express Router 物件
const router = express.Router();
/**
 * GET /available
 * 功能：查詢該使用者可領取的優惠券清單
 */
router.get("/available", async (req, res) => {
  try {
    // 取得使用者 ID（若 req.user 不存在，預設為 1，僅供測試用）
    const userId = req.user?.id || 1;

    // 從 users 資料表查詢使用者基本資料（例如生日、會員等級）
    const [userResults] = await pool.query(
      "SELECT birthday, level_id FROM users WHERE id = ?",
      [userId]
    );
    if (!userResults.length) {
      return res.status(404).json({ error: "找不到使用者" });
    }
    const user = userResults[0];

    // 取得所有未刪除的優惠券
    const [couponResults] = await pool.query(
      "SELECT * FROM coupon WHERE is_deleted = FALSE"
    );

    const availableCoupons = [];
    const now = new Date();

    // 遍歷每筆優惠券資料
    for (let coupon of couponResults) {
      // 檢查是否過期（若有設定 end_date）
      if (coupon.end_date && now > new Date(coupon.end_date)) continue;

      // 檢查該優惠券目前總領取量是否達上限
      const [usageCountResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND is_deleted = FALSE",
        [coupon.id]
      );
      if (usageCountResults[0].count >= coupon.total_issued) continue;

      // 計算使用者對該優惠券的領取記錄：
      // totalUserClaimCount：狀態為「已領取」與「已使用」的總數
      const [totalUserClaimResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND status IN ('已領取','已使用') AND is_deleted = FALSE",
        [coupon.id, userId]
      );
      const totalUserClaimCount = totalUserClaimResults[0].count;
      
      // usable：僅計算狀態為「已領取」的（還未使用）的記錄
      const [usableResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND status = '已領取' AND is_deleted = FALSE",
        [coupon.id, userId]
      );
      const usable = usableResults[0].count;

      // remaining：還可領取的數量（每人可領取數量減去使用者已領取總數）
      const remaining = coupon.max_per_user - totalUserClaimCount;

      /* 過濾邏輯：
         - 如果使用者從未領取且 remaining 為 0，表示此優惠券無法領取，則不回傳
         - 如果使用者已領取（totalUserClaimCount > 0），但可使用數（usable）為 0（全部已使用），則不回傳
      */
      if (totalUserClaimCount === 0 && remaining <= 0) continue;
      if (totalUserClaimCount > 0 && usable === 0) continue;

      // 加入 coupon_targets 條件判斷：若優惠券設定為 is_target 則需進一步檢查
      let isEligible = true;
      if (coupon.is_target) {
        const [targetResults] = await pool.query(
          "SELECT * FROM coupon_targets WHERE coupon_id = ?",
          [coupon.id]
        );
        for (const target of targetResults) {
          // 如果不適用於所有使用者，則必須滿足條件
          if (!target.apply_to_users) {
            if (target.condition_type && target.condition_value) {
              if (target.condition_type === "生日月份") {
                if (!user.birthday || user.birthday === "0000-00-00") {
                  isEligible = false;
                  break;
                }
                const userBirthdayMonth = new Date(user.birthday).getMonth() + 1;
                if (userBirthdayMonth !== parseInt(target.condition_value)) {
                  isEligible = false;
                  break;
                }
              } else if (target.condition_type === "會員等級") {
                if (user.level_id !== parseInt(target.condition_value)) {
                  isEligible = false;
                  break;
                }
              }
            }
          }
        }
      }
      if (!isEligible) continue;

      // 回傳資料中加入 remaining、usable 與 claimed（若 totalUserClaimCount > 0 則 claimed 為 true）
      availableCoupons.push({
        ...coupon,
        remaining,           // 還可以領取的數量
        usable,              // 可使用（尚未使用）的數量
        claimed: totalUserClaimCount > 0,
      });
    }

    return res.json({ success: true, coupons: availableCoupons });
  } catch (error) {
    console.error("Error fetching available coupons:", error);
    return res.status(500).json({ error: `伺服器錯誤: ${error.message}` });
  }
});


/**
 * POST /claim
 * 功能：處理使用者領取優惠券的動作
 */
router.post("/claim", async (req, res) => {
  try {
    // 從請求主體取得 couponId
    const { couponId } = req.body;
    if (!couponId) {
      return res.status(400).json({ error: "缺少優惠券代碼" });
    }

    // 取得使用者 ID，若 req.user 不存在則預設用 1（測試用）
    const userId = req.user?.id || 1;

    // 從 users 資料表查詢該使用者的基本資料（例如生日、會員等級）
    const [userResults] = await pool.query(
      "SELECT birthday, level_id FROM users WHERE id = ?",
      [userId]
    );
    if (!userResults.length) {
      return res.status(404).json({ error: "找不到使用者" });
    }
    const user = userResults[0];

    // 根據 couponId 查詢該優惠券資料（且確認未被刪除）
    const [couponResults] = await pool.query(
      "SELECT * FROM coupon WHERE id = ? AND is_deleted = FALSE",
      [couponId]
    );
    if (!couponResults.length) {
      return res.status(404).json({ error: "找不到該優惠券" });
    }
    const coupon = couponResults[0];

    // 驗證優惠券是否已過期
    if (new Date() > new Date(coupon.end_date)) {
      return res.status(400).json({ error: "該優惠券已過期" });
    }

    // 檢查該優惠券目前總領取量是否達上限
    const [usageCountResults] = await pool.query(
      "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND is_deleted = FALSE",
      [coupon.id]
    );
    const totalClaimed = usageCountResults[0].count;
    if (totalClaimed >= coupon.total_issued) {
      return res.status(400).json({ error: "優惠券已全數領取" });
    }

    // 查詢該使用者已領取此優惠券的次數（不論狀態為「已領取」或「已使用」）
    const [userUsageResults] = await pool.query(
      "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND is_deleted = FALSE",
      [coupon.id, userId]
    );
    const userClaimed = userUsageResults[0].count;
    if (userClaimed >= coupon.max_per_user) {
      return res.status(400).json({ error: "您已達到領取上限" });
    }

    // 計算使用者還可領取的張數（例如：若每人可領取量為 3，且已領取 1 張，則 remainingToClaim = 2）
    const remainingToClaim = coupon.max_per_user - userClaimed;

    // 檢查剩餘優惠券數量是否足夠
    if (totalClaimed + remainingToClaim > coupon.total_issued) {
      return res.status(400).json({ error: "剩餘優惠券數量不足" });
    }

    // 依據 remainingToClaim 次數，逐筆寫入領取記錄（狀態預設為「已領取」）
    for (let i = 0; i < remainingToClaim; i++) {
      await pool.query(
        "INSERT INTO coupon_usage (coupon_id, users_id, status, used_at, is_deleted) VALUES (?, ?, ?, NULL, FALSE)",
        [coupon.id, userId, "已領取"]
      );
    }

    return res.json({
      success: true,
      message: `優惠券領取成功，您共領取了 ${remainingToClaim} 張優惠券`
    });
  } catch (error) {
    console.error("Error claiming coupon:", error);
    return res.status(500).json({ error: `伺服器錯誤: ${error.message}` });
  }
});

/**
 * GET /claim
 * 功能：根據會員可領取的優惠券進行查詢，並支援下列篩選條件與分頁功能：
 *   - campaign_name：檔期活動名稱（"全部" 表示不進行檔期過濾）
 *   - coupon_category：優惠分類（來源於 coupon_type 表，"全部" 表示不進行分類過濾）
 *   - claim_status：領取狀態，"未領取" 表示使用者從未領取過、"已領取" 表示使用者已經領取過、"全部" 表示不進行領取狀態過濾
 *   - page：目前頁碼（預設值：1）
 *   - limit：每頁顯示筆數（預設值：10）
 */
router.get("/claim", async (req, res) => {
  try {
    // 取得使用者 ID（若 req.user 不存在，預設為 1，僅供測試使用）
    const userId = req.user?.id || 1;

    // 取得 query string 中的篩選參數（請注意，這邊的參數名稱必須與前端一致）
    const { campaign_name, coupon_category, claim_status } = req.query;
    // 取得分頁參數，若未提供則預設為 page 1, limit 10
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // 從 users 資料表中查詢使用者的基本資料（例如：生日、會員等級）
    const [userResults] = await pool.query(
      "SELECT birthday, level_id FROM users WHERE id = ?",
      [userId]
    );
    if (!userResults.length) {
      // 若找不到使用者，則回傳 404 錯誤
      return res.status(404).json({ error: "找不到使用者" });
    }
    const user = userResults[0];

    // 從 coupon 資料表中取得所有未被邏輯刪除的優惠券
    const [couponResults] = await pool.query(
      "SELECT * FROM coupon WHERE is_deleted = FALSE"
    );

    // 建立一個陣列用來存放篩選後符合條件的優惠券
    const filteredCoupons = [];
    // 取得目前系統時間，用於檢查優惠券是否過期
    const now = new Date();

    // 遍歷每一筆優惠券資料，進行以下檢查與過濾：
    for (let coupon of couponResults) {
      // 1. 檢查是否有設定結束日期，若有則檢查目前是否已過期
      if (coupon.end_date && now > new Date(coupon.end_date)) continue;

      // 2. 檢查該優惠券目前的總領取數是否已達到上限
      const [usageCountResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND is_deleted = FALSE",
        [coupon.id]
      );
      if (usageCountResults[0].count >= coupon.total_issued) continue;

      // 3. 計算使用者已領取此優惠券的紀錄數量（狀態為「已領取」與「已使用」）
      const [totalUserClaimResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND status IN ('已領取','已使用') AND is_deleted = FALSE",
        [coupon.id, userId]
      );
      const totalUserClaimCount = totalUserClaimResults[0].count;
      
      // 4. 計算使用者目前尚未使用的優惠券紀錄數（狀態為「已領取」）
      const [usableResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND status = '已領取' AND is_deleted = FALSE",
        [coupon.id, userId]
      );
      const usable = usableResults[0].count;

      // 5. 計算該使用者還能領取的剩餘數量（每人可領取上限 - 使用者已領取數量）
      const remaining = coupon.max_per_user - totalUserClaimCount;

      /* 6. 檢查領取資格：
         - 若使用者從未領取此優惠券且剩餘可領取數量為 0，則表示此優惠券無法領取
         - 若使用者曾領取過，但目前尚未使用的數量為 0，則表示已無可用優惠券
      */
      if (totalUserClaimCount === 0 && remaining <= 0) continue;
      if (totalUserClaimCount > 0 && usable === 0) continue;

      // 7. 篩選檔期活動：若提供了 campaign_name 且不為 "全部"，則必須與優惠券的 campaign_name 相符
      if (campaign_name && campaign_name !== "全部" && coupon.campaign_name !== campaign_name) {
        continue;
      }

      // 8. 篩選優惠分類：若提供了 coupon_category 且不為 "全部"，則需從 coupon_type 表中查詢該優惠券是否具有對應分類
      if (coupon_category && coupon_category !== "全部") {
        const [typeResults] = await pool.query(
          "SELECT * FROM coupon_type WHERE coupon_id = ? AND applicable_type = ?",
          [coupon.id, coupon_category]
        );
        // 若沒有找到對應的優惠分類，則略過此筆優惠券
        if (!typeResults.length) continue;
      }

      // 9. 篩選領取狀態：若提供了 claim_status 且不為 "全部"
      //    "未領取" 表示使用者從未領取過此優惠券；"已領取" 表示使用者曾領取過
      if (claim_status && claim_status !== "全部") {
        if (claim_status === "未領取" && totalUserClaimCount > 0) {
          continue;
        }
        if (claim_status === "已領取" && totalUserClaimCount === 0) {
          continue;
        }
      }

      // 10. 檢查優惠券是否有設定適用範圍（is_target 為 true）
      //     若設定了，則需進一步檢查會員是否符合 coupon_targets 的條件
      let isEligible = true;
      if (coupon.is_target) {
        const [targetResults] = await pool.query(
          "SELECT * FROM coupon_targets WHERE coupon_id = ?",
          [coupon.id]
        );
        for (const target of targetResults) {
          if (!target.apply_to_users) {
            if (target.condition_type && target.condition_value) {
              // 若條件為「生日月份」
              if (target.condition_type === "生日月份") {
                if (!user.birthday || user.birthday === "0000-00-00") {
                  isEligible = false;
                  break;
                }
                const userBirthdayMonth = new Date(user.birthday).getMonth() + 1;
                if (userBirthdayMonth !== parseInt(target.condition_value)) {
                  isEligible = false;
                  break;
                }
              } 
              // 若條件為「會員等級」
              else if (target.condition_type === "會員等級") {
                if (user.level_id !== parseInt(target.condition_value)) {
                  isEligible = false;
                  break;
                }
              }
            }
          }
        }
      }
      if (!isEligible) continue;

      // 11. 若優惠券符合所有條件，將此筆優惠券加入篩選結果中，
      //     並附加 remaining（剩餘可領取數量）、usable（尚未使用數量）與 claimed（是否已領取過）的屬性
      filteredCoupons.push({
        ...coupon,
        remaining,
        usable,
        claimed: totalUserClaimCount > 0,
      });
    }

    // 12. 分頁邏輯：
    //     計算總筆數、總頁數，並根據當前頁數與每頁筆數取出對應的資料
    const total = filteredCoupons.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + limit);

    // 回傳成功結果，包含分頁資訊與當前頁的優惠券資料
    return res.json({
      success: true,
      total,          // 總筆數
      page,           // 當前頁碼
      totalPages,     // 總頁數
      coupons: paginatedCoupons, // 分頁後的優惠券資料
    });
  } catch (error) {
    // 發生例外錯誤時，輸出錯誤訊息並回傳 500 狀態碼
    console.error("Error fetching claim filtered coupons:", error);
    return res.status(500).json({ error: `伺服器錯誤: ${error.message}` });
  }
});
/**
 * GET /search
 * 功能：根據搜尋字串查詢優惠券，並依據使用者資料、優惠券狀態等進行篩選，同時支援分頁功能。
 * Query 參數：
 *   - q: 搜尋字串（用於比對 coupon 的 name、code、campaign_name）
 *   - page: 目前頁碼（預設值：1）
 *   - limit: 每頁顯示筆數（預設值：10）
 */
router.get("/search", async (req, res) => {
  try {
    // 測試用 userId，正式應根據登入狀態取得
    const userId = req.user?.id || 1;
    
    // 取得搜尋字串與分頁參數
    const { q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // 從 users 資料表查詢使用者基本資料
    const [userResults] = await pool.query(
      "SELECT birthday, level_id FROM users WHERE id = ?",
      [userId]
    );
    if (!userResults.length) {
      return res.status(404).json({ error: "找不到使用者" });
    }
    const user = userResults[0];

    // 組合搜尋條件，若 q 不存在則會回傳所有未刪除的優惠券
    const searchPattern = `%${q || ""}%`;
    const [couponResults] = await pool.query(
      "SELECT * FROM coupon WHERE is_deleted = FALSE AND (name LIKE ? OR code LIKE ? OR campaign_name LIKE ?)",
      [searchPattern, searchPattern, searchPattern]
    );

    // 建立陣列存放篩選後符合條件的優惠券
    const filteredCoupons = [];
    const now = new Date();

    // 遍歷搜尋結果進行條件篩選
    for (let coupon of couponResults) {
      // 1. 檢查結束日期是否已過期
      if (coupon.end_date && now > new Date(coupon.end_date)) continue;

      // 2. 檢查優惠券領取總數是否已達上限
      const [usageCountResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND is_deleted = FALSE",
        [coupon.id]
      );
      if (usageCountResults[0].count >= coupon.total_issued) continue;

      // 3. 計算使用者已領取的數量（已領取與已使用）
      const [totalUserClaimResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND status IN ('已領取','已使用') AND is_deleted = FALSE",
        [coupon.id, userId]
      );
      const totalUserClaimCount = totalUserClaimResults[0].count;

      // 4. 計算使用者尚未使用的優惠券數（狀態為已領取）
      const [usableResults] = await pool.query(
        "SELECT COUNT(*) as count FROM coupon_usage WHERE coupon_id = ? AND users_id = ? AND status = '已領取' AND is_deleted = FALSE",
        [coupon.id, userId]
      );
      const usable = usableResults[0].count;

      // 5. 計算使用者剩餘可領取數量
      const remaining = coupon.max_per_user - totalUserClaimCount;

      // 6. 檢查領取資格：
      //    若從未領取且剩餘可領取數為 0 或曾領取但無可用紀錄則略過
      if (totalUserClaimCount === 0 && remaining <= 0) continue;
      if (totalUserClaimCount > 0 && usable === 0) continue;

      // 7. 若優惠券設定適用範圍，檢查使用者是否符合條件
      let isEligible = true;
      if (coupon.is_target) {
        const [targetResults] = await pool.query(
          "SELECT * FROM coupon_targets WHERE coupon_id = ?",
          [coupon.id]
        );
        for (const target of targetResults) {
          if (!target.apply_to_users) {
            if (target.condition_type && target.condition_value) {
              if (target.condition_type === "生日月份") {
                if (!user.birthday || user.birthday === "0000-00-00") {
                  isEligible = false;
                  break;
                }
                const userBirthdayMonth = new Date(user.birthday).getMonth() + 1;
                if (userBirthdayMonth !== parseInt(target.condition_value)) {
                  isEligible = false;
                  break;
                }
              } else if (target.condition_type === "會員等級") {
                if (user.level_id !== parseInt(target.condition_value)) {
                  isEligible = false;
                  break;
                }
              }
            }
          }
        }
      }
      if (!isEligible) continue;

      // 8. 若符合所有條件，加入結果並附加剩餘、可用及是否已領取的資訊
      filteredCoupons.push({
        ...coupon,
        remaining,
        usable,
        claimed: totalUserClaimCount > 0,
      });
    }

    // 9. 分頁邏輯
    const total = filteredCoupons.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + limit);

    return res.json({
      success: true,
      total,          // 總筆數
      page,           // 當前頁碼
      totalPages,     // 總頁數
      coupons: paginatedCoupons, // 分頁後的優惠券資料
    });
  } catch (error) {
    console.error("Error searching coupons:", error);
    return res.status(500).json({ error: `伺服器錯誤: ${error.message}` });
  }
});

// 匯出 router 模組，供其他檔案引入
export default router;
