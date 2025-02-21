"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb/breadcrumb";
import axios from "axios";
import CouponCard from "../../components/CouponCard";
import "./CouponClaim.css";
import Image from "next/image";

const API_BASE_URL = "http://localhost:3005/api";

export default function CouponClaim() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 讀取優惠券資料
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/coupon`)
      .then((response) => {
        if (response.data.status === "success") {
          setCoupons(response.data.data.coupons);
        } else {
          setError("獲取優惠券資料失敗");
        }
      })
      .catch((err) => {
        console.error("Error fetching coupons:", err);
        setError("獲取優惠券資料時發生錯誤");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>載入中...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  // 優惠券列表（動態渲染）
  return (
    <>
      <div>
        {/* 圖片輪播區：展示多張輪播圖 */}
        <div
          id="carouselExample"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {/* 輪播指示器：可點擊切換不同輪播圖 */}
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide-to={0}
                className="active"
                aria-current="true"
              />
              <button
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide-to={1}
              />
              <button
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide-to={2}
              />
              <button
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide-to={3}
              />
              <button
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide-to={4}
              />
            </div>
            {/* 輪播項目：每個 carousel-item 為一張圖片，並設定自動切換間隔 */}
            <div className="carousel-item active" data-bs-interval={3000}>
              <Image
                src="/img/coupon/carousel-image_1.jpg"
                className="d-block w-100"
                alt="輪播圖1"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            <div className="carousel-item" data-bs-interval={3000}>
              <Image
                src="/img/coupon/carousel-image_2.jpg"
                className="d-block w-100"
                alt="輪播圖2"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            <div className="carousel-item" data-bs-interval={3000}>
              <Image
                src="/img/coupon/carousel-image_3.jpg"
                className="d-block w-100"
                alt="輪播圖3"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            <div className="carousel-item" data-bs-interval={3000}>
              <Image
                src="/img/coupon/carousel-image_4.jpg"
                className="d-block w-100"
                alt="輪播圖4"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            <div className="carousel-item" data-bs-interval={3000}>
              <Image
                src="/img/coupon/carousel-image_5.jpg"
                className="d-block w-100"
                alt="輪播圖5"
                layout="responsive"
                width={1920}
                height={1080}
              />
            </div>
            {/* 輪播控制按鈕：上一張 */}
            <button
              className="carousel-control-prev custom-carousel-btn"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <i className="fas fa-chevron-left custom-carousel-icon" />
            </button>
            {/* 輪播控制按鈕：下一張 */}
            <button
              className="carousel-control-next custom-carousel-btn"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
              <i className="fas fa-chevron-right custom-carousel-icon" />
            </button>
          </div>
        </div>
        {/* 麵包屑導航區：顯示使用者當前所在的層級 */}
        <Breadcrumb />
        {/* 優惠券內容區：包含專屬優惠標題、搜尋、篩選及優惠券列表 */}
        <div className="container mt-4 coupon-content">
          <h1 className="mb-4">您的專屬優惠</h1>
          {/* 優惠券搜尋框：可依優惠券代碼或名稱搜尋 */}
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
          {/* 優惠活動篩選列：提供橫向捲動的篩選按鈕 */}
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
            {/* 向右捲動圖示：提示使用者可繼續向右滑動查看更多篩選選項 */}
            <div className="d-flex align-items-center justify-content-center scroll-indicator mt-4">
              <i className="fa-solid fa-circle-chevron-right" />
            </div>
          </div>
          {/* 優惠券類型篩選列：讓使用者依優惠券種類進行篩選 */}
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
          {/* 領取狀態篩選列：可根據優惠券是否已領取進行篩選 */}
          <div className="filter-group">
            <span className="filter-label">領取狀態：</span>
            <button type="button" className="active">
              全部
            </button>
            <button type="button">已領取</button>
            <button type="button">未領取</button>
          </div>
          {/* 分頁與排序選單：顯示目前分頁狀態與提供排序下拉選單 */}
          <div className="d-flex justify-content-between align-items-center my-4">
            {/* 分頁資訊 */}
            <div className="pagination">顯示 第1頁 / 共6頁</div>
            {/* 排序下拉選單 */}
            <div className="d-flex align-items-center">
              <span>排序</span>
              <select className="form-select form-select-sm rounded-pill custom-select-container">
                <option value="latest">最新</option>
                <option value="expiry">即將到期</option>
                <option value="discount">最高折扣</option>
              </select>
            </div>
          </div>
          {/* 優惠券列表區：以網格形式展示各張優惠券 */}
          <div
            className="row row-cols-1 row-cols-md-2 g-4 mb-2"
            id="couponContainer"
          >
            {/* 優惠券卡片 1 */}
            {coupons.map((coupon) => (
              <div className="" key={coupon.id}>
                <CouponCard coupon={coupon} />
              </div>
            ))}
          </div>
          {/* 分頁控制區：顯示優惠券總數與分頁按鈕 */}
          <div className="pagination mb-3">
            <div className="pagination-info">顯示 第1-12張 / 共72張 優惠券</div>
            <div className="page-buttons">
              {/* 上一頁 */}
              {/* <button type="button">
    <i class="fa-solid fa-chevron-left"></i>
  </button> */}
              {/* 當前分頁 */}
              <button type="button" className="active">
                1
              </button>
              <button type="button">2</button>
              <button type="button">3</button>
              {/* 下一頁 */}
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
