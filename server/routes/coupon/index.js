// routes/coupon/index.js
import express from "express";
import { pool } from "../../config/mysql.js"; // 請確認路徑正確

const router = express.Router();



router.get("/", async (req, res) => {
  try {
    const couponSql = `
  SELECT 
    coupon.*, 
    coupon.id,
    coupon.code,
    coupon.name,
    coupon.campaign_name,
    coupon.discount_type,
    coupon.discount,
    coupon.min_spent,
    coupon.start_date,
    coupon.end_date,
    coupon.total_issued,
    coupon.max_per_user,
    coupon.status,
    coupon.description,
    coupon.image_url,
    coupon.is_deleted,
    coupon.is_exclusive,
    coupon.is_target
  FROM coupon
`;

const couponTargetsSql = `
  SELECT
    coupon_targets.*,
    coupon_targets.id,
    coupon_targets.coupon_id AS coupon_id,
    coupon_targets.variant_id,
    coupon_targets.rent_item_id AS rent_item_id,
    coupon_targets.activity_id AS activity_id,
    coupon_targets.apply_to_all,
    coupon_targets.apply_to_product,
    coupon_targets.apply_to_rent,
    coupon_targets.apply_to_activity,
    coupon_targets.apply_to_users,
    coupon_targets.condition_type,
    coupon_targets.condition_value
  FROM coupon_targets
  LEFT JOIN coupon ON coupon_targets.coupon_id = coupon.id
  
  LEFT JOIN rent_item ON coupon_targets.rent_item_id = rent_item.id
  LEFT JOIN activity ON coupon_targets.activity_id = activity.id
`;
//  coupon_targets.variant_id AS variant_id,
//  LEFT JOIN variant ON coupon_targets.variant_id = variant.id 資料表建立後再加進couponTargetsSql

const couponUsageSql = `
  SELECT
    coupon_usage.*,
    coupon_usage.id,
    coupon_usage.coupon_id AS coupon_id,
    coupon_usage.users_id AS users_id,
    coupon_usage.used_at,
    coupon_usage.status,
    coupon_usage.is_deleted
  FROM coupon_usage
  LEFT JOIN coupon ON coupon_usage.coupon_id = coupon.id
  LEFT JOIN users ON coupon_usage.coupon_id = users.id
`;

    const [couponRows] = await pool.execute(couponSql);
    const [couponTargetsRows] = await pool.execute(couponTargetsSql);
    const [couponUsageRows] = await pool.execute(couponUsageSql);
    res.json({
      status: "success",
      data: {
        coupons: couponRows,
        couponTargets: couponTargetsRows,
        couponUsage: couponUsageRows,
      },
    });
  } catch (error) {
    console.error("資料庫查詢錯誤：", error);
    res.status(500).json({ status: "error", message: "資料庫查詢錯誤" });
  }
});

export default router;
