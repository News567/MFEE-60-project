// components/CouponSearchBox.jsx
"use client";

import React, { useState } from "react";
import "./styles/CouponSearchBox.css";

export default function CouponSearchBox({ onSearch = () => {} }) {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };
  // 當點擊放大鏡圖示時，觸發搜尋
  const handleIconClick = () => {
    onSearch(searchValue);
  };

  /**
   * CouponSearchBox 元件
   * 用途：提供優惠券搜尋框
   *
   * Props:
   * - onSearch: 當輸入值改變時，呼叫該函式，參數為當前輸入字串
   */
  return (
    <div className="mb-4">
      <div className="input-group input-group-md coupon-search">
        <input
          type="text"
          className="form-control coupon-search-input"
          placeholder="輸入優惠券代碼或名稱"
          value={searchValue}
          onChange={handleChange}
        />
        <span
          className="input-group-text d-flex justify-content-center"
          onClick={handleIconClick}
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-search" />
        </span>
      </div>
    </div>
  );
}
