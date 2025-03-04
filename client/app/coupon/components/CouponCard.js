"use client"; // 告知 Next.js 此組件在客戶端執行（Client Component）

// 載入 CouponCard 專用的 CSS 樣式檔
import "./CouponCard.css";

// 從 next/image 載入 Image 組件，用來優化圖片顯示
import Image from "next/image";

// 從 React 載入 useState 與 useEffect hook，用來管理狀態與副作用
import { useState, useEffect } from "react";

/**
 * CouponImage 元件
 * 用途：顯示優惠券圖片
 * - 如果 coupon.image_url 存在，就使用該圖片
 * - 若不存在，則顯示預設圖片（/img/coupon/coupon-photo.jpg）
 */
export function CouponImage({ coupon }) {
  return (
    <Image
      src={coupon.image_url || "/img/coupon/coupon-photo.jpg"} // 使用提供的圖片網址，若無則顯示預設圖片
      alt="優惠券圖片" // 圖片替代文字，利於無障礙設計
      fill // 讓圖片自動填滿父層容器
      style={{ objectFit: "cover" }} // 設定圖片的填充模式，避免變形
    />
  );
}

/**
 * CouponCard 元件
 * 用途：顯示優惠券卡片，包括圖片、內容、進度條以及領取按鈕
 * 右上角 badge 顯示邏輯：
 * - 若 coupon.max_per_user 大於 1：
 *     * 若未領取（claimed 為 false），顯示「剩餘 {remaining}」
 *     * 若已領取（claimed 為 true），顯示「可使用 {usable}」
 * - 若等於 1，則不顯示 badge
 */
export default function CouponCard({ coupon, onClaim }) {
  console.log("CouponCard received coupon:", coupon); // 確保有拿到資料
  // 狀態管理：claimed, remaining, usable 與提示訊息
  const [claimed, setClaimed] = useState(coupon.claimed || false);
  const [remaining, setRemaining] = useState(coupon.remaining || coupon.max_per_user);
  const [usable, setUsable] = useState(coupon.usable || 0);
  const [message, setMessage] = useState("");

  // 當外部傳入的 coupon 資料更新時，同步更新狀態
  useEffect(() => {
    setClaimed(coupon.claimed || false);
    setRemaining(coupon.remaining || coupon.max_per_user);
    setUsable(coupon.usable || 0);
  }, [coupon.claimed, coupon.remaining, coupon.usable, coupon.max_per_user]);

  // 判斷優惠券是否已過期或已使用
  const now = new Date();
  const isExpired = coupon.end_date ? now > new Date(coupon.end_date) : false;
  const isUsed = coupon.used || false;

  // 保留進度條邏輯（僅供參考，不影響 badge 顯示）
  const totalIssued = coupon.total_issued || 1;
  const claimedCount = coupon.claimed || 0;
  const percentageClaimed = Math.round((claimedCount / totalIssued) * 100);
  const percentageRemaining = 100 - percentageClaimed;

  // 處理領取按鈕點擊事件
  const handleClaimClick = async () => {
    if (typeof onClaim !== "function") {
      console.error("onClaim is not a function:", onClaim);
      setMessage("發生錯誤，請稍後再試");
      return;
    }
    try {
      await onClaim(coupon.id);
      // 領取成功後更新狀態：設定 claimed 為 true，且更新 remaining 與 usable（這裡假設領取後 usable 更新為最新值）
      setClaimed(true);
      // 具體數值應根據後端更新後取得，這裡示範不修改 usable 與 remaining，或可透過重新讀取資料更新
    } catch (error) {
      console.error("領取錯誤:", error);
      setMessage("領取失敗，請稍後再試");
    }
  };

  // 若優惠券已過期或已使用，則不渲染該卡片
  if (isExpired || isUsed) {
    return null;
  }

  return (
    <div
      className="coupon-card"
      style={{ position: "relative", display: "flex" }} // 使用 flex 佈局方便排版
    >
      {/* 右上角 badge：
          僅當優惠券每人可領取數量大於 1 時才顯示，
          並依據 coupon.remaining 顯示剩餘可領取張數 */}
      {coupon.max_per_user > 1 && (
        <div className="coupon-max">x {remaining}</div>
      )}

      {/* 圖片區塊 */}
      <div className="coupon-image">
        <CouponImage coupon={coupon} /> {/* 使用 CouponImage 元件來顯示圖片 */}
      </div>

      {/* 內容區塊 */}
      <div className="coupon-left">
        {/* 顯示優惠券折扣金額或折扣率 */}
        <div className="coupon-value">
          {coupon.discount != null
            ? coupon.discount_type === "金額"
              ? `NT$${Number(coupon.discount).toFixed(0)}`
              : (() => {
                  let discountValue;
                  const discountNum = Number(coupon.discount);
                  if (discountNum < 1) {
                    discountValue = Number.isInteger(discountNum * 10)
                      ? discountNum * 10
                      : discountNum * 100;
                  } else {
                    discountValue = discountNum;
                  }
                  return `${discountValue}折`;
                })()
            : "NT$100"}{" "}
          {/* 若沒有設定折扣，預設顯示 NT$100 */}
        </div>

        {/* 顯示使用優惠券的最低消費金額條件 */}
        <div className="coupon-condition">
          {coupon.min_spent
            ? `滿 NT$${Number(coupon.min_spent).toFixed(0)} 可用`
            : "使用條件"}
        </div>

        {/* 顯示優惠券名稱與代碼 */}
        <div className="d-flex justify-content-left align-items-center">
          <div className="coupon-type">{coupon.campaign_name || "折扣券"}</div>
          <div className="coupon-code" style={{ fontWeight: "300" }}>
            代碼：{coupon.code || "無代碼"}
          </div>
        </div>

        {/* 顯示有效期限與使用條件連結 */}
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

        {/* 顯示已領取與剩餘的百分比文字 */}
        <div className="mt-1" style={{ fontSize: "12px", color: "#666" }}>
          已領取 {percentageClaimed}% / 剩餘 {percentageRemaining}%
        </div>

        {/* 顯示領取進度條 */}
        <div
          className="progress mt-2 progress-custom"
          style={{ height: "3px" }}
        >
          <div
            className="progress-bar progress-bar-custom"
            role="progressbar"
            style={{ width: `${percentageRemaining}%` }}
            aria-valuenow={percentageRemaining}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      {/* 按鈕區：若尚未領取則顯示領取按鈕，已領取則顯示前往逛逛按鈕 */}
      <div className="coupon-right d-flex align-items-center">
        {!(isExpired || isUsed) && (
          <>
            {claimed ? (
              // 若已領取，按鈕會導向 /browse 頁面
              <button
                className="btn btn-claim btn-claim-style"
                onClick={() => (window.location.href = "/browse")}
              >
                去逛逛
              </button>
            ) : (
              // 尚未領取則顯示領取按鈕
              <button
                className="btn btn-claim btn-claim-style"
                onClick={handleClaimClick}
              >
                領取
              </button>
            )}
          </>
        )}
      </div>

      {/* 若有訊息則顯示，例如錯誤或成功提示 */}
      {message && <p>{message}</p>}
    </div>
  );
}
