"use client"; // 確保這是 Client Component

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // 載入 Bootstrap 樣式
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // 載入 Bootstrap JS
import CarouselItem from "./CarouselItem"; // 引入輪播圖片元件
import CarouselIndicators from "./CarouselIndicators"; // 引入輪播指示器元件
import CarouselControls from "./CarouselControls"; // 引入輪播控制按鈕元件

/*
 * 整體輪播元件 (Carousel)
 *
 * 功能：
 *   - 整合輪播指示器、輪播項目與控制按鈕，形成完整的輪播區。
 *   - 內部定義圖片陣列，每個物件包含圖片的 id、src 與 alt 資訊。
 *
 * 說明：
 *   - 透過 map() 方法遍歷圖片陣列，並將每個項目傳入 CarouselItem 元件。
 *   - 使用圖片物件中的 id 當作 key，確保 React 元件的唯一性與穩定性。
 */

const Carousel = () => {
  useEffect(() => {
    setTimeout(() => {
      // 確保 Bootstrap 已載入
      if (typeof window !== "undefined" && window.bootstrap) {
        const carouselElement = document.querySelector("#carouselExample");
        if (carouselElement) {
          const carousel = new window.bootstrap.Carousel(carouselElement, {
            interval: 2000, // 設定 2 秒自動播放
            ride: "carousel", // 讓 Bootstrap 接管自動輪播
            pause: false, // 滑鼠懸停時不暫停
          });

          // 強制啟動輪播
          carousel.cycle();
        }
      } else {
        console.error("Bootstrap JS 載入失敗");
      }
    }, 300); // 延遲 300 毫秒，確保 React DOM 渲染完成
  }, []);

  // 定義輪播的圖片陣列，每張圖片包含 id、src 路徑和替代文字 (alt)
  const images = [
    { id: "img1", src: "/img/coupon/carousel-image_5.avif", alt: "輪播圖1" },
    { id: "img2", src: "/img/coupon/carousel-image_2.avif", alt: "輪播圖2" },
    { id: "img3", src: "/img/coupon/carousel-image_3.avif", alt: "輪播圖3" },
    { id: "img4", src: "/img/coupon/carousel-image_4.avif", alt: "輪播圖4" },
    { id: "img5", src: "/img/coupon/carousel-image_1.avif", alt: "輪播圖5" },
  ];

  return (
    <div id="carouselExample" className="carousel slide">
      {/* 輪播指示器，根據圖片數量動態生成 */}
      <CarouselIndicators images={images} />

      {/* 輪播內容區塊，根據 images 陣列動態產生輪播項目 */}
      <div className="carousel-inner">
        {images.map((img, index) => (
          <CarouselItem
            key={img.id} // 設定唯一 key，確保 React 正確更新 DOM
            src={img.src} // 圖片來源
            alt={img.alt} // 圖片的替代文字
            active={index === 0} // 第一張圖片預設為 active
            interval={2000} // 設定自動輪播間隔時間
          />
        ))}
      </div>

      {/* 左右切換按鈕 */}
      <CarouselControls />
    </div>
  );
};

export default Carousel;
