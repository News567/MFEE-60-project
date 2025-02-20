"use client";

import { useCallback, useEffect, useState, useMemo } from "react"; // useState 儲存從後端獲取的資料，並使用 useEffect 在組件加載時發送請求
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
import "./RentList.css";
import "../../../public/globals.css";
import { debounce } from "lodash"; // 新增 debounce 解決刷新有參數的介面資料閃動問題

export default function RentList() {
  const [products, setProducts] = useState([]); // 儲存後端獲取的商品資料
  const [loading, setLoading] = useState(true); // 加載狀態
  const [currentPage, setCurrentPage] = useState(1); // 當前頁數
  const [totalPages, setTotalPages] = useState(1); // 總頁數
  const [totalProducts, setTotalProducts] = useState(0); // 總商品數
  const [sort, setSort] = useState(""); // 當前排序方式
  const [selectedSort, setSelectedSort] = useState("下拉選取排序條件"); // 當前選擇的排序條件
  const [showClearSort, setShowClearSort] = useState(false); // 是否顯示清除排序的「×」符號
  const [itemsPerPage, setItemsPerPage] = useState(16); // 預設每頁顯示16個

  // sidebar 相關
  const [categories, setCategories] = useState([]); // 大分類
  const [smallCategories, setSmallCategories] = useState([]); // 小分類
  const [selectedCategory, setSelectedCategory] = useState(null); // 當前選擇的大分類
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // 控制大分類下拉顯示
  const [showSmallCategoryDropdown, setShowSmallCategoryDropdown] =
    useState(false); // 控制小分類下拉顯示

  const router = useRouter(); // 動態更新網址參數（根據每頁顯示資料數、分頁、排序條件）
  const searchParams = useSearchParams();

  // 從 URL 初始化狀態
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 16;
    const sort = searchParams.get("sort") || "";

    setCurrentPage(page);
    setItemsPerPage(limit);
    setSort(sort);

    // 根據 URL 參數設置排序條件顯示文字
    switch (sort) {
      case "price_desc":
        setSelectedSort("價格：由高到低");
        break;
      case "price_asc":
        setSelectedSort("價格：由低到高");
        break;
      case "newest":
        setSelectedSort("上架時間：由新到舊");
        break;
      case "oldest":
        setSelectedSort("上架時間：由舊到新");
        break;
      default:
        setSelectedSort("下拉選取排序條件");
    }
  }, [searchParams]);

  // 從後端獲取商品資料
  // 從後端獲取大分類和小分類
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/rent/categories"
        );
        const data = await response.json();
        setCategories(data.categories); // 設置大分類和小分類
      } catch (error) {
        console.error("分類資料獲取失敗:", error);
      }
    };

    fetchCategories();
  }, []);

  // 從後端獲取商品資料
  const fetchProducts = useCallback(
    async (
      page = 1,
      sort = "",
      limit = itemsPerPage,
      categoryBig = null,
      categorySmall = null
    ) => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
        const url = new URL(`${API_BASE_URL}/api/rent`);
        url.searchParams.set("page", page);
        url.searchParams.set("limit", limit);
        if (sort) url.searchParams.set("sort", sort);
        if (categoryBig) url.searchParams.set("category_big_id", categoryBig);
        if (categorySmall)
          url.searchParams.set("category_small_id", categorySmall);

        const response = await fetch(url);
        const result = await response.json();
        if (result && result.data) {
          setProducts(result.data);
          setCurrentPage(result.page);
          setTotalPages(result.totalPages);
          setTotalProducts(result.total);
        } else {
          console.error("API 返回的資料格式不正確:", result);
        }
      } catch (error) {
        console.error("租借商品資料獲取失敗:", error);
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage]
  );

  // 使用 debounce 減少頻繁請求，解決頁面刷新閃動問題
  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 300),
    [fetchProducts]
  );

  // 從 localStorage 讀取快取資料
  useEffect(() => {
    const cachedData = localStorage.getItem(
      `products_${currentPage}_${itemsPerPage}_${sort}`
    );
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (parsedData.data && parsedData.totalPages && parsedData.total) {
          setProducts(parsedData.data);
          setTotalPages(parsedData.totalPages);
          setTotalProducts(parsedData.total);
          setLoading(false);
        }
      } catch (error) {
        console.error("解析 localStorage 資料失敗:", error);
      }
    } else {
      setLoading(true);
      debouncedFetchProducts(
        currentPage,
        sort,
        itemsPerPage,
        selectedCategory,
        smallCategories
      );
    }
  }, [
    currentPage,
    itemsPerPage,
    sort,
    debouncedFetchProducts,
    selectedCategory,
    smallCategories,
  ]);

  // 初始加載
  useEffect(() => {
    debouncedFetchProducts(
      currentPage,
      sort,
      itemsPerPage,
      selectedCategory,
      smallCategories
    );
  }, [
    currentPage,
    sort,
    itemsPerPage,
    selectedCategory,
    smallCategories,
    debouncedFetchProducts,
  ]);

  // 顯示大分類下拉菜單
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    setShowSmallCategoryDropdown(false); // 關閉小分類下拉
  };

  // 顯示小分類下拉菜單
  const toggleSmallCategoryDropdown = () => {
    setShowSmallCategoryDropdown(!showSmallCategoryDropdown);
  };

  // 更新選擇的大分類
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.category_big_id);
    setSmallCategories(category.category_small); // 設置對應的小分類
    setShowCategoryDropdown(false); // 關閉大分類下拉
    setShowSmallCategoryDropdown(true); // 打開小分類下拉
    setCurrentPage(1); // 重置分頁
    debouncedFetchProducts(
      1,
      sort,
      itemsPerPage,
      category.category_big_id,
      null
    );
  };

  // 更新選擇的小分類
  const handleSmallCategorySelect = (smallCategory) => {
    setSmallCategories([smallCategory.id]);
    setCurrentPage(1);
    debouncedFetchProducts(
      1,
      sort,
      itemsPerPage,
      selectedCategory,
      smallCategory.id
    );
  };

  // 更新 URL 查詢參數
  const updateUrlParams = useCallback(
    (page, limit, sort, category, smallCategory) => {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);
      if (sort) params.set("sort", sort);
      if (category) params.set("category", category);
      if (smallCategory) params.set("smallCategory", smallCategory);
      router.push(`/rent?${params.toString()}`, undefined, { shallow: true });
    },
    [router]
  );

  // 每頁顯示資料數量
  const handleItemsPerPageChange = useCallback(
    (limit) => {
      setItemsPerPage(limit);
      setCurrentPage(1);
      updateUrlParams(1, limit, sort);
    },
    [sort, updateUrlParams]
  );

  // 處理商品卡片點擊事件
  const handleProductClick = useCallback(
    (productId) => {
      router.push(`/rent/${productId}`);
    },
    [router]
  );

  // 處理排序
  const handleSort = useCallback(
    (sortType) => {
      let sortText = "下拉選取排序條件";
      switch (sortType) {
        case "price_desc":
          sortText = "價格：由高到低";
          break;
        case "price_asc":
          sortText = "價格：由低到高";
          break;
        case "newest":
          sortText = "上架時間：由新到舊";
          break;
        case "oldest":
          sortText = "上架時間：由舊到新";
          break;
        default:
          sortText = "下拉選取排序條件";
      }
      setSelectedSort(sortText);
      setSort(sortType);
      setCurrentPage(1);
      setShowClearSort(true);
      updateUrlParams(1, itemsPerPage, sortType);
    },
    [itemsPerPage, updateUrlParams]
  );

  // 清除排序條件
  const handleClearSort = useCallback(() => {
    setSelectedSort("下拉選取排序條件");
    setSort("");
    setCurrentPage(1);
    setShowClearSort(false);
    updateUrlParams(1, itemsPerPage, "");
  }, [itemsPerPage, updateUrlParams]);

  // 處理分頁 // 分頁參數的返回還是會閃動
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      updateUrlParams(page, itemsPerPage, sort);
    },
    [itemsPerPage, sort, updateUrlParams]
  );

  // 處理租借商品顏色 & 處理是否原價特價
  useEffect(() => {
    const cardBodies = document.querySelectorAll(".card-body");
    cardBodies.forEach((card) => {
      const productColor = card.querySelector(".product-color");
      const colors = productColor ? productColor.children : [];
      const price = card.querySelector(".product-price");
      const price2 = card.querySelector(".product-price2");

      // 如果產品沒有不同顏色選擇，隱藏顏色欄位
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

      // 如果產品沒有特價，那就不顯示特價欄位，並且原價不會被劃掉
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
          price.style.textDecoration = "line-through"; // 添加文字劃線，把原價劃掉
        }
      }
    });
  }, [products]); // 當 products 更新時執行

  // 租借商品列表（動態渲染）
  return (
    <div>
      {/* 主內容 */}
      <div className="container py-4 mx-auto">
        <div className="row">
          {/* 麵包屑 ：外掛公版*/}
          <div className="row">
            {/* Sidebar */}
            <div className="col-12 col-lg-3 col-md-4 order-2 order-md-1 d-flex flex-column sidebar">
              {/* 1. 產品分類區塊 */}
              <div className="d-flex flex-column sidebar-lists product-category">
                <div
                  className="d-flex justify-content-between align-items-center sidebar-lists-title"
                  onClick={toggleCategoryDropdown}
                  style={{ cursor: "pointer" }}
                >
                  <h6>產品分類</h6>
                  <i className="bi bi-chevron-down"></i>
                </div>

                {showCategoryDropdown && (
                <div className="sidebar-dropdown">
                  {categories.map((category) => (
                    <div
                      key={category.category_big_id}
                      className="sidebar-dropdown-item"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.category_big_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
              {/* 2. 小分類下拉選單 */}
              {selectedCategory && showSmallCategoryDropdown && (
              <div className="d-flex flex-column sidebar-lists product-category">
                <div
                  className="d-flex justify-content-between align-items-center sidebar-lists-title"
                  onClick={toggleSmallCategoryDropdown}
                  style={{ cursor: "pointer" }}
                >
                  <h6>小分類</h6>
                  <i className="bi bi-chevron-down"></i>
                </div>
                {showSmallCategoryDropdown && (
                  <div className="sidebar-dropdown">
                    {categories
                      .find((cat) => cat.category_big_id === selectedCategory)
                      ?.category_small.map((small) => (
                        <div
                          key={small.id}
                          className="sidebar-dropdown-item"
                          onClick={() => handleSmallCategorySelect(small)}
                        >
                          {small.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

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
                    <label className="form-check-label brand" htmlFor="brand1">
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
                    <label className="form-check-label brand" htmlFor="brand2">
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
                {/* <div className="px-3 select-page d-none d-md-block">
                  顯示 第1頁/共10頁 商品
                </div> */}
                <div className="d-flex flex-row justify-content-between align-items-center select-order">
                  {/* <span className="d-none d-md-block">排序</span> */}
                  <div className="dropdown">
                    <button
                      className="px-3 btn select-order-btn"
                      type="button"
                      id="selectOrderBtn"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="selectOrderText pe-2">
                        <i className="bi bi-sort-down pe-2"></i>
                        {selectedSort} {/* 顯示當前選擇的排序條件 */}
                        <i className="bi bi-caret-down-fill ps-2"></i>
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu w-100"
                      aria-labelledby="selectOrderBtn"
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // 阻止預設行為
                            handleSort("newest"); // 上架時間：由新到舊
                          }}
                        >
                          上架時間：由新到舊
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // 阻止預設行為
                            handleSort("oldest"); // 上架時間：由舊到新
                          }}
                        >
                          上架時間：由舊到新
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // 阻止預設行為
                            handleSort("price_desc"); // 價格：由高到低
                          }}
                        >
                          價格：由高到低
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault(); // 阻止預設行為
                            handleSort("price_asc"); // 價格：由低到高
                          }}
                        >
                          價格：由低到高
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleSort("sales_desc")}
                        >
                          銷量：由高到低
                        </a>
                      </li>
                    </ul>
                  </div>
                  {showClearSort && ( // 如果顯示「×」符號
                    <span
                      className="ms-2 clear-sort-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleClearSort(); // 清除排序條件
                      }}
                      style={{ cursor: "pointer" }} // 設置滑鼠指針樣式
                    >
                      <i className="bi bi-x"></i>
                    </span>
                  )}
                </div>
                <div className="show-per-page dropdown">
                  <button
                    className="px-3 btn show-per-page-btn"
                    type="button"
                    id="showPerPageBtn"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="showPerPageText pe-2">
                      <i className="bi bi-view-list pe-2"></i>
                      每頁顯示{itemsPerPage}個
                      <i className="bi bi-caret-down-fill ps-2"></i>
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu w-100"
                    aria-labelledby="showPerPageBtn"
                  >
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemsPerPageChange(16);
                        }}
                      >
                        每頁顯示16個
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemsPerPageChange(24);
                        }}
                      >
                        每頁顯示24個
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleItemsPerPageChange(32);
                        }}
                      >
                        每頁顯示32個
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Product Lists */}
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 product-lists">
                {/* 商品卡片cards */}
                {loading ? (
                  <p className="">租借商品加載中...</p> // 後續有空弄哩哩摳摳
                ) : (
                  Array.isArray(products) &&
                  products.map((product) => (
                    <div
                      className="col"
                      key={product.id}
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* <Link href={`/rent/${product.id}`} passHref> */}
                      <div className="card h-100 ">
                        <div className="d-flex justify-content-center align-items-center img-container">
                          <Image
                            src={product.img_url || "/img/rent/no-img.png"}
                            className="card-img-top product-img"
                            alt={product.name}
                            layout="intrinsic"
                            width={124}
                            height={124}
                            objectFit="contain"
                            priority
                            unoptimized
                          />
                        </div>
                        <div className="py-2 px-0 d-flex flex-column justify-content-start align-items-center card-body">
                          <p className="product-brand">
                            {product.brand_name || "其他品牌"}
                          </p>
                          <p className="product-name">{product.name}</p>
                          <div
                            className={`price-container d-flex gap-3 ${
                              product.price2 ? "has-discount" : ""
                            }`}
                          >
                            <h6 className="product-price">
                              NT$ {product.price} 元
                            </h6>
                            {product.price2 && (
                              <h6 className="product-price2">
                                NT$ {product.price2} 元
                              </h6>
                            )}
                          </div>
                          <div className="d-flex flex-row justify-content-center align-items-center product-color">
                            {product.color_rgb ? (
                              product.color_rgb
                                .split(",")
                                .map((color, index) => (
                                  <span
                                    key={index}
                                    className="color-box"
                                    style={{ backgroundColor: color }}
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
                          </div>
                          {/* 右上角hover */}
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
                      {/* </Link> */}
                    </div>
                  ))
                )}
              </div>

              {/* Main Page */}
              <div className="py-3 d-flex flex-column flex-md-row justify-content-between align-items-center main-page">
                <div className="px-3 show-page text-center text-md-start">
                  顯示 第 {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, totalProducts)} 件 / 共{" "}
                  {totalProducts} 件 商品
                </div>
                <nav aria-label="Page navigation">
                  <ul className="px-3 pagination justify-content-end">
                    {/* 第一頁按鈕 */}
                    {currentPage > 1 && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(1)}
                          aria-label="FirstPage"
                        >
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-double-left"></i>
                          </span>
                        </button>
                      </li>
                    )}

                    {/* 上一頁按鈕 */}
                    {currentPage > 1 && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage - 1)}
                          aria-label="Previous"
                        >
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-left"></i>
                          </span>
                        </button>
                      </li>
                    )}

                    {/* 分頁按鈕 */}
                    {(() => {
                      const pageNumbers = [];
                      if (totalPages <= 4) {
                        // 如果總頁數小於等於 4，顯示所有頁碼
                        for (let i = 1; i <= totalPages; i++) {
                          pageNumbers.push(i);
                        }
                      } else {
                        // 動態顯示頁碼
                        if (currentPage === 1 || currentPage === 2) {
                          // 當前頁在第 1 頁或第 2 頁時
                          for (let i = 1; i <= 3; i++) {
                            pageNumbers.push(i);
                          }
                          pageNumbers.push("...");
                          pageNumbers.push(totalPages);
                        } else if (currentPage === 3) {
                          // 當前頁在第 3 頁時
                          for (let i = 1; i <= 4; i++) {
                            pageNumbers.push(i);
                          }
                          pageNumbers.push("...");
                          pageNumbers.push(totalPages);
                        } else if (currentPage >= totalPages - 2) {
                          // 當前頁在最後 3 頁時
                          pageNumbers.push(1);
                          pageNumbers.push("...");
                          for (let i = totalPages - 2; i <= totalPages; i++) {
                            pageNumbers.push(i);
                          }
                        } else {
                          // 當前頁在中間時
                          pageNumbers.push(1);
                          pageNumbers.push("...");
                          for (
                            let i = currentPage - 1;
                            i <= currentPage + 1;
                            i++
                          ) {
                            pageNumbers.push(i);
                          }
                          pageNumbers.push("...");
                          pageNumbers.push(totalPages);
                        }
                      }

                      return pageNumbers.map((page, index) => (
                        <li
                          key={index}
                          className={`page-item ${
                            page === currentPage ? "active" : ""
                          } ${page === "..." ? "disabled" : ""}`}
                        >
                          {page === "..." ? (
                            <span className="page-link ellipsis">...</span>
                          ) : (
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          )}
                        </li>
                      ));
                    })()}

                    {/* 下一頁按鈕 */}
                    {currentPage < totalPages && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(currentPage + 1)}
                          aria-label="Next"
                        >
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-right"></i>
                          </span>
                        </button>
                      </li>
                    )}

                    {/* 最後一頁按鈕 */}
                    {currentPage < totalPages && (
                      <li className="page-item">
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(totalPages)}
                          aria-label="LastPage"
                        >
                          <span aria-hidden="true">
                            <i className="bi bi-chevron-double-right"></i>
                          </span>
                        </button>
                      </li>
                    )}
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
