"use client";

import { useRef, useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic"; // 動態導入，動態加載 flatpickr，從而避免伺服器端渲染時的問題
import { useParams } from "next/navigation"; // 獲取 url 當中的 id，useParams修改為useSearchParams 更改
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./flatpickr.css"; // 我定義的小日曆css
import "./RentDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./modal2.css"; // 我定義的你可能會喜歡modalcss(跟rentlist同支)
import "../../../public/globals.css";
import HeartIcon from "./HeartIcon/HeartIcon";
import { Modal, Button } from "react-bootstrap"; // 使用 react-bootstrap 的 Modal 避免衝突閃動

const Flatpickr = dynamic(() => import("flatpickr"), { ssr: false });

export default function RentProductDetail() {
  const { id } = useParams(); // 取得動態路由參數

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(""); // 商品大張圖片（要做大圖切換
  const [loading, setLoading] = useState(true); // 加載狀態
  const [error, setError] = useState(null); // 錯誤狀態
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 當前顯示的圖片索引
  const [isFavorite, setIsFavorite] = useState(0); // 愛心收藏功能
  const [selectedDates, setSelectedDates] = useState([]); // 讓我知道會員選擇了多少天數（動態計算價格用
  const [recommendedProducts, setRecommendedProducts] = useState([]); // 你可能會喜歡的隨機推薦商品

  const [quantity, setQuantity] = useState(1);
  const quantityInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("description"); // 商品描述區塊切換tab

  // 跳出modal選擇詳細資訊
  const [show, setShow] = useState(false);
  // const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [bookingDate, setBookingDate] = useState("");
  const [rentDateRange, setRentDateRange] = useState([]); // 租借日期

  const flatpickrRef = useRef(null); // 用來保存 flatpickr 實例

  // 從後端獲取商品數據
  useEffect(() => {
    if (!id) return; // 如果 id 不存在，直接返回

    const fetchProduct = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

        const response = await fetch(`${API_BASE_URL}/api/rent/${id}`);
        if (!response.ok) {
          throw new Error("無法獲取商品數據");
        }
        const result = await response.json(); // 解析後端返回的 JSON
        const data = result.data; // 提取 data 物件

        console.log("後端返回的資料:", data); // 檢查資料結構
        setProduct(data);

        // 設置預設大圖
        const images = data.images || [];
        const mainImage =
          (images && images.find((img) => img.is_main === 1)?.img_url) ||
          (images && images[0]?.img_url) ||
          "/image/rent/no-img.png"; // 如果沒有圖片，顯示"本商品暫時沒有圖片"的預設圖片
        setMainImage(mainImage);

        console.log("Product images:", images); // 調試訊息

        // 獲取推薦商品
        const fetchRecommendedProducts = async (brand, categoryId, id) => {
          console.log("呼叫 fetchRecommendedProducts，參數:", {
            brand,
            categoryId,
            id,
          });

          try {
            console.log("收到的 id:", id, "類型:", typeof id);
            const API_BASE_URL =
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

            const parsedId = Number(id);
            if (!Number.isInteger(parsedId) || parsedId <= 0) {
              console.error("無效的商品 ID:", id);
              return;
            }

            // 確保 categoryId 存在且為有效數字
            if (!Number.isInteger(categoryId) || categoryId <= 0) {
              console.error("無效的分類 ID:", categoryId);
              return;
            }
            console.log("data.rent_category_small_id:", categoryId);

            const response = await fetch(
              `${API_BASE_URL}/api/rent/${id}/recommended?brand=${encodeURIComponent(
                brand
              )}&category=${categoryId}`
            );

            if (!response.ok) {
              throw new Error("無法獲取推薦商品");
            }
            const result = await response.json();

            // console.log("📌 API 返回的完整資料:", result);

            setRecommendedProducts(result.data || []);
          } catch (err) {
            console.error("獲取推薦商品失敗:", err);
          }
        };

        // 獲取"你可能喜歡"區塊的推薦商品
        fetchRecommendedProducts(
          data.brand_name,
          data.rent_category_small_id,
          data.id
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 判斷收藏的愛心狀態
  const handleClick = () => {
    const newIsFavorite = isFavorite === 0 ? 1 : 0;
    setIsFavorite(newIsFavorite);

    // 這裡可以加入後端 API 呼叫，更新 is_like 狀態
    // axios.post(`/api/rent-item/${id}/update-favorite`, { isLike: newIsFavorite })
    //   .then(response => {
    //     console.log("後端更新成功:", response.data);
    //   })
    //   .catch(error => {
    //     console.error("後端更新失敗:", error);
    //   });
  };

  // 根據是否有特價動態調整價格樣式
  useEffect(() => {
    const price = document.querySelector(".product-price");
    const price2 = document.querySelector(".product-price2");

    // 如果產品沒有特價，隱藏特價欄位並恢復原價樣式
    if (!product?.price2) {
      if (price2) {
        price2.classList.add("hidden");
        // price2.style.margin = "0";
      } // 隱藏特價欄位
      if (price) {
        price.classList.remove("strikethrough"); // 移除劃線樣式
      }
    } else {
      // 如果產品有特價，改變原價樣式
      if (price) {
        price.classList.add("strikethrough"); // 添加劃線樣式
        price.style.fontSize = "16px";
        price.style.fontWeight = "400";
      }
    }
  }, [product]); // 當 product 更新時執行
  // 根據是否有特價動態調整價格樣式
  useEffect(() => {
    const price = document.querySelector(".product-price");
    const price2 = document.querySelector(".product-price2");

    // 如果產品沒有特價，隱藏特價欄位並恢復原價樣式（你可能會喜歡)
    if (!product?.price2) {
      if (price2) {
        price2.classList.add("hidden");
        // price2.style.margin = "0";
      } // 隱藏特價欄位
      if (price) {
        price.classList.remove("strikethrough"); // 移除劃線樣式
      }
    } else {
      // 如果產品有特價，改變原價樣式
      if (price) {
        price.classList.add("strikethrough"); // 添加劃線樣式
        price.style.fontSize = "16px";
        price.style.fontWeight = "400";
      }
    }
  }, [product]); // 當 product 更新時執行

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      document.querySelector("#fixed-calendar")
    ) {
      // 定義一個函式來計算並更新價格
      const updatePriceDetails = (selectedDates, instance) => {
        const dateRangeText = document.querySelector("#date-range-text");
        const totalCostText = document.querySelector("#total-cost-text");
        const priceDetailsText = document.querySelector("#price-details-text");
        const startDate = selectedDates[0];
        const endDate = selectedDates[1];

        if (startDate && endDate) {
          const formattedStartDate = instance.formatDate(
            startDate,
            "Y年m月d日"
          );
          const formattedEndDate = instance.formatDate(endDate, "Y年m月d日");

          // 計算租賃天數
          const timeDiff = endDate.getTime() - startDate.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1是因為要包含起始日

          // 動態單價（如果有 price2 則使用 price2，否則使用 price）
          const price = product.price; // 原價
          const price2 = product.price2; // 特價
          const unitPrice = Number(price2 ? price2 : price);

          // 動態數量（假設 quantity 是使用者選擇的數量）
          // const quantity =
          //   parseInt(document.querySelector("#quantity").value, 10) || 1;

          const quantity = parseInt(quantityInputRef.current?.value, 10) || 1;

          // 計算押金（單價的 3 折）
          const deposit = Number(unitPrice * 0.3);

          // 計算總費用
          const totalCost = unitPrice * quantity * daysDiff + deposit;

          // 更新日期範圍文字的顯示
          dateRangeText.textContent = `租賃日期： 自 ${formattedStartDate} 至 ${formattedEndDate}`;

          // 更新價格明細
          priceDetailsText.innerHTML = `
            <div>單價：${unitPrice.toLocaleString("zh-TW")} 元</div>
            <div>數量：${quantity} 個</div>
            <div>天數：${daysDiff} 天</div>
            <div>押金：${deposit.toLocaleString("zh-TW")} 元</div>
          `;

          // 更新總費用文字
          totalCostText.textContent = `總費用：${totalCost.toLocaleString()} 元`;

          // 顯示區塊
          dateRangeText.style.display = "block";
          totalCostText.style.display = "block";
          priceDetailsText.style.display = "block";
        } else {
          // 如果沒有選擇完整的日期範圍，隱藏區塊
          dateRangeText.style.display = "none";
          totalCostText.style.display = "none";
          priceDetailsText.style.display = "none";
        }
      };

      // 初始化 Flatpickr
      const calendar = flatpickr("#fixed-calendar", {
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
          // 當日期變化時，更新價格明細
          updatePriceDetails(selectedDates, instance);
        },
      });

      // 監聽數量輸入框的變化
      // const quantityInput = document.querySelector("#quantity");
      // if (quantityInput) {
      //   quantityInput.addEventListener("input", () => {
      //     const selectedDates = calendar.selectedDates;
      //     if (selectedDates.length === 2) {
      //       // 如果有選擇完整的日期範圍，更新價格明細
      //       updatePriceDetails(selectedDates, calendar);
      //     }
      //   });
      // }
      if (quantityInputRef.current) {
        quantityInputRef.current.addEventListener("input", () => {
          const selectedDates = calendar.selectedDates;
          if (selectedDates.length === 2) {
            // 如果有選擇完整的日期範圍，更新價格明細
            updatePriceDetails(selectedDates, calendar);
          }
        });
      }

      if (product?.images?.length) {
        setMainImage(product.images[0]?.img_url || ""); // 當 product 變更時，重新設置大圖
      }
    }
  }, [product]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // 處理小圖上一頁按鈕點擊
  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 3, 0));
  };
  // 處理小圖下一頁按鈕點擊
  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      Math.min(prevIndex + 3, product.images.length - 3)
    );
  };

  // 在 Modal 顯示後初始化 flatpickr
  useEffect(() => {
    if (show) {
      const dateRangeInput = document.getElementById("modalRentDateRange");

      console.log("dateRangeInput:", dateRangeInput); // 確認 input 元素

      if (dateRangeInput && !dateRangeInput._flatpickr) {
        console.log("Initializing flatpickr...");

        flatpickrRef.current = flatpickr(dateRangeInput, {
          mode: "range",
          dateFormat: "Y年m月d日",
          minDate: "today",
          locale: {
            rangeSeparator: " ~ ",
            firstDayOfWeek: 1,
            weekdays: {
              shorthand: [
                "週日",
                "週一",
                "週二",
                "週三",
                "週四",
                "週五",
                "週六",
              ],
              longhand: [
                "週日",
                "週一",
                "週二",
                "週三",
                "週四",
                "週五",
                "週六",
              ],
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
          onClose: (selectedDates) => {
            if (selectedDates.length === 2) {
              setRentDateRange([selectedDates[0], selectedDates[1]]);
            }
          },
          // 確保透明度設定為1，並且是顯示的
          onOpen: () => {
            const calendarElement = document.querySelector(".flatpickr-calendar");
            if (calendarElement) {
              calendarElement.style.opacity = "1";
              calendarElement.style.visibility = "visible";
            }
          }
        });
      }
    } else {
      // 銷毀 flatpickr 實例
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    }
  }, [show]);

  // 打開 Modal
  const handleShow = (product, e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedProduct({
      ...product,
      quantity: 1,
    });

    setQuantity(1);
    setRentDateRange([]);
    setShow(true);
  };

  // 關閉 Modal
  const handleClose = () => {
    setShow(false);
    setSelectedProduct(null);
    setRentDateRange([]);
  };

  if (loading) return <div>商品載入中...</div>;
  if (error) return <div>錯誤：{error}</div>;
  if (!product) return <div>未找到商品</div>;

  // 這個用來做最多三張小圖
  const visibleImages = product.images.slice(
    currentImageIndex,
    currentImageIndex + 3
  );
  // 判斷是否顯示小圖的上一頁和下一頁按鈕
  const showPrevButton = currentImageIndex > 0;
  const showNextButton = currentImageIndex + 3 < product.images.length;

  // 確認租借資訊
  // const handleConfirmRent = () => {
  //   const rentDate = document.getElementById('rentDate').value;
  //   const rentQuantity = document.getElementById('rentQuantity').value;

  //   if (!rentDate || !rentQuantity) {
  //     alert('請填寫完整的租借資訊');
  //     return;
  //   }

  //   // 將商品 ID、租借日期和數量發送到後端
  //   addToCart(selectedProductId, rentDate, rentQuantity);

  //   // 關閉 Modal
  //   closeModal();
  // };

  // 加入購物車的函數
  // const addToCart = async (productId, rentDate, rentQuantity) => {
  //   try {
  //     const response = await fetch('/add-to-cart', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         productId,
  //         rentDate,
  //         rentQuantity,
  //       }),
  //     });

  //     const data = await response.json();
  //     if (data.success) {
  //       alert('商品已成功加入購物車');
  //     } else {
  //       alert('加入購物車失敗');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('發生錯誤，請稍後再試');
  //   }
  // };

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
            <div className="px-3 col-12 col-md-6 col-lg-6 order-1 mx-auto d-flex flex-column gap-5">
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
                {product.images?.length > 0 ? (
                  <>
                    {/* 上一頁按鈕 */}
                    {showPrevButton && (
                      <button className="btn-prev" onClick={handlePrevClick}>
                        <i className="bi bi-caret-left-fill"></i>
                      </button>
                    )}

                    {/* 小圖片顯示 */}
                    {visibleImages.map((img, index) => {
                      const containerWidth = 538; // 小圖總容器
                      const gap = 10;
                      const imageCount = visibleImages.length;
                      {
                        /* const imageWidth =
                        (containerWidth - (imageCount - 1) * gap) / imageCount; */
                      }
                      const imageWidth = (containerWidth - (3 - 1) * gap) / 3;
                      const imageHeight = imageWidth; // 正方形

                      return (
                        <div
                          key={index}
                          onClick={() => setMainImage(img.img_url)}
                          style={{ width: imageWidth, height: imageHeight }}
                        >
                          <Image
                            src={img.img_url}
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
                    {/* 如果不足3張圖片則填充空白元素 */}
                    {Array.from({
                      length: 3 - visibleImages.length, // 最多顯示 3 張小圖
                    }).map((_, index) => {
                      const containerWidth = 538; // 小圖總容器
                      const gap = 10;
                      const imageCount = 3; // 最多顯示 3 張小圖
                      {
                        /* const imageWidth =
                        (containerWidth - (imageCount - 1) * gap) / imageCount; */
                      }
                      const imageWidth = (containerWidth - (3 - 1) * gap) / 3;
                      const imageHeight = imageWidth; // 正方形

                      return (
                        <div
                          key={`empty-${index}`}
                          className="empty-image"
                          style={{ width: imageWidth, height: imageHeight }}
                        ></div>
                      );
                    })}
                    {/* 下一頁按鈕 */}
                    {showNextButton && (
                      <button className="btn-next" onClick={handleNextClick}>
                        <i className="bi bi-caret-right-fill"></i>
                      </button>
                    )}
                  </>
                ) : (
                  <div>無圖片</div>
                )}
              </div>
              <div className="rent-rules d-flex flex-column">
                <p className="rules-title">租借規則</p>
                <ul className="rules-content">
                  <li>租借本人出示潛水證</li>
                  <li>租用需先付款，並提供個人證件一張</li>
                  <li>完成租借表單並完成簽名</li>
                  <li>如有遺失或損害，需修復原有狀況或是全新賠償</li>
                  <li>
                    租借與歸還時間限每日上午8:00至
                    下午5:00，過時則以多借一天計算
                  </li>
                  <li>
                    以天計價，非24小時制度。例如:
                    12/18日下午2點租借，12/19下午2點歸還，則算兩天
                  </li>
                </ul>
              </div>
            </div>

            {/* 文字區域 */}
            <div className="px-3 col-12 col-md-6 col-lg-6 order-2 mx-auto d-flex flex-column details-text">
              <div className="details-titles d-flex flex-column">
                <p className="product-brand">
                  {product?.brand_name ? product.brand_name : "未知品牌"}
                </p>
                <div className="product-name-fav d-flex flex-row justify-content-between align-items-center">
                  <p className="product-name">{product.name}</p>
                  <div className="product-name-fav" onClick={handleClick}>
                    <HeartIcon isFavorite={isFavorite} onClick={handleClick} />
                  </div>
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
                {product.price2 && (
                  <p className="product-price2">NT${product.price2}/日</p>
                )}
                <p className="product-price">NT${product.price}/日</p>
                <p className="product-description">{product.description}</p>
              </div>
              <div className="details-select d-flex flex-column">
                <div className="product-color">
                  <p className="color-title">商品顏色</p>
                  <div className="colors d-flex flex-row">
                    {product.specifications &&
                    product.specifications.some((spec) => spec.color_rgb) ? (
                      <div className="product-colors">
                        {product.specifications.map(
                          (spec, index) =>
                            spec.color_rgb && (
                              <span
                                key={index}
                                className="color-box"
                                style={{ backgroundColor: spec.color_rgb }}
                              ></span>
                            )
                        )}
                      </div>
                    ) : (
                      <p className="no-colors">本商品暫無其他顏色</p>
                    )}
                  </div>
                </div>
                <div className="product-amount">
                  <p className="amount-title">商品數量</p>
                  <div className="amounts d-flex flex-row align-items-center">
                    {/* 減少數量按鈕 */}
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity((prev) => prev - 1);
                        }
                      }}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    {/* 數量輸入框 */}
                    <input
                      type="text"
                      className="form-control text-center mx-2"
                      style={{ width: "50px" }}
                      value={quantity}
                      readOnly
                    />
                    {/* 增加數量按鈕 */}
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => {
                        if (!product.stock || quantity < product.stock) {
                          setQuantity((prev) => prev + 1);
                        }
                      }}
                    >
                      <i className="bi bi-plus"></i>
                    </button>

                    {/* 庫存判斷 */}
                    {product.stock && product.stock > 0 ? (
                      <p className="product-stock">
                        庫存僅剩 {product.stock} 件
                      </p>
                    ) : (
                      <p className="stock-available">庫存餘量充足</p>
                    )}
                  </div>
                </div>
                <div className="booking-date">
                  <p className="booking-title">預訂日期</p>
                  <div className="booking-calendar calendar-detail d-flex flex-column align-items-center">
                    <div id="fixed-calendar" className=""></div>
                    <div className="d-flex flex-column selected-date-range w-100">
                      <p id="date-range-text" style={{ display: "none" }}></p>
                      <div
                        id="price-details-text"
                        style={{ display: "none" }}
                      ></div>
                      <div
                        id="total-cost-text"
                        style={{ display: "none" }}
                      ></div>
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
                <p>{product.description2 || product.description}</p>
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
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 you-may-like-product mb-4"
            >
              <Link
                href={`/rent/${product.id}`}
                passHref
                style={{
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "none",
                }}
                onClick={(e) => {
                  // 阻止 Link 的默認跳轉行為
                  e.preventDefault();
                }}
              >
                <div className="card border-0 h-100">
                  <div className="d-flex justify-content-center align-items-center img-container">
                    <Image
                      src={product.img_url || "/image/rent/no-img.png"}
                      className="product-img"
                      alt={product.name}
                      layout="intrinsic"
                      width={248}
                      height={248}
                      objectFit="contain"
                      priority
                      unoptimized
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-start align-items-center card-body">
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-name text-center">{product.name}</p>

                    <div
                      className={`price-container d-flex gap-3 ${
                        product.price2 ? "has-discount" : ""
                      }`}
                    >
                      <h6 className="product-price">NT$ {product.price} 元</h6>
                      {product.price2 && (
                        <h6 className="product-price2">
                          NT$ {product.price2} 元
                        </h6>
                      )}
                    </div>
                    <div className="d-flex flex-row justify-content-center align-items-center product-color">
                      {product.color_rgb && product.color_rgb !== "無顏色" ? (
                        // 先將顏色陣列分割出來
                        product.color_rgb
                          .split(",")
                          .slice(0, 3)
                          .map((color, index) => (
                            <span
                              key={index}
                              className="color-box"
                              style={{ backgroundColor: color.trim() }}
                            ></span>
                          ))
                      ) : (
                        <span
                          className="color-box"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                        ></span>
                      )}

                      {/* 若顏色數量超過3，顯示 '...' */}
                      {product.color_rgb &&
                        product.color_rgb !== "無顏色" &&
                        product.color_rgb.split(",").length > 3 && (
                          <span
                            className="color-box"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              textAlign: "center",
                              lineHeight: "7.5px",
                            }}
                          >
                            ...
                          </span>
                        )}
                    </div>

                    {/* Modal */}
                    <Modal
                      show={show}
                      onHide={handleClose}
                      keyboard={false}
                      centered
                      backdrop="static"
                      className="fade"
                      aria-labelledby="contained-modal-title-vcenter"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>
                          {selectedProduct?.brand || "未知品牌"} -{" "}
                          {selectedProduct?.name || "租借商品詳情"}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {selectedProduct ? (
                          <div className="row d-flex flex-row justify-content-center align-items-center">
                            {/* 商品圖片 */}
                            <div className="col-md-5">
                              <Image
                                src={
                                  selectedProduct?.img_url ||
                                  "/image/rent/no-img.png"
                                }
                                className="img-fluid"
                                alt={selectedProduct?.name}
                                width={360}
                                height={360}
                                layout="responsive"
                                priority
                                unoptimized
                              />
                            </div>

                            {/* 商品資訊 */}
                            <div className="col-md-7 d-flex flex-column gap-2">
                              {/* 商品價格 */}
                              <div className="subdetails-titles d-flex flex-column">
                                {selectedProduct.price2 ? (
                                  <>
                                    <p className="modal-product-price2">
                                      NT${selectedProduct.price2}/日
                                    </p>
                                    <p
                                      className="modal-product-price"
                                      style={{
                                        color: "var(--gray-600-color)",
                                        fontWeight: "400",
                                        fontSize: "16px",
                                        textDecoration: "line-through",
                                      }}
                                    >
                                      NT${selectedProduct.price}/日
                                    </p>
                                  </>
                                ) : (
                                  <p className="modal-product-price">
                                    NT${selectedProduct.price}/日
                                  </p>
                                )}
                              </div>

                              {/* 商品顏色 */}
                              <div className="product-color">
                                <p className="color-title fw-bold">商品顏色</p>
                                <div className="colors d-flex flex-row">
                                  {selectedProduct.color_rgb ? (
                                    <div className="product-colors d-flex">
                                      {selectedProduct.color_rgb
                                        .split(",")
                                        .map((color, index) => (
                                          <span
                                            key={index}
                                            className="color-box rounded-circle mx-1 border"
                                            style={{
                                              backgroundColor: color.trim(),
                                              width: "20px",
                                              height: "20px",
                                              display: "inline-block",
                                            }}
                                          ></span>
                                        ))}
                                    </div>
                                  ) : (
                                    <p className="no-colors">
                                      本商品暫無其他顏色
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* 商品數量 */}
                              <div className="product-amount">
                                <p className="fw-bold amount-title">商品數量</p>
                                <div className="amounts d-flex align-items-center">
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() =>
                                      setQuantity((prev) =>
                                        prev > 1 ? prev - 1 : prev
                                      )
                                    }
                                  >
                                    <i className="bi bi-dash"></i>
                                  </Button>
                                  <input
                                    type="text"
                                    className="form-control text-center mx-2"
                                    style={{ width: "50px" }}
                                    value={quantity}
                                    readOnly
                                  />
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => {
                                      if (
                                        !selectedProduct.stock ||
                                        quantity < selectedProduct.stock
                                      ) {
                                        setQuantity((prev) => prev + 1);
                                      }
                                    }}
                                  >
                                    <i className="bi bi-plus"></i>
                                  </Button>
                                </div>
                              </div>

                              {/* 庫存資訊 */}
                              {selectedProduct.stock &&
                              selectedProduct.stock > 0 ? (
                                <p className="product-stock">
                                  庫存僅剩 {selectedProduct.stock} 件
                                </p>
                              ) : (
                                <p className="stock-available">庫存餘量充足</p>
                              )}

                              {/* 預訂日期 */}
                              <div className="booking-date calendar-recommended mt-3">
                                <p className="fw-bold">預訂日期</p>
                                <input
                                  type="text"
                                  id="modalRentDateRange"
                                  className="form-control"
                                  placeholder="選擇日期區間"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>租借商品資訊載入中...</p>
                        )}
                      </Modal.Body>
                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleClose}
                          className="cancel-button"
                        >
                          取消租借
                        </Button>
                        <Button variant="primary" className="confirm-button">
                          確認租借
                        </Button>
                      </Modal.Footer>
                    </Modal>

                    {/* hover出現收藏 & 加入購物車 */}
                    <div className="icon-container d-flex flex-row">
                      <div className="icon d-flex justify-content-center align-items-center">
                        <i className="bi bi-heart"></i>
                      </div>
                      <div
                        className="icon d-flex justify-content-center align-items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation(); // 阻止事件冒泡
                          handleShow(product, e); // 觸發 Modal 顯示
                        }}
                      >
                        <i className="bi bi-cart"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
