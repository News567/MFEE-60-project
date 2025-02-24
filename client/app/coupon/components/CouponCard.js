"use client";

// 引入 CouponCard 專用 CSS 樣式檔
import "./CouponCard.css";
// 從 Next.js 匯入圖片元件，利用內建的圖片優化功能
import Image from "next/image";
import { useState } from "react";

/**
 * CouponImage 元件
 * 用途：顯示優惠券圖片。若 coupon.image_url 不存在則使用預設圖片。
 */
export function CouponImage({ coupon }) {
  return (
    <Image
      src={coupon.image_url || "/img/coupon/coupon-photo.jpg"}
      alt="優惠券圖片"
      fill
      style={{ objectFit: "cover" }}
    />
  );
}

/**
 * CouponCard 元件
 * 顯示優惠券卡片內容與領取按鈕，當按鈕點擊時，使用 fetch 發送 API 請求，並把 token 加入 Authorization header。
 *
 * Props:
 * - coupon: 優惠券資料物件（包含 discount, min_spent, campaign_name, end_date, 等）
 * - userId: 會員 ID
 * - token: JWT token（用於 API 請求）
 */
export default function CouponCard({ coupon, userId, token }) {
  const [claimed, setClaimed] = useState(false);
  const [message, setMessage] = useState("");

  const handleClaim = async () => {
    try {
      const res = await fetch("/api/coupon/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // 將 token 加入 header
        },
        body: JSON.stringify({ couponId: coupon.id, userId }),
      });
      const data = await res.json();
      if (data.success) {
        setClaimed(true);
        setMessage("優惠券領取成功！");
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage("領取失敗，請稍後再試");
    }
  };

  return (
    <div className="coupon-card">
      <div className="coupon-image">
        <CouponImage coupon={coupon} />
      </div>
      <div className="coupon-left">
        <div className="coupon-value">
          {coupon.discount != null
            ? coupon.discount_type === "金額"
              ? `NT$${Number(coupon.discount).toFixed(0)}`
              : (() => {
                  let discountValue;
                  const discountNum = Number(coupon.discount);
                  if (discountNum < 1) {
                    if (Number.isInteger(discountNum * 10)) {
                      discountValue = discountNum * 10;
                    } else {
                      discountValue = discountNum * 100;
                    }
                  } else {
                    discountValue = discountNum;
                  }
                  return `${discountValue}折`;
                })()
            : "NT$100"}
        </div>
        <div className="coupon-condition">
          {coupon.min_spent
            ? `滿 NT$${Number(coupon.min_spent).toFixed(0)} 可用`
            : "使用條件"}
        </div>
        <div className="coupon-type">{coupon.campaign_name || "折扣券"}</div>
        <div>
          <span className="coupon-expiry">
            {`有效期限：${
              coupon.end_date ? coupon.end_date.slice(0, 10) : "2025-02-10"
            }`}
          </span>
          <a href="#" className="coupon-terms">
            使用條件
          </a>
        </div>
      </div>
      {claimed ? (
        <button
          className="btn btn-claim btn-claim-style"
          onClick={() => (window.location.href = "/browse")}
        >
          去逛逛
        </button>
      ) : (
        <button className="btn btn-claim btn-claim-style" onClick={handleClaim}>
          領取
        </button>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
