"use client";
import React from "react";
import CarouselItem from "./CarouselItem";
import CarouselIndicators from "./CarouselIndicators";
import CarouselControls from "./CarouselControls";
import "./Carousel.css";


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
  // 定義圖片陣列，包含每個圖片的唯一 id、來源路徑與替代文字
  const images = [
    { id: "img1", src: "/img/coupon/carousel-image_5.avif", alt: "輪播圖1" },
    { id: "img2", src: "/img/coupon/carousel-image_2.avif", alt: "輪播圖2" },
    { id: "img3", src: "/img/coupon/carousel-image_3.avif", alt: "輪播圖3" },
    { id: "img4", src: "/img/coupon/carousel-image_4.avif", alt: "輪播圖4" },
    { id: "img5", src: "/img/coupon/carousel-image_1.avif", alt: "輪播圖5" },
  ];

  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      {/* 輪播指示器：根據圖片陣列產生對應數量的指示器按鈕 */}
      <CarouselIndicators images={images} />
      
      {/* 輪播圖片項目：遍歷 images 陣列並傳入 CarouselItem 元件 */}
      <div className="carousel-inner">
        {images.map((img, index) => (
          <CarouselItem
            key={img.id}                   // 使用圖片物件中的 id 當作 key
            src={img.src}                  // 圖片來源路徑
            alt={img.alt}                  // 圖片替代文字
            active={index === 0}           // 第一張圖片預設為 active
            interval={3000}                // 每張圖片顯示 3000 毫秒
          />
        ))}
      </div>
      
      {/* 輪播控制按鈕：提供左右方向的手動切換 */}
      <CarouselControls />
    </div>
    
  );
};

export default Carousel;