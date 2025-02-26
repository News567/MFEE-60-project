"use client";

import React from "react";
import "./styles/CarouselControls.css";


/*
 * 輪播控制按鈕元件 (CarouselControls)
 *
 * 功能：
 *   - 提供左右方向的控制按鈕，讓使用者可以手動切換輪播圖。
 *
 * 說明：
 *   - 左側按鈕：切換到前一張圖片。
 *   - 右側按鈕：切換到下一張圖片。
 */
const CarouselControls = () => (
  <>
    {/* 左側控制按鈕 */}
    <button
      className="carousel-control-prev custom-carousel-btn" // 包含自訂樣式與 Bootstrap 樣式
      type="button"
      data-bs-target="#carouselExample"                     // 指定目標輪播容器 ID
      data-bs-slide="prev"                                  // 指定動作：前一張
    >
      <i className="fas fa-chevron-left custom-carousel-icon" /> {/* 使用字型圖示顯示左箭頭 */}
    </button>
    {/* 右側控制按鈕 */}
    <button
      className="carousel-control-next custom-carousel-btn"
      type="button"
      data-bs-target="#carouselExample"
      data-bs-slide="next"                                 // 指定動作：下一張
    >
      <i className="fas fa-chevron-right custom-carousel-icon" /> {/* 使用字型圖示顯示右箭頭 */}
    </button>
  </>
);

export default CarouselControls;