"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic"; // 動態導入，動態加載 flatpickr，從而避免伺服器端渲染時的問題
// import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./flatpickr.css"; // 我定義的小日曆css
import "./RentDetail.css";
import "../../../public/globals.css";

const Flatpickr = dynamic(() => import("flatpickr"), { ssr: false });

export default function RentProductDetail() {
  // const router = useRouter();
  // const { id } = router.query;
  const [product, setProduct] = useState(null);
  // 商品圖片 大圖切換
  const [mainImage, setMainImage] = useState(product?.images?.[0] || "");
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // 商品描述區塊切換tab

  // 模擬從 API 獲取商品資料
  useEffect(() => {
    // if (!router.isReady) return; // 如果 router 未準備好，直接返回
    const mockProduct = {
      id: 1,
      mainImage: "/img/rent/fit/1733124689_8081.jpg",
      images: [
        "/img/rent/fit/1733124689_8081.jpg",
        "/img/rent/fit/1733124703_2778.jpg",
        "/img/rent/fit/1733124689_3585.jpg",
        "/img/rent/fit/1733124689_2281.jpg",
      ],
      brand: "C4",
      name: "PLASMA 低容積面鏡",
      rating: 4,
      price: 145,
      description: "超耐磨鋼化玻璃，良好的視野和低內部容積...",
      stock: 2,
      colors: ["#4d4244", "#403f6f", "white", "pink"],
      rules: [
        "租借本人出示潛水證",
        "租用需先付款，並提供個人證件一張",
        "完成租借表單並完成簽名",
        "如有遺失或損害，需修復原有狀況或是全新賠償",
        "租借與歸還時間限每日上午8:00至 下午5:00，過時則以多借一天計算",
        "以天計價，非24小時制度。例如: 12/18日下午2點租借，12/19下午2點歸還，則算兩天",
      ],
    };
    setProduct(mockProduct);
  }, []); //router.isReady, id

  // 初始化 Flatpickr
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      document.querySelector("#fixed-calendar")
    ) {
      flatpickr("#fixed-calendar", {
        mode: "range",
        dateFormat: "Y年m月d日",
        minDate: "today",
        inline: true,
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
            longhand: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
          },
          months: {
            shorthand: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            longhand: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
          },
        },
        disableMobile: true,
        onChange: function (selectedDates, dateStr, instance) {
          const dateRangeText = document.querySelector("#date-range-text");
          const totalCostText = document.querySelector("#total-cost-text");
          const startDate = selectedDates[0];
          const endDate = selectedDates[1];

          if (startDate && endDate) {
            const formattedStartDate = instance.formatDate(
              startDate,
              "Y年m月d日"
            );
            const formattedEndDate = instance.formatDate(endDate, "Y年m月d日");
            dateRangeText.textContent = `租賃 ${formattedStartDate} 至 ${formattedEndDate}`;
            totalCostText.style.display = "block";
          } else {
            dateRangeText.textContent = "";
            totalCostText.style.display = "none";
          }
        },
      });
      if (product?.images?.length) {
        setMainImage(product.images[0]); // 當 product 變更時，重新設置大圖
      }
    }
  }, [product]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  if (!product) return <div>商品載入中...</div>;

  return (
    <div className="container py-4 mx-auto">
      <Head>
        <title>租借商品詳情</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </Head>

      {/* 商品詳細資訊 */}
      <div className="row">
        <div className="main-details d-flex flex-row justify-content-between align-items-start">
          <div className="row">
            {/* 圖片區域 */}
            <div className="px-3 col-12 col-md-6 col-lg-6 order-1 mx-auto d-flex flex-column">
              <div className="main-image">
                <Image
                  src={mainImage} // 動態設置大圖的 src
                  className="img-fluid"
                  alt="商品主圖"
                  width={360}
                  height={360}
                  layout="responsive"
                  priority
                  unoptimized
                />
              </div>
              <div
                className="small-images d-flex flex-row justify-content-between align-items-center"
                ref={containerRef}
              >
                {product.images.map((img, index) => {
                  const containerWidth = 538; // 小圖總容器
                  const gap = 10;
                  const imageCount = product.images.length;
                  const imageWidth =
                    (containerWidth - (imageCount - 1) * gap) / imageCount;
                  const imageHeight = imageWidth; // 正方形

                  return (
                    <div
                      key={index}
                      onClick={() => setMainImage(img)}
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                      }}
                    >
                      <Image
                        src={img}
                        className="img-fluid"
                        alt={`小圖${index + 1}`}
                        width={imageWidth}
                        height={imageHeight}
                        priority
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>
              <div className="rent-rules d-flex flex-column">
                <p className="rules-title">租借規則</p>
                <ul className="rules-content">
                  {product.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 文字區域 */}
            <div className="px-3 col-12 col-md-6 col-lg-6 order-2 mx-auto d-flex flex-column details-text">
              <div className="details-titles d-flex flex-column">
                <p className="product-brand">{product.brand}</p>
                <div className="product-name-fav d-flex flex-row justify-content-between align-items-center">
                  <p className="product-name">{product.name}</p>
                  <i className="bi bi-heart heart-icon"></i>
                  <i className="bi bi-heart-fill heart-icon-fill"></i>
                </div>
                <div className="stars d-flex flex-row">
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`bi bi-star${
                        index < product.rating ? "-fill" : ""
                      }`}
                    ></i>
                  ))}
                </div>
              </div>
              <div className="subdetails-titles d-flex flex-column">
                <p className="product-price">NT${product.price}/日</p>
                <p className="product-description">{product.description}</p>
              </div>
              <div className="details-select d-flex flex-column">
                <p className="product-stock">庫存僅剩 {product.stock} 件</p>
                <div className="product-color">
                  <p className="color-title">產品顏色</p>
                  <div className="colors d-flex flex-row">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="color-box"
                        style={{ backgroundColor: color }}
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="product-amount">
                  <p className="amount-title">產品數量</p>
                  <div className="amounts d-flex flex-row align-items-center">
                    <button
                      className="quantity-btn minus"
                      onClick={() =>
                        setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                      }
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="text"
                      className="quantity-input"
                      value={quantity}
                      readOnly
                    />
                    <button
                      className="quantity-btn plus"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="booking-date">
                  <p className="booking-title">預訂日期</p>
                  <div className="booking-calendar d-flex flex-column align-items-center">
                    <div id="fixed-calendar"></div>
                    <div className="d-flex flex-column selected-date-range w-100">
                      <p id="date-range-text"></p>
                      <p id="total-cost-text">
                        總費用 {product.price * quantity} 元
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center product-btns">
                <button type="button" className="mybtn btn-cart flex-grow-1">
                  加入購物車
                </button>
                <button type="button" className="mybtn btn-buy flex-grow-1">
                  直接購買
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 商品描述及品牌介紹 */}
      <div className="col-12 d-flex flex-column mt-4 under-details">
        {/* 分頁按鈕 */}
        <div className="d-flex flex-row justify-content-center align-items-center tab-buttons">
          <button
            className={`tab-button ${
              activeTab === "description" ? "active" : ""
            }`}
            onClick={() => setActiveTab("description")}
          >
            <p className="under-details-title">商品描述</p>
          </button>
          <button
            className={`tab-button ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            <p className="under-details-title">會員評價</p>
          </button>
        </div>
        {/* 分頁內容 */}
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="under-detail">
              <div className="d-flex flex-column under-details-content">
                <p>{product.description}</p>
              </div>
              <div className="d-flex flex-column under-brand">
                <p className="product-brand">品牌介紹</p>
                <div className="d-flex flex-column under-details-brand">
                  來自義大利的複合材料製造商C4創立於1986年，初始研發的是自行車使用之碳纖維材料，隨後將這樣的材料技術延伸至自由潛水/水中漁獵的裝備；卓越的性能與粗獷的外型，受到許多專業玩家的喜愛。
                </div>
              </div>
            </div>
          )}
          {activeTab === "comments" && (
            <div className="under-comments">
              <div className="d-flex flex-column under-comments-content">
                {/* 這裡放會員評價的內容 */}
                <p>切版用：暫無評價。</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 你可能會喜歡 */}
      <div className="col-12 d-flex flex-column mt-4 you-may-likes">
        <div className="you-may-like">
          <h3 className="you-may-like-title">你可能會喜歡</h3>
        </div>
        <div className="row you-may-like-products">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="col-12 col-sm-6 col-md-4 col-lg-3 you-may-like-product mb-4"
            >
              <div className="card border-0 h-100">
                <Image
                  src="/img/rent/fit/1732690021_5668.jpg"
                  className="card-img-top product-img w-100"
                  alt="TRYGONS液態面鏡"
                  width={148} // 設定圖片的寬度
                  height={148} // 設定圖片的高度
                  layout="responsive"
                  priority
                  unoptimized
                />
                <div className="py-2 px-0 d-flex flex-column justify-content-start align-items-center card-body">
                  <p className="product-brand">TRYGONS</p>
                  <p className="product-name">液態面鏡</p>
                  <h6 className="product-price">NT $740</h6>
                  <h6 className="product-price2">NT $350</h6>
                  <div className="d-flex flex-row justify-content-center align-items-center product-color">
                    <span
                      className="color-box"
                      style={{ backgroundColor: "#4d4244" }}
                    ></span>
                    <span
                      className="color-box"
                      style={{ backgroundColor: "#403f6f" }}
                    ></span>
                    <span
                      className="color-box"
                      style={{ backgroundColor: "white" }}
                    ></span>
                  </div>

                  {/* 右上角hover */}
                  <div className="icon-container d-flex flex-row">
                    <div className="icon d-flex justify-content-center align-items-center">
                      <i className="bi bi-heart"></i>
                    </div>
                    <div className="icon d-flex justify-content-center align-items-center">
                      <i className="bi bi-cart"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
