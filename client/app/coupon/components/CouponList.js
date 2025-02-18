"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CouponCard from "./CouponCard";
import "./CouponList.css";

const API_BASE_URL = "http://localhost:3005/api";

export default function CouponList() {
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
      {/* 主內容區塊：優惠券頁面主要內容 */}
      <div className="container mt-4 coupon-content">
        <div className="row">
          {/* 側邊欄：可放入會員中心選單或其他資訊 */}
          <aside className="col-md-3 bg-light p-3 mb-3">
            <h5>Aside</h5>
            <p>這是側邊欄內容</p>
          </aside>
          {/* 主要內容區：顯示優惠券列表及相關操作 */}
          <main className="col-md-9">
            <div className="row">
              <div className="col-md-12 bg-white text-dark p-3">
                {/* 優惠券標題與快速操作連結 */}
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ borderBottom: "1px solid lightgray", marginTop: 10 }}
                >
                  <h1>優惠券</h1>
                  <div className="link-list">
                    <a href="#" className="me-3">
                      領取優惠券 &gt;
                    </a>{" "}
                    |
                    <a href="#" className="ms-3">
                      查看歷史資料
                    </a>
                  </div>
                </div>
                {/* 淺灰色區塊：包含「新增優惠券」標題與搜尋框 */}
                <div className="d-flex bg-light p-3 mt-3 gray-block">
                  {/* 搜尋區：可輸入優惠券代碼或名稱 */}
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ width: "100%" }}
                  >
                    <span className="me-3 search-text">新增優惠券</span>
                    <div
                      className="input-group input-group-md coupon-search"
                      style={{ maxWidth: 400 }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        id="searchInput"
                        placeholder="輸入優惠券代碼"
                      />
                      <span className="input-group-text d-flex justify-content-center">
                        <i className="bi bi-search" />
                      </span>
                    </div>
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
                <div className="filter-group flex-wrap mt-1">
                  <span className="filter-label">活動狀態：</span>
                  <div className="flex-wrap">
                    <button type="button" className="active">
                      全部
                    </button>
                    <button type="button">已開始</button>
                    <button type="button">即將結束</button>
                    <button type="button">即將開始</button>
                    <button type="button">未開始</button>
                  </div>
                </div>
                {/* 分頁與排序選單 */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  {/* 分頁顯示 */}
                  <div className="pagination">顯示 第1頁 / 共6頁</div>
                  {/* 排序選單 */}
                  <div className="d-flex align-items-center">
                    <span className="me-2">排序方式：</span>
                    <select className="form-select form-select-sm rounded-pill custom-select-container">
                      <option value="latest">最新</option>
                      <option value="expiry">即將到期</option>
                      <option value="discount">最高折扣</option>
                    </select>
                  </div>
                </div>
                {/* 優惠券列表：使用卡片方式顯示各張優惠券 */}
                <div className="row row-cols-1 row-cols-md-2 g-3 mt-4">
                  {/* 優惠券卡片 1 */}
                    {coupons.map((coupon) => (
                      <div className="" key={coupon.id}>
                        <CouponCard coupon={coupon} />
                      </div>
                    ))}
                </div>
                {/* 分頁控制區：顯示優惠券總數與分頁按鈕 */}
                <div className="pagination my-4">
                  <div className="pagination-info">
                    顯示 第1-12張 / 共72張 優惠券
                  </div>
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
                {/* 為你推薦區：顯示推薦商品 */}
                <div className="d-flex justify-content-center align-items-center mt-5 mb-3">
                  <div
                    className="border-bottom"
                    style={{ width: "12.5rem", height: 1 }}
                  />
                  <h5 className="mx-4 mb-0 fw-bold">為你推薦</h5>
                  <div
                    className="border-bottom"
                    style={{ width: "12.5rem", height: 1 }}
                  />
                </div>
                <div className="row row-cols-1 row-cols-md-2 g-3">
                  {/* 推薦商品 1 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 2 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 3 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 4 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 5 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 6 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 7 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 推薦商品 8 */}
                  <div className="col">
                    <div className="card border">
                      <div className="d-flex align-items-center p-3">
                        {/* 商品圖片 */}
                        <img
                          src="./coupon-image/product_375x.webp"
                          className="rounded me-3 coupon-product-image"
                          alt="商品圖片"
                        />
                        {/* 商品資訊 */}
                        <div className="flex-grow-1">
                          <p className="mb-1 text-truncate fw-bold">
                            MARES - RAZOR PRO 高階塑膠蛙板
                          </p>
                          <span className="text-primary fw-bold">$1990</span>
                        </div>
                        {/* 優惠資訊區 */}
                        <div className="border-start ps-3 text-center">
                          <p className="mb-0">折 $30元</p>
                          <small className="text-muted">低消 $2000</small>
                          <button className="btn btn-sm btn-primary mt-2">
                            領取
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
