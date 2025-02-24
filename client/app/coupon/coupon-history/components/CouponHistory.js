"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CouponCard from "../../components/CouponCard";
import "./CouponHistory.css";
import Image from "next/image";
import '@fortawesome/fontawesome-free/css/all.min.css'

const API_BASE_URL = "http://localhost:3005/api";

export default function CouponHistory() {
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
      <div className="container mt-4 coupon-content">
  <div className="row">
    {/* 側邊欄 */}
    <aside className="col-md-3 bg-light p-3 mb-3">
      <h5>Aside</h5>
      <p>這是側邊欄內容</p>
    </aside>
    {/* 主要內容 */}
    <main className="col-md-9">
      <div className="row">
        <div className="col-md-12 bg-white text-dark p-3">
          <div style={{borderBottom: '1px solid lightgray', marginTop: 10}}>
            <h1>歷史紀錄</h1>
          </div>
          {/* 歷史紀錄篩選列 */}
          <div className="filter-group">
            <button type="button" className="active">全部</button>
            <button type="button">未使用</button>
            <button type="button">已使用</button>
            <button type="button">已過期</button>
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
          {/* 優惠券列表 */}
          <div className="row row-cols-1 row-cols-md-2 g-3 mt-4" id="couponContainer">
            {/* 優惠券內容 */}
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
              <button type="button" className="active">1</button>
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
    </main>
  </div>
</div>

    </>
  );
}
