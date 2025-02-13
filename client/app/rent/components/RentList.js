"use client";

import Image from "next/image";
import { useEffect } from "react";
import "./RentList.css";
import "../../../public/globals.css";

export default function RentList() {
  useEffect(() => {
    const cardBodies = document.querySelectorAll(".card-body");
    cardBodies.forEach((card) => {
      const productColor = card.querySelector(".product-color");
      const colors = productColor ? productColor.children : [];
      const price = card.querySelector(".product-price");
      const price2 = card.querySelector(".product-price2");

      // 如果產品沒有其他顏色，隱藏顏色欄位
      if (colors.length === 0) {
        if (productColor) productColor.style.display = "none";
      } else {
        // 如果產品超過 3 個顏色，則只顯示前 3 個，其他用 "..."
        if (colors.length > 3) {
          for (let i = 3; i < colors.length; i++) {
            colors[i].style.display = "none";
          }
          const moreColor = document.createElement("span");
          moreColor.innerText = "...";
          moreColor.style.color = "#898989";
          moreColor.style.fontSize = "10px";
          productColor.appendChild(moreColor);
        }
      }

      // 如果產品沒有特價，那就不顯示特價欄位，並且原價不會被 line-through
      if (!price2 || !price2.innerText.trim()) {
        if (price2) price2.style.display = "none"; // 隱藏特價欄位
        if (price) {
          price.style.color = "inherit"; // 恢復原價顏色
          price.style.textDecoration = "none"; // 移除劃線
        }
      } else {
        // 如果產品有特價，改變原價 CSS
        if (price) {
          price.style.color = "var(--gray-600-color)"; // 改變原價顏色
          price.style.textDecoration = "line-through"; // 添加劃線
        }
      }
    });
  }, []);

  return (
    <div>
      {/* 主內容 */}
      <div className="container py-4 mx-auto">
        <div className="row">
          {/* 麵包屑 */}
          <div className="bread">
            <nav aria-label="breadcrumb">
              <ol className="m-0 breadcrumb breadcrumb-list">
                <li className="breadcrumb-item">
                  <a className="a" href="#">
                    首頁
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  租借商品列表
                </li>
              </ol>
            </nav>
          </div>


            <div className="row">
              {/* Sidebar */}
              <div className="col-12 col-lg-3 col-md-4 order-2 order-md-1 d-flex flex-column sidebar">
                {/* 1. 產品分類區塊 */}
                <div className="d-flex flex-column sidebar-lists product-category">
                  <div className="d-flex justify-content-between align-items-center sidebar-lists-title">
                    <h6>產品分類</h6>
                    <i className="bi bi-chevron-down"></i>
                  </div>
                  <div className="product-category-content">
                    <ul className="list-unstyled d-flex justify-content-between align-items-center">
                      面鏡/呼吸管<i className="bi bi-chevron-down"></i>
                    </ul>
                    <ul className="list-unstyled d-flex justify-content-between align-items-center">
                      蛙鞋<i className="bi bi-chevron-down"></i>
                    </ul>
                    <ul className="list-unstyled d-flex justify-content-between align-items-center">
                      潛水配件<i className="bi bi-chevron-down"></i>
                    </ul>
                  </div>
                </div>

                {/* 篩選按鈕 */}
                <button type="button" className="w-100 btn sidebar-selectBtn">
                  <i className="bi bi-funnel-fill"></i> 套用篩選（0/20）
                </button>

                {/* 2. 篩選條件區塊 */}
                <div className="d-flex flex-column sidebar-lists product-filter">
                  <div className="d-flex justify-content-between align-items-center sidebar-lists-title">
                    <h6>篩選條件</h6>
                  </div>

                  {/* 價格區間 */}
                  <div className="product-filter-price">
                    <p className="filter-subtitle">價格區間</p>
                    <div className="price-input d-flex flex-row">
                      <div className="d-flex align-items-center price-box">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          className="min-price"
                          placeholder="從"
                          aria-label="最低價格"
                        />
                      </div>
                      <div className="d-flex align-items-center price-box">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          className="max-price"
                          placeholder="至"
                          aria-label="最高價格"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 品牌類別 */}
                  <div className="product-filter-brand">
                    <p className="filter-subtitle filter-subtitle2">
                      <i className="bi bi-chevron-down"></i>品牌類別
                    </p>
                    <div className="brand-select d-flex flex-row align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="brand1"
                      />
                      <label
                        className="form-check-label brand"
                        htmlFor="brand1"
                      >
                        LEADERFINS (4)
                      </label>
                    </div>
                    <div className="brand-select d-flex flex-row align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="brand2"
                      />
                      <label
                        className="form-check-label brand"
                        htmlFor="brand2"
                      >
                        OMER (15)
                      </label>
                    </div>
                  </div>

                  {/* 顏色類別 */}
                  <div className="product-filter-color">
                    <p className="filter-subtitle filter-subtitle2">
                      <i className="bi bi-chevron-down"></i>顏色類別
                    </p>
                    <div className="d-flex flex-wrap align-items-center color-options">
                      <div className="color-circle bg-danger"></div>
                      <div className="color-circle bg-success"></div>
                      <div className="color-circle bg-primary"></div>
                      <div className="color-circle bg-warning"></div>
                      <div className="color-circle bg-pink"></div>
                      <div className="color-circle bg-info"></div>
                      <div className="color-circle bg-brown"></div>
                      <div className="color-circle bg-secondary"></div>
                      <div className="color-circle bg-danger"></div>
                      <div className="color-circle bg-success"></div>
                      <div className="color-circle bg-primary"></div>
                      <div className="color-circle bg-warning"></div>
                    </div>
                  </div>

                  {/* 防寒衣厚度 */}
                  <div className="product-filter-wetsuit">
                    <p className="filter-subtitle filter-subtitle2">
                      <i className="bi bi-chevron-down"></i>防寒衣厚度
                    </p>
                    <div className="thickness-select d-flex flex-row align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="thickness1"
                      />
                      <label
                        className="form-check-label thickness"
                        htmlFor="thickness1"
                      >
                        1.2mm (4)
                      </label>
                    </div>
                    <div className="thickness-select d-flex flex-row align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="thickness2"
                      />
                      <label
                        className="form-check-label thickness"
                        htmlFor="thickness2"
                      >
                        1.5mm (14)
                      </label>
                    </div>
                    <div className="thickness-select d-flex flex-row align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="thickness3"
                      />
                      <label
                        className="form-check-label thickness"
                        htmlFor="thickness3"
                      >
                        2mm (39)
                      </label>
                    </div>
                  </div>
                </div>

                {/* 3. 新品上市區塊 */}
                <div className="d-flex flex-column sidebar-lists product-new">
                  <div className="d-flex justify-content-between align-items-center sidebar-lists-title">
                    <h6>新品上市</h6>
                  </div>
                  <div className="d-flex flex-column new-product-lists">
                    {/* 新品商品卡片 */}
                    {[1, 2, 3].map((item) => (
                      <div className="card" key={item}>
                        <div className="d-flex flex-row align-items-center new-product">
                          <Image
                            src="/img/rent/fit/1732690021_5668.jpg"
                            className="card-img-left product-img"
                            alt={`新產品 ${item}`}
                            width={90} // 設定圖片的寬度
                            height={90} // 設定圖片的高度
                            priority
                            unoptimized
                          />
                          <div className="card-body d-flex flex-column">
                            <p className="product-brand">TRYGONS</p>
                            <p className="product-name">液態面鏡</p>
                            <h6 className="product-price">NT $740</h6>
                            <div className="d-flex flex-row align-items-center product-color">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. 特惠商品區塊 */}
                <div className="d-flex flex-column sidebar-lists product-sale">
                  <div className="d-flex justify-content-between align-items-center sidebar-lists-title">
                    <h6>特惠商品</h6>
                  </div>
                  <div className="d-flex flex-column sale-product-lists">
                    {/* 特惠商品卡片 */}
                    {[1, 2, 3].map((item) => (
                      <div className="card" key={item}>
                        <div className="d-flex flex-row align-items-center sale-product">
                          <Image
                            src="/img/rent/fit/1732690021_5668.jpg"
                            className="card-img-left product-img"
                            alt={`特惠產品 ${item}`}
                            width={90} // 設定圖片的寬度
                            height={98} // 設定圖片的高度
                            priority
                            unoptimized
                          />
                          <div className="card-body d-flex flex-column">
                            <p className="product-brand">TRYGONS</p>
                            <p className="product-name">液態面鏡</p>
                            <h6 className="product-price">NT $740</h6>
                            <h6 className="product-price2">NT $350</h6>
                            <div className="d-flex flex-row align-items-center product-color">
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-12 col-lg-9 col-md-8 order-1 order-md-2 d-flex flex-column main">
                {/* Main Top */}
                <div className="main-top w-100">
                  <h4 className="fw-bold">隨租隨用體驗，潛享無限自由</h4>
                  <p className="main-describe">
                    歡迎來到我們的租賃專區，這裡提供多款精選潛水裝備供您靈活租用！無論是輕便舒適的潛水服，還是功能強大的潛水電筒，我們的租賃服務專為潛水愛好者設計，滿足從初學者到資深潛水員的各種需求。
                  </p>
                  <p className="main-describe">
                    我們深知潛水裝備的重要性，因此所有租賃用品均經過嚴格檢測與維護，確保品質可靠、安全無虞。讓您無需擔心昂貴的購置成本，就能輕鬆體驗高端裝備，享受深海探險的樂趣！
                  </p>
                  <p className="main-describe">
                    立即選擇您需要的裝備，靈活設定租期，並享受多日租賃優惠活動。準備好迎接海底奇觀了嗎？租得安心，潛得盡興，輕鬆開啟您的深海冒險之旅！
                  </p>
                  <Image
                    src="/img/rentimg.jpg"
                    alt="輕鬆租賃，探索深海無負擔！"
                    className="main-img w-100"
                    width={420} // 設定圖片的寬度
                    height={188} // 設定圖片的高度
                    priority
                    unoptimized
                  />
                </div>

                {/* Main Select */}
                <div className="py-3 d-flex flex-row justify-content-between   align-items-center main-select">
                  <div className="px-3 select-page d-none d-md-block">
                    顯示 第1頁/共10頁 商品
                  </div>
                  <div className="px-3 gap-1 d-flex flex-row justify-content-between align-items-center select-order">
                    <span className="d-none d-md-block">排序</span>
                    <div className="dropdown">
                      <button
                        className="px-3 btn select-order-btn"
                        type="button"
                        id="selectOrderBtn"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span className="selectOrderText pe-2">
                          下拉選取排序條件
                        </span>
                        <i className="bi bi-chevron-down"></i>
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="selectOrderBtn"
                      >
                        <li>
                          <a className="dropdown-item" href="#">
                            上架時間：由新到舊
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            上架時間：由舊到新
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            價格：由高到低
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            價格：由低到高
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            銷量：由高到低
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="show-per-page dropdown">
                    <button
                      className="px-3 btn show-per-page-btn"
                      type="button"
                      id="showPerPageBtn"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="showPerPageText pe-2">每頁顯示16個</span>
                      <i className="bi bi-chevron-down"></i>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="showPerPageBtn"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          每頁顯示16個
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          每頁顯示24個
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          每頁顯示32個
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Product Lists */}
                <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 product-lists">
                  {/* 商品卡片 */}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
                    (item) => (
                      <div className="col" key={item}>
                        <div className="card border-0 h-100">
                          <Image
                            src="/img/rent/fit/1732690021_5668.jpg"
                            className="card-img-top product-img w-100"
                            alt="商品圖片"
                            width={124} // 設定圖片的寬度
                            height={124} // 設定圖片的高度
                            layout="responsive"
                            priority
                            unoptimized
                          />
                          <div className="py-2 px-0 d-flex flex-column justify-content-start align-items-center card-body">
                            <p className="product-brand">AQUA LUNG</p>
                            <p className="product-name">SPHERA X 低容積面鏡</p>
                            <h6 className="product-price">NT $740</h6>
                            <h6 className="product-price2">NT $265</h6>
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
                            <div className="icon-container d-flex flex-column">
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
                    )
                  )}
                </div>

                {/* Main Page */}
                <div className="py-3 d-flex flex-column flex-md-row justify-content-between align-items-center main-page">
                  <div className="px-3 show-page text-center text-md-start">
                    顯示 第1-8件/共166件 商品
                  </div>
                  <nav aria-label="Page navigation">
                    <ul className="px-3 pagination justify-content-end">
                      <li className="page-item">
                        <a className="page-link" href="" aria-label="FirstPage">
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-double-left"></i>
                          </span>
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="" aria-label="Previous">
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-left"></i>
                          </span>
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="" aria-label="Next">
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-right"></i>
                          </span>
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="" aria-label="LastPage">
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-double-right"></i>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
