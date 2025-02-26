"use client";

import React from "react";
import "./styles/CarouselIndicators.css";

/*
 * 輪播指示器元件 (CarouselIndicators)
 *
 * 功能：
 *   - 根據傳入的圖片陣列數量，動態產生對應數量的指示器按鈕。
 *   - 使用者可點擊這些按鈕，快速切換到指定的輪播項目。
 *
 * 傳入的 Props：
 *   - images: 一個陣列，每個元素代表一筆圖片資料（此元件只需要根據陣列長度來產生按鈕）。
 */
const CarouselIndicators = ({ images }) => (
  <div className="carousel-indicators">
    {images.map((_, index) => (
      <button
        key={index}                                     // React 需要唯一的 key 屬性
        type="button"                                   // 按鈕類型設定
        data-bs-target="#carouselExample"               // 指定要控制的輪播容器 ID
        data-bs-slide-to={index}                        // 指定切換到哪一張圖片（從 0 開始）
        className={index === 0 ? "active" : ""}           // 預設第一個按鈕為 active 狀態
        aria-current={index === 0 ? "true" : undefined}   // 輔助屬性：告知螢幕閱讀器目前是第一項
      />
    ))}
  </div>
);

export default CarouselIndicators;