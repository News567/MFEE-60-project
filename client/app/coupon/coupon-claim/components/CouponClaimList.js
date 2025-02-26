"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CouponCard from "../../components/CouponCard"; // 根據實際路徑調整

const API_BASE_URL = "http://localhost:3005/api";

export default function CouponClaimList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 讀取優惠券資料
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/coupon`)
      .then((response) => {
        if (response.data.success) {
          setCoupons(response.data.coupons);
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

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4 mb-2" id="couponContainer">
      {coupons.map((coupon) => (
        <div key={coupon.id}>
          <CouponCard coupon={coupon} />
        </div>
      ))}
    </div>
  );
}
