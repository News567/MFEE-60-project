"use client";

// 引入 CouponCard 專用 CSS 樣式檔
import "./CouponCard.css";
// 從 Next.js 匯入圖片元件，利用內建的圖片優化功能
import Image from "next/image";

/**
 * CouponImage 元件
 * -------------------------------------------
 * 用途：顯示優惠券圖片。
 * 說明：
 *   - 接收 coupon 物件，若有 imageUrl 則使用該圖片，
 *     否則使用預設圖片 (/img/coupon/coupon-photo.jpg)。
 *   - 使用 fill 屬性使圖片填滿父容器。
 *
 * @param {Object} props - 組件屬性
 * @param {Object} props.coupon - 優惠券資料物件，包含 imageUrl 等屬性
 */
export function CouponImage({ coupon }) {
  return (
    <Image
      // 若 coupon.imageUrl 不存在則採用預設圖片
      src={coupon.imageUrl || "/img/coupon/coupon-photo.jpg"}
      alt="優惠券圖片"
      fill // 使圖片自動填滿父容器
      style={{ objectFit: "cover" }} // 設定圖片覆蓋模式，保持比例
    />
  );
}

/**
 * CouponCard 元件
 * -------------------------------------------
 * 用途：顯示一張完整的優惠券卡片，內容包含：
 *   - 優惠券圖片
 *   - 優惠券面額/折扣值
 *   - 使用條件說明
 *   - 優惠券類型標籤
 *   - 有效期限及使用條件連結
 *   - 領取優惠券的按鈕
 *
 * @param {Object} props - 組件屬性
 * @param {Object} props.coupon - 優惠券資料物件，包含 discount、minSpent、couponType、endDate 等資訊
 */
export default function CouponCard({ coupon }) {
  return (
    <div className="coupon-card">
      {/* 優惠券圖片區塊 */}
      <div className="coupon-image">
        <CouponImage coupon={coupon} />
      </div>
      {/* 優惠券資訊區塊 */}
      <div className="coupon-left">
        {/* 顯示優惠券面額／折扣值 */}
        <div className="coupon-value">
          {coupon.discount != null
            ? `NT$${Number(coupon.discount).toFixed(0)}`
            : "NT$100"}
        </div>
        {/* 顯示使用優惠券所需條件（例如：滿額使用） */}
        <div className="coupon-condition">
          {coupon.minSpent ? `滿 ${coupon.minSpent} 可用` : "使用條件"}
        </div>
        {/* 顯示優惠券類型標籤，例如「折扣券」 */}
        <div className="coupon-type">{coupon.couponType || "折扣券"}</div>
        {/* 顯示優惠券有效期限以及使用條件連結 */}
        <div>
          <span className="coupon-expiry">
            {`有效期限：${
              coupon.endDate ? coupon.endDate.slice(0, 10) : "2025-02-10"
            }`}
          </span>
          <a href="#" className="coupon-terms">
            使用條件
          </a>
        </div>
      </div>
      {/* 領取優惠券按鈕 */}
      <button className="btn btn-claim btn-claim-style">領取</button>
    </div>
  );
}
