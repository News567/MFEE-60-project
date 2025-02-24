"use client";

import React from "react";
import Image from "next/image";
import "./Carousel.css";

/*
 * 單一輪播項目元件 (CarouselItem)
 *
 * 功能：
 *   - 用來呈現單一張輪播圖片。
 *   - 可設定該項目是否為目前顯示的項目（active 狀態）。
 *   - 可設定該圖片自動切換的間隔時間（單位：毫秒）。
 *
 * 傳入的 Props：
 *   - src: 圖片來源的路徑。
 *   - alt: 圖片的替代文字（利於輔助工具與 SEO）。
 *   - active: 布林值，決定是否將此項目設為「目前顯示」狀態。
 *   - interval: 自動切換到下一張圖片的時間間隔。
 */
const CarouselItem = ({ src, alt, active, interval }) => (
  <div
    className={`carousel-item ${active ? "active" : ""}`} // 根據 active 狀態加入 'active' class
    data-bs-interval={interval}                         // 設定自動切換的時間間隔
    style={{ height: "70vh", position: "relative" }}
  >
<Image
      src={src}                 // 圖片來源
      alt={alt}                 // 替代文字
      layout="fill"             // 讓圖片充滿容器
      objectFit="cover"         // 圖片保持比例並覆蓋整個容器
      className="d-block w-100"  // Bootstrap 樣式：區塊級元素，寬度 100%
    />
  </div>
);

export default CarouselItem;