"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import styles from "./products.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { Slider, InputNumber, Space, Tag } from "antd";
import SidebarProductList from "./SidebarProductList";

// API 基礎 URL
const API_BASE_URL = "http://localhost:3005/api";

// 在文件頂部添加預設圖片
const DEFAULT_PRODUCT_IMAGE = "/images/default-product.jpg"; // 確保這個路徑指向一個實際存在的預設圖片

// // 將 API 相關常數提取出來 (暫時)
const SORT_OPTIONS = {
  COMPREHENSIVE: { value: 1, text: "綜合" },
  NEWEST: { value: 2, text: "最新上架" },
  PRICE_ASC: { value: 3, text: "價格：由低到高" },
  PRICE_DESC: { value: 4, text: "價格：由高到低" },
};

export default function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ text: "排序", value: 1 });
  const [showClassification, setShowClassification] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState("每頁顯示24件");
  const [showBrandClassification, setShowBrandClassification] = useState(false);

  // 撈取資料
  const [products, setProducts] = useState([]);
  // 分頁
  //parseInt 把字串轉成數字    || 負責設定預設值
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 24);
  const [totalPages, setTotalPages] = useState(1);
  // 可以放動畫 先不動
  const [error, setError] = useState(null);

  // 修改初始化 currentQuery，從 URL 參數中恢復狀態
  const [currentQuery, setCurrentQuery] = useState(() => {
    const categoryId = searchParams.get("category_id");
    const bigCategoryId = searchParams.get("big_category_id");
    const brandName = searchParams.get("brand_name");

    if (categoryId) {
      return { type: "category", id: categoryId, name: null };
    } else if (bigCategoryId) {
      return { type: "bigCategory", id: bigCategoryId, name: null };
    } else if (brandName) {
      return { type: "brand", id: null, name: brandName };
    }
    return { type: null, id: null, name: null };
  });

  // 處理 URL 更新
  const updateURL = (newPage, newLimit, query = currentQuery) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    params.set("limit", newLimit.toString());

    // 根據查詢類型設定相應參數
    if (query.type === "category") {
      params.set("category_id", query.id);
    } else if (query.type === "bigCategory") {
      params.set("big_category_id", query.id);
    } else if (query.type === "brand") {
      params.set("brand_id", query.id);
    }

    // 添加顏色篩選參數
    if (tempFilters.colors.length > 0) {
      params.set("color_id", tempFilters.colors.join(","));
    }

    router.push(`/products?${params.toString()}`);
  };

  // 修改顏色相關的狀態
  const [colors, setColors] = useState([]); // 所有顏色
  const [availableColors, setAvailableColors] = useState([]); // 當前可用的顏色
  const [tempFilters, setTempFilters] = useState({
    colors: [], // 儲存選中的顏色 ID
    price: {
      min: "",
      max: "",
    },
  });

  // 從產品資料中提取顏色資訊
  useEffect(() => {
    if (products.length > 0) {
      const colorSet = new Set();
      const colorMap = new Map();

      products.forEach((product) => {
        if (product.color && Array.isArray(product.color)) {
          product.color.forEach((color) => {
            if (color && color.color_id) {
              colorSet.add(color.color_id);
              colorMap.set(color.color_id, {
                id: color.color_id,
                name: color.color_name,
                color_code: color.color_code,
              });
            }
          });
        }
      });

      const extractedColors = Array.from(colorMap.values());
      setAvailableColors(Array.from(colorSet));
      setColors(extractedColors);
    }
  }, [products]);

  // 從 URL 初始化篩選條件
  useEffect(() => {
    const colorParam = searchParams.get("color_id");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");

    setTempFilters((prev) => ({
      ...prev,
      colors: colorParam ? colorParam.split(",").map(Number) : [],
      price: {
        min: minPrice || "",
        max: maxPrice || "",
      },
    }));
  }, [searchParams]);

  // 在 ProductList 組件中添加價格範圍的狀態
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 40000,
  });

  // 修改價格篩選的處理函數
  const handlePriceChange = (type, value) => {
    setTempFilters((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [type]: value,
      },
    }));
  };

  // range變化
  const handleSliderChange = (values) => {
    setTempFilters((prev) => ({
      ...prev,
      price: {
        min: values[0].toString(),
        max: values[1].toString(),
      },
    }));
  };

  // 品牌分類區間
  const categoryGroups = {
    A: ["A"],
    "B・C・D": ["B", "C", "D"],
    "E・F・G・H・I": ["E", "F", "G", "H", "I"],
    "L・M・N": ["L", "M", "N"],
    "O・P・R": ["O", "P", "R"],
    S: ["S"],
    "T・V・W": ["T", "V", "W"],
    "0-9": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    其他: [],
  };

  // 品牌分類 State
  const [brandCategories, setBrandCategories] = useState([]);
  const [groupedBrands, setGroupedBrands] = useState({});
  const [hoveredBrandCategory, setHoveredBrandCategory] = useState(null);
  // input brands
  const [brands, setBrands] = useState([]);
  // 取得品牌分類
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/brands/`)
      .then((res) => res.data)
      .then((result) => {
        const grouped = groupBrandsByCategory(result);
        setGroupedBrands(grouped);
        setBrandCategories(Object.keys(grouped)); // 確保分類名稱正確
        setBrands(result);
      })
      .catch((err) => console.error(err));
  }, []);
  console.log("🚀 DEBUG: brands =", brands);

  function groupBrandsByCategory(brands) {
    const grouped = {};

    // 初始化分類結構，確保所有分類都有 key，避免 undefined
    Object.keys(categoryGroups).forEach((key) => {
      grouped[key] = [];
    });
    // A: [],
    // B・C・D: [],

    // 處理撈進來的資料
    brands.forEach(({ id, name }) => {
      if (!name) return;

      const initial = name.charAt(0).toUpperCase(); // 表示獲取 name 字符串的第一個字符 然後轉大寫
      let categoryKey = "其他"; // 預設為 "其他"

      // 找出 initial 所屬的分類區間
      // entire 物件轉陣列
      Object.entries(categoryGroups).forEach(([group, letters]) => {
        if (letters.includes(initial)) {
          categoryKey = group;
        }
      });

      // 確保 key 存在，避免 undefined 錯誤
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }

      grouped[categoryKey].push({ id, name });
    });

    return grouped;
  }

  //分類
  const [bigCategories, setBigCategories] = useState([]);
  const [smallCategories, setSmallCategories] = useState({});
  const [hoveredBigCategory, setHoveredBigCategory] = useState(null);
  // 一次性請求所有分類資料
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/categories`)
      .then((res) => res.data)
      .then((result) => {
        setBigCategories(result.bigCategories);
        setSmallCategories(result.smallCategories);
      })
      .catch((err) => console.error(err));
  }, []);

  // 修改計算已選擇的篩選條件數量
  const getSelectedFiltersCount = () => {
    let count = 0;
    // 計算選中的顏色數量
    count += tempFilters.colors.length;
    // 計算價格篩選
    if (tempFilters.price.min || tempFilters.price.max) count += 1;
    return count;
  };

  // 修改顏色點擊處理函數 - 只更新暫存狀態，不觸發篩選
  const handleColorClick = (colorId) => {
    setTempFilters((prev) => {
      const newColors = prev.colors.includes(colorId)
        ? prev.colors.filter((id) => id !== colorId) // 如果已選中則移除
        : [...prev.colors, colorId]; // 如果未選中則添加
      return {
        ...prev,
        colors: newColors,
      };
    });
  };

  // 添加一個狀態來控制是否顯示篩選標籤
  const [showFilters, setShowFilters] = useState(false);

  // 修改 applyFilters 函數
  const applyFilters = async () => {
    setShowFilters(true);

    // 構建查詢參數
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());
    params.set("sort", selectedSort.value.toString());

    // 添加顏色篩選
    if (tempFilters.colors.length > 0) {
      params.set("color_id", tempFilters.colors.join(","));
    }

    // 添加價格篩選
    if (tempFilters.price.min) {
      params.set("min_price", tempFilters.price.min);
    }
    if (tempFilters.price.max) {
      params.set("max_price", tempFilters.price.max);
    }

    // 保留分類/品牌相關參數
    if (currentQuery.type === "category") {
      params.set("category_id", currentQuery.id);
    } else if (currentQuery.type === "bigCategory") {
      params.set("big_category_id", currentQuery.id);
    } else if (currentQuery.type === "brand") {
      params.set("brand_id", currentQuery.id);
    }

    router.replace(`/products?${params.toString()}`);
    await fetchProducts({
      page: 1,
      colors: tempFilters.colors,
      min_price: tempFilters.price.min,
      max_price: tempFilters.price.max,
    });
  };

  // 獲取產品資料
  // FIXME - 有依賴問題
  useEffect(() => {
    // 從 URL 獲取所有篩選參數
    const categoryId = searchParams.get("category_id");
    const bigCategoryId = searchParams.get("big_category_id");
    const brandName = searchParams.get("brand_name");
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const limitParam = parseInt(searchParams.get("limit")) || 24;
    const colorIds = searchParams.get("color_id")?.split(",").map(Number) || [];
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const sortParam = parseInt(searchParams.get("sort")) || 1;

    // 更新查詢狀態
    if (categoryId) {
      setCurrentQuery({ type: "category", id: categoryId, name: null });
    } else if (bigCategoryId) {
      setCurrentQuery({ type: "bigCategory", id: bigCategoryId, name: null });
    } else if (brandName) {
      setCurrentQuery({ type: "brand", id: null, name: brandName });
    }

    // 更新篩選狀態
    setTempFilters((prev) => ({
      ...prev,
      colors: colorIds,
      price: {
        min: minPrice || "",
        max: maxPrice || "",
      },
    }));

    // 如果有任何篩選條件，顯示篩選標籤
    if (colorIds.length > 0 || minPrice || maxPrice) {
      setShowFilters(true);
    }

    // 獲取數據
    fetchProducts({
      page: pageParam,
      limit: limitParam,
      colors: colorIds,
      min_price: minPrice,
      max_price: maxPrice,
      sort: sortParam,
    });
  }, [searchParams]); // 只依賴 searchParams

  // 修改統一的數據獲取函數
  const fetchProducts = async (params = {}) => {
    try {
      let url = `${API_BASE_URL}/products`;

      // 構建查詢參數
      const queryParams = {
        page: params.page || page,
        limit: params.limit || limit,
        sort: params.sort || selectedSort.value,
      };

      // 添加顏色篩選
      if (params.colors?.length > 0) {
        queryParams.color_id = params.colors.join(",");
      }

      // 添加價格篩選
      if (params.min_price) {
        queryParams.min_price = params.min_price;
      }
      if (params.max_price) {
        queryParams.max_price = params.max_price;
      }

      // 根據當前查詢類型選擇正確的 API 端點
      if (currentQuery.type === "category") {
        url = `${API_BASE_URL}/products/category/${currentQuery.id}`;
      } else if (currentQuery.type === "bigCategory") {
        url = `${API_BASE_URL}/products/category/big/${currentQuery.id}`;
      } else if (currentQuery.type === "brand") {
        url = `${API_BASE_URL}/products/brand/${currentQuery.id}`;
      }

      const response = await axios.get(url, { params: queryParams });

      if (response.data.status === "success") {
        setProducts(response.data.data);
        console.log(" DEBUG", response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        if (params.page) setPage(params.page);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("獲取產品數據時發生錯誤");
    }
  };

  // 修改分類展開狀態的管理方式
  const [expandedSection, setExpandedSection] = useState(null); // 'classification', 'brand', 或 null

  // 處理分類展開/收起
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // 修改每頁顯示按鈕的處理函數
  const handleDisplayChange = async (newLimit, displayText) => {
    setSelectedDisplay(displayText);
    setShowDisplayDropdown(false); // 自動收起下拉選單

    const params = new URLSearchParams(window.location.search);
    params.set("limit", newLimit.toString());
    params.set("page", "1");

    router.replace(`/products?${params.toString()}`);
  };

  // 修改排序按鈕的處理函數
  const handleSort = async (text, value) => {
    setSelectedSort({ text, value });
    setShowDropdown(false); // 自動收起下拉選單

    const params = new URLSearchParams(window.location.search);
    params.set("sort", value.toString());

    router.replace(`/products?${params.toString()}`);
  };

  // 添加标题状态
  const [pageTitle, setPageTitle] = useState({
    title: "潛水必備裝備",
    subtitle: "一站式選購體驗",
  });

  // 修改分類篩選處理函數
  const handleCategoryFilter = async (
    categoryId,
    isBigCategory = false,
    categoryName = ""
  ) => {
    const newQuery = {
      type: isBigCategory ? "bigCategory" : "category",
      id: categoryId,
      name: null,
    };
    setCurrentQuery(newQuery);

    // 更新標題
    setPageTitle({
      title: categoryName,
      subtitle: "精選潛水裝備推薦",
    });

    updateURL(1, limit, newQuery);
  };

  // 修改品牌篩選處理函數
  const handleBrandFilter = async (brandId, brandName) => {
    const newQuery = {
      type: "brand",
      id: brandId,
      name: brandName,
    };
    setCurrentQuery(newQuery);

    // 更新標題
    setPageTitle({
      title: brandName,
      subtitle: "品牌精選系列",
    });

    updateURL(1, limit, newQuery);
  };

  // 添加重置標題的函數
  const resetPageTitle = () => {
    setPageTitle({
      title: "潛水必備裝備",
      subtitle: "一站式選購體驗",
    });
  };

  // 在 useEffect 中處理標題重置
  useEffect(() => {
    const categoryId = searchParams.get("category_id");
    const bigCategoryId = searchParams.get("big_category_id");
    const brandName = searchParams.get("brand_name");

    if (!categoryId && !bigCategoryId && !brandName) {
      resetPageTitle();
    }
  }, [searchParams]);

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown")) {
        setShowDropdown(false);
        setShowDisplayDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 修改清除所有篩選函數
  const clearAllFilters = async () => {
    // 重置所有篩選條件
    setTempFilters({
      colors: [],
      price: { min: "", max: "" },
    });
    setShowFilters(false);

    // 構建基礎 URL 參數，只保留必要的參數
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());

    // 保留分類/品牌相關參數
    if (currentQuery.type === "category") {
      params.set("category_id", currentQuery.id);
    } else if (currentQuery.type === "bigCategory") {
      params.set("big_category_id", currentQuery.id);
    } else if (currentQuery.type === "brand") {
      params.set("brand_id", currentQuery.id);
    }

    // 更新 URL 並重新獲取數據
    router.replace(`/products?${params.toString()}`);
    await fetchProducts({ page: 1 });
  };

  // 修改單個顏色移除函數
  const removeColorFilter = async (colorId) => {
    const newColors = tempFilters.colors.filter((id) => id !== colorId);

    setTempFilters((prev) => ({
      ...prev,
      colors: newColors,
    }));

    if (
      newColors.length === 0 &&
      !tempFilters.price.min &&
      !tempFilters.price.max
    ) {
      setShowFilters(false);
    }

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");

    if (newColors.length > 0) {
      params.set("color_id", newColors.join(","));
    } else {
      params.delete("color_id");
    }

    // 保留其他篩選參數
    if (tempFilters.price.min) params.set("min_price", tempFilters.price.min);
    if (tempFilters.price.max) params.set("max_price", tempFilters.price.max);
    if (currentQuery.type === "category")
      params.set("category_id", currentQuery.id);
    if (currentQuery.type === "bigCategory")
      params.set("big_category_id", currentQuery.id);
    if (currentQuery.type === "brand") params.set("brand_id", currentQuery.id);

    router.replace(`/products?${params.toString()}`);
    await fetchProducts({
      page: 1,
      colors: newColors,
      min_price: tempFilters.price.min,
      max_price: tempFilters.price.max,
    });
  };

  // 修改價格篩選清除函數
  const clearPriceFilter = async () => {
    setTempFilters((prev) => ({
      ...prev,
      price: { min: "", max: "" },
    }));

    if (tempFilters.colors.length === 0) {
      setShowFilters(false);
    }

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    params.delete("min_price");
    params.delete("max_price");

    // 保留其他篩選參數
    if (tempFilters.colors.length > 0) {
      params.set("color_id", tempFilters.colors.join(","));
    }
    if (currentQuery.type === "category")
      params.set("category_id", currentQuery.id);
    if (currentQuery.type === "bigCategory")
      params.set("big_category_id", currentQuery.id);
    if (currentQuery.type === "brand") params.set("brand_id", currentQuery.id);

    router.replace(`/products?${params.toString()}`);
    await fetchProducts({
      page: 1,
      colors: tempFilters.colors,
    });
  };

  // 輔助函數：判斷顏色是否為淺色
  const isLightColor = (color) => {
    // 移除 # 號
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // 計算亮度
    return r * 0.299 + g * 0.587 + b * 0.114 > 186;
  };

  const [newProducts, setNewProducts] = useState([]);


  // 獲取新品和特惠商品數據
  useEffect(() => {
    const fetchSidebarProducts = async () => {
      try {
        // 獲取新品
        const newProductsResponse = await axios.get(
          `${API_BASE_URL}/products/new`
        );
        if (newProductsResponse.data.status === "success") {
          setNewProducts(newProductsResponse.data.data);
        }

      } catch (error) {
        console.error("Error fetching sidebar products:", error);
      }
    };

    fetchSidebarProducts();
  }, []);

  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="row">
        {/* 左側邊欄 */}
        <div className="col-lg-3 col-md-4">
          <div className="d-grid ">
            {/* 產品分類 */}
            <div
              className={`${styles.sideCard} ${styles.productClassification} ${
                expandedSection === "classification" ? styles.open : ""
              }`}
            >
              <div
                className={styles.cardTitle}
                onClick={() => toggleSection("classification")}
              >
                <h5>產品分類</h5>
                <i className="fa-solid fa-chevron-down"></i>
              </div>

              <ul className={styles.classificationMenu}>
                {bigCategories.map((category) => (
                  <li
                    key={category.id}
                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}
                    onMouseEnter={() => setHoveredBigCategory(category.id)}
                    onMouseLeave={() => setHoveredBigCategory(null)}
                  >
                    <a
                      href="#"
                      className={styles.categoryLink}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryFilter(category.id, true, category.name);
                      }}
                    >
                      {category.name}
                      <i className="bi bi-chevron-right float-end"></i>
                    </a>

                    {hoveredBigCategory === category.id && (
                      <ul className={styles.submenu}>
                        {smallCategories[category.id] ? (
                          smallCategories[category.id].map((smallCategory) => (
                            <li key={smallCategory.id}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCategoryFilter(
                                    smallCategory.id,
                                    false,
                                    smallCategory.name
                                  );
                                }}
                              >
                                {smallCategory.name}
                              </a>
                            </li>
                          ))
                        ) : (
                          <li>無小分類</li>
                        )}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* 品牌名稱 */}
            <div
              className={`${styles.sideCard} ${styles.productClassification} ${
                expandedSection === "brand" ? styles.open : ""
              }`}
            >
              <div
                className={styles.cardTitle}
                onClick={() => toggleSection("brand")}
              >
                <h5>品牌名稱</h5>
                <i className="fa-solid fa-chevron-down"></i>
              </div>

              <ul className={styles.classificationMenu}>
                {brandCategories.map((category) => (
                  <li
                    key={category}
                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}
                    onMouseEnter={() => setHoveredBrandCategory(category)}
                    onMouseLeave={() => setHoveredBrandCategory(null)}
                  >
                    <a href="#" className={styles.categoryLink}>
                      {category}
                    </a>

                    {hoveredBrandCategory === category &&
                      groupedBrands[category]?.length > 0 && (
                        <ul className={styles.submenu}>
                          {groupedBrands[category].map((brand) => (
                            <li key={brand.id}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleBrandFilter(brand.id, brand.name);
                                }}
                              >
                                {brand.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            </div>
            {/* 已選擇的篩選條件 */}
            <div className={styles.selectedFilters}>
              {showFilters && getSelectedFiltersCount() > 0 && (
                <div className={styles.filterTags}>
                  {tempFilters.colors.map((colorId) => {
                    const color = colors.find((c) => c.id === colorId);
                    if (!color) return null;
                    return (
                      <Tag
                        key={`color-tag-${colorId}`}
                        closable
                        onClose={() => removeColorFilter(colorId)}
                        style={{
                          backgroundColor: color.color_code,
                          color: isLightColor(color.color_code)
                            ? "#000"
                            : "#fff",
                          borderColor: color.color_code,
                        }}
                      >
                        {color.name}
                      </Tag>
                    );
                  })}

                  {(tempFilters.price.min || tempFilters.price.max) && (
                    <Tag closable onClose={clearPriceFilter} color="blue">
                      價格: {tempFilters.price.min || 0} -{" "}
                      {tempFilters.price.max || "∞"}
                    </Tag>
                  )}

                  <Tag className={styles.clearAllTag} onClick={clearAllFilters}>
                    清除全部篩選
                  </Tag>
                </div>
              )}
            </div>
            <button
              className="btn btn-primary w-100 mb-3"
              onClick={applyFilters}
            >
              篩選({getSelectedFiltersCount()}/20)
            </button>
            {/* 商品篩選 */}
            <div className={styles.sideCard}>
              <div className={styles.cardTitle}>
                <h5>商品篩選</h5>
              </div>
              <div className={styles.filterSection}>
                <div className={styles.filterTitle}>價格區間</div>
                <div className={styles.priceFilter}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div className={styles.priceInputs}>
                      <InputNumber
                        min={0}
                        max={parseInt(tempFilters.price.max) || priceRange.max}
                        value={
                          tempFilters.price.min
                            ? parseInt(tempFilters.price.min)
                            : null
                        }
                        onChange={(value) =>
                          handlePriceChange("min", value?.toString())
                        }
                        placeholder="最低"
                        style={{ width: "45%" }}
                      />
                      <span style={{ margin: "0 4px" }}>-</span>
                      <InputNumber
                        min={parseInt(tempFilters.price.min) || 0}
                        max={priceRange.max}
                        value={
                          tempFilters.price.max
                            ? parseInt(tempFilters.price.max)
                            : null
                        }
                        onChange={(value) =>
                          handlePriceChange("max", value?.toString())
                        }
                        placeholder="最高"
                        style={{ width: "45%" }}
                      />
                    </div>
                    <Slider
                      range
                      min={priceRange.min}
                      max={priceRange.max}
                      value={[
                        parseInt(tempFilters.price.min) || priceRange.min,
                        parseInt(tempFilters.price.max) || priceRange.max,
                      ]}
                      onChange={handleSliderChange}
                      tooltip={{
                        formatter: (value) => `NT$${value.toLocaleString()}`,
                      }}
                    />
                  </Space>
                </div>

                <div className={styles.filterTitle}>顏色篩選</div>
                <div className={styles.colorGroup}>
                  {colors.map((color) => {
                    const isAvailable = availableColors.includes(color.id);
                    return (
                      <div
                        key={`color-${color.id}`}
                        className={`${styles.colorCircle} 
                          ${
                            tempFilters.colors.includes(color.id)
                              ? styles.selected
                              : ""
                          }
                          ${!isAvailable ? styles.disabled : ""}`}
                        style={{
                          backgroundColor: color.color_code,
                          cursor: !isAvailable ? "not-allowed" : "pointer",
                          opacity: isAvailable ? 1 : 0.5,
                        }}
                        onClick={() => {
                          if (isAvailable) {
                            handleColorClick(color.id);
                          }
                        }}
                        title={`${color.name}${
                          !isAvailable ? " (此分類無此顏色)" : ""
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            {/* 新品上市 */}
            <SidebarProductList title="新品上市" products={newProducts} />
            {/* 特惠商品
            <SidebarProductList title="特惠商品" products={specialProducts} /> */}
          </div>
        </div>

        {/* 右側主要內容區 */}
        <div className="col-lg-9 col-md-8">
          {/* 商品介紹 */}
          <div className="mb-4">
            <h3 className="mb-3">{pageTitle.title}</h3>
            <p>{pageTitle.subtitle}</p>
          </div>

          {/* 輪播圖 */}
          <div className="position-relative mb-4" style={{ height: "200px" }}>
            <Image
              src="/images/product-top-slide.png"
              alt="潛水裝備橫幅"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
            <div className="position-absolute top-50 end-0 translate-middle-y pe-5">
              <div className="text-end">
                <h3 className="text-white mb-4">
                  專業裝備，
                  <br />
                  陪你深海冒險每一步！
                </h3>
              </div>
            </div>
          </div>

          {/* 排序和顯示選項 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                onClick={() => setShowDisplayDropdown(!showDisplayDropdown)}
              >
                {selectedDisplay}
              </button>
              <ul
                className={`dropdown-menu ${showDisplayDropdown ? "show" : ""}`}
              >
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDisplayChange(24, "每頁顯示24件")}
                  >
                    每頁顯示24件
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDisplayChange(48, "每頁顯示48件")}
                  >
                    每頁顯示48件
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDisplayChange(72, "每頁顯示72件")}
                  >
                    每頁顯示72件
                  </button>
                </li>
              </ul>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="bi bi-sort-down-alt me-2"></i>
                {selectedSort.text}
              </button>
              <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSort("綜合", 1)}
                  >
                    綜合
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSort("最新上架", 2)}
                  >
                    最新上架
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSort("價格：由低到高", 3)}
                  >
                    價格：由低到高
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSort("價格：由高到低", 4)}
                  >
                    價格：由高到低
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => handleSort("商品評分最高", 5)}
                  >
                    商品評分最高
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* 商品列表 */}
          <div className={styles.productListContainer}>
            <div className="row g-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`${styles.fadeIn} col-lg-3 col-md-4 col-sm-6`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* 分頁 */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div>
              第{page}頁/共{totalPages}頁
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0">
                {/* 上一頁按鈕 */}
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>

                {/* 動態生成頁碼按鈕 */}
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // 只顯示當前頁附近的頁碼
                  if (
                    pageNumber === 1 || // 第一頁
                    pageNumber === totalPages || // 最後一頁
                    (pageNumber >= page - 1 && pageNumber <= page + 1) // 當前頁的前後一頁
                  ) {
                    return (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          page === pageNumber ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  } else if (
                    pageNumber === page - 2 ||
                    pageNumber === page + 2
                  ) {
                    // 顯示省略號
                    return (
                      <li key={pageNumber} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}

                {/* 下一頁按鈕 */}
                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
