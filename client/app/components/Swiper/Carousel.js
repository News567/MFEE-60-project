"use client"; // 讓 Next.js 確保這個元件只在 Client Side 執行

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css"; // 基本 Swiper 樣式
import "swiper/css/navigation"; // 上一頁/下一頁按鈕
import "swiper/css/pagination"; // 頁面指示點
import Link from "next/link";
import styles from "./swiper.module.css"

const Carousel = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="swiper"
    >
      <SwiperSlide>
      <div className={`${styles.kv}`}>
          <div
            className={`w-100 d-flex justify-content-between align-items-center`}
          >
            <div className="text-center w-100">
              <div
                className={`text-center d-flex flex-column ${styles.kvText}`}
              >
                <h1 className={styles.h1}>探索無重力的寧靜與神秘</h1>
                <p className={`${styles.p} d-none d-sm-block`}>
                  "It's not just diving; it's a new way of life."
                </p>
              </div>
              <Link href="/products">
                <button className={styles.scondaryBtn}>馬上逛逛</button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
      <div className={`${styles.kv}`}>
          <div
            className={`w-100 d-flex justify-content-between align-items-center`}
          >
            <div className="text-center w-100">
              <div
                className={`text-center d-flex flex-column ${styles.kvText}`}
              >
                <h1 className={styles.h1}>探索無重力的寧靜與神秘</h1>
                <p className={`${styles.p} d-none d-sm-block`}>
                  "It's not just diving; it's a new way of life."
                </p>
              </div>
              <Link href="/products">
                <button className={styles.scondaryBtn}>馬上逛逛</button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
      <div className={`${styles.kv}`}>
          <div
            className={`w-100 d-flex justify-content-between align-items-center`}
          >
            <div className="text-center w-100">
              <div
                className={`text-center d-flex flex-column ${styles.kvText}`}
              >
                <h1 className={styles.h1}>探索無重力的寧靜與神秘</h1>
                <p className={`${styles.p} d-none d-sm-block`}>
                  "It's not just diving; it's a new way of life."
                </p>
              </div>  
              <Link href="/products">
                <button className={styles.scondaryBtn}>馬上逛逛</button>
              </Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default Carousel;