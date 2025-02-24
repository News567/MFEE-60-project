// pages/CouponClaim.jsx (或對應路徑)
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import CouponClaimList from "./CouponClaimList"; // 同層的 CouponClaimList 元件
import Carousel from "./Carousel/Carousel";
import "./CouponClaim.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CouponClaim() {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/member/login");
    }
  }, [user, router]);

  if (!user) {
    return <div>載入中...</div>;
  }
  
  return (
    <>
      <div>
        <div className="carousel">
          <Carousel />
        </div>
        {/* 麵包屑導航 */}
        <Breadcrumb />
        {/* 優惠券內容區 */}
        <div className="container mt-2 coupon-content">
          <h1 className="mb-4">您的專屬優惠</h1>
          {/* 優惠券搜尋框 */}
          <div className="mb-4">
            <div className="input-group input-group-md coupon-search">
              <input
                type="text"
                className="form-control"
                id="searchInput"
                placeholder="輸入優惠券代碼或名稱"
              />
              <span className="input-group-text d-flex justify-content-center">
                <i className="bi bi-search" />
              </span>
            </div>
          </div>
          {/* 優惠活動篩選列 */}
          <div className="d-flex">
            <div className="d-flex gap-2 mt-4 mb-2 horizontal-scroll">
              <button type="button" className="btn rounded-pill px-3 active">
                精選優惠
              </button>
              <button type="button" className="btn rounded-pill px-3">
                全部優惠
              </button>
              <button type="button" className="btn rounded-pill px-3">
                新春優惠
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱
              </button>
              <button type="button" className="btn rounded-pill px-3">
                優惠活動名稱動
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-center scroll-indicator mt-4">
              <i className="fa-solid fa-circle-chevron-right" />
            </div>
          </div>
          {/* 優惠券類型篩選列 */}
          <div className="filter-group flex-wrap mt-2">
            <span className="filter-label">優惠類型：</span>
            <div className="flex-wrap">
              <button type="button" className="active">
                全部
              </button>
              <button type="button">全館優惠券</button>
              <button type="button">商品優惠券</button>
              <button type="button">租賃優惠券</button>
              <button type="button">活動優惠券</button>
              <button type="button">會員專屬優惠券</button>
            </div>
          </div>
          {/* 領取狀態篩選列 */}
          <div className="filter-group">
            <span className="filter-label">領取狀態：</span>
            <button type="button" className="active">
              全部
            </button>
            <button type="button">已領取</button>
            <button type="button">未領取</button>
          </div>
          {/* 分頁與排序選單 */}
          <div className="d-flex justify-content-between align-items-center my-4">
            <div className="pagination">顯示 第1頁 / 共6頁</div>
            <div className="d-flex align-items-center">
              <span>排序</span>
              <select className="form-select form-select-sm rounded-pill custom-select-container">
                <option value="latest">最新</option>
                <option value="expiry">即將到期</option>
                <option value="discount">最高折扣</option>
              </select>
            </div>
          </div>
          {/* 導入 CouponClaimList，並傳入會員 ID */}
          <CouponClaimList userId={user.id} token={token} />
          {/* 分頁控制區 */}
          <div className="pagination mb-3">
            <div className="pagination-info">顯示 第1-12張 / 共72張 優惠券</div>
            <div className="page-buttons">
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}