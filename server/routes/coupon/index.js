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
    coupon.couponType,
    coupon.discountType,
    coupon.discount,
    coupon.minSpent,
    coupon.startDate,
    coupon.endDate,
    coupon.totalIssued,
    coupon.maxPerUser,
    coupon.status,
    coupon.description,
    coupon.imageUrl,
    coupon.isDeleted,
    coupon.isExclusive
  FROM coupon
`;

const couponTargetsSql = `
  SELECT
    coupon_targets.*,
    coupon_targets.id,
    coupon_targets.coupon_id AS coupon_id,
    coupon_targets.product_id AS product_id,
    coupon_targets.rent_item_id AS rent_item_id,
    coupon_targets.activity_id AS activity_id,
    coupon_targets.applyToAll,
    coupon_targets.applyToProduct,
    coupon_targets.applyToRent,
    coupon_targets.applyToActivity,
    coupon_targets.applyToMember,
    coupon_targets.conditionType,
    coupon_targets.conditionValue
  FROM coupon_targets
  LEFT JOIN coupon ON coupon_targets.coupon_id = coupon.id
  LEFT JOIN product ON coupon_targets.product_id = product.id
  LEFT JOIN rent_item ON coupon_targets.rent_item_id = rent_item.id
  LEFT JOIN activity ON coupon_targets.activity_id = activity.id
`;

const couponUsageSql = `
  SELECT
    coupon_usage.*,
    coupon_usage.id,
    coupon_usage.coupon_id AS coupon_id,
    coupon_usage.member_id AS users_id,
    coupon_usage.usedAt,
    coupon_usage.status,
    coupon_usage.isDeleted
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
