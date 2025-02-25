"use client";

import { useRef, useCallback, useEffect, useState, useMemo } from "react"; // useState 儲存從後端獲取的資料，並使用 useEffect 在組件加載時發送請求
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Slider from "rc-slider";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./RentList.css";
import "./modal.css";
import "../../../public/globals.css";
import "rc-slider/assets/index.css";
import RentBrand from "./RentBrand"; // 匯入，處理品牌專區
import RentCart from './RentCart';
import { debounce } from "lodash"; // 引入 debounce 解決刷新有參數的介面資料閃動問題

const Flatpickr = dynamic(() => import("flatpickr"), { ssr: false });

export default function RentList() {
  const [products, setProducts] = useState([]); // 儲存從後端獲取的商品資料
  const [loading, setLoading] = useState(true); // 加載狀態
  const [currentPage, setCurrentPage] = useState(1); // 當前頁數
  const [totalPages, setTotalPages] = useState(1); // 總頁數
  const [totalProducts, setTotalProducts] = useState(0); // 總商品數
  const [sort, setSort] = useState(""); // 當前排序方式
  const [selectedSort, setSelectedSort] = useState("下拉選取排序條件"); // 當前選擇的排序條件
  const [showClearSort, setShowClearSort] = useState(false); // 是否顯示清除排序的「×」符號
  const [itemsPerPage, setItemsPerPage] = useState(16); // 預設每頁顯示16個
  const [selectedCategoryText, setSelectedCategoryText] = useState("");
  const [selectedBrandCategoryText, setSelectedBrandCategoryText] =
    useState("");

  // sidebar 相關
  // sidebar 分類專區
  const [bigCategories, setBigCategories] = useState([]); // 大分類
  const [smallCategories, setSmallCategories] = useState([]); // 小分類
  const [selectedBigCategory, setSelectedBigCategory] = useState(null); // 當前選擇的大分類
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // 控制大分類下拉顯示
  const [showSmallCategoryDropdown, setShowSmallCategoryDropdown] =
    useState(false); // 控制小分類下拉顯示
  const [selectedSmallCategory, setSelectedSmallCategory] = useState(null); // 當前選中的小分類 ID

  // sidebar 品牌專區
  const [selectedLetter, setSelectedLetter] = useState(null); // 當前選擇的字母大分類
  const [selectedBrand, setSelectedBrand] = useState(null); // 當前選擇的品牌小分類
  const [selectedBrandId, setSelectedBrandId] = useState(null); // 存放選中的品牌 ID
  const [allBrands, setAllBrands] = useState([]); // 存儲原始品牌列表
  const [brands, setBrands] = useState([]); // 存儲過濾後的品牌列表

  // 價格專區
  const [priceRange, setPriceRange] = useState([0, 50000]); // 滑塊的價格區間
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [minPrice, setMinPrice] = useState(0); // 最低價格輸入框的值
  const [maxPrice, setMaxPrice] = useState(50000); // 最高價格輸入框的值
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]); // 臨時價格區間

  //顏色專區
  const [colors, setColors] = useState([]); // 存儲顏色資料
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // 控制顏色選項展開/收起

  // 新上市商品推薦專區
  const [newArrivals, setNewArrivals] = useState([]); // 存儲新品資料

  // 特惠商品推薦專區
  const [saleProducts, setSaleProducts] = useState([]);

  //商品列表頁跳出modal選擇詳細資訊
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [rentDateRange, setRentDateRange] = useState({
    startDate: "",
    endDate: "",
  }); // 租借日期

  // 動態更新網址參數（根據每頁顯示資料數、分頁、排序條件）
  const router = useRouter();
  const searchParams = useSearchParams();

  // 更新 URL 查詢參數，回傳後端
  const updateUrlParams = useCallback(
    (
      page,
      limit,
      sort,
      bigCategory,
      smallCategory,
      letter,
      brand_id,
      minPrice = null,
      maxPrice = null,
      color_id = null
    ) => {
      const params = new URLSearchParams();
      params.set("page", page || 1);
      params.set("limit", limit || 16);
      params.set("sort", sort || "newest");
      if (bigCategory) params.set("category_big_id", bigCategory);
      if (smallCategory) params.set("category_small_id", smallCategory);
      if (letter) params.set("letter", letter);
      if (brand_id) params.set("brand_id", brand_id);
      if (minPrice !== null) params.set("minPrice", minPrice); // 只有當 minPrice 不為 null 時傳遞
      if (maxPrice !== null) params.set("maxPrice", maxPrice); // 只有當 maxPrice 不為 null 時傳遞
      if (color_id) params.set("color_id", color_id);
      router.push(`/rent?${params.toString()}`, undefined, { shallow: true });
    },
    [router]
  );

  // 從後端獲取商品資料回前端
  const fetchProducts = useCallback(
    async (
      page = 1,
      sort = "newest",
      limit = 16,
      category_big_id = null,
      category_small_id = null,
      letter = null,
      brand_id = null,
      minPrice = null,
      maxPrice = null,
      color_id = null
    ) => {
      console.log("請求參數:", {
        page,
        sort,
        limit,
        category_big_id,
        category_small_id,
        letter,
        brand_id,
        minPrice,
        maxPrice,
        color_id,
      });
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
        const url = new URL(`${API_BASE_URL}/api/rent`);
        // 設置查詢參數
        url.searchParams.set("page", page || 1);
        url.searchParams.set("limit", limit || 16);
        if (sort) url.searchParams.set("sort", sort || "newest");
        if (category_big_id)
          url.searchParams.set("category_big_id", category_big_id);
        if (category_small_id)
          url.searchParams.set("category_small_id", category_small_id);
        if (letter) url.searchParams.set("letter", letter);
        if (brand_id) url.searchParams.set("brand_id", brand_id);
        if (minPrice !== null) url.searchParams.set("minPrice", minPrice); // 只有當 minPrice 不為 null 時傳遞
        if (maxPrice !== null) url.searchParams.set("maxPrice", maxPrice); // 只有當 maxPrice 不為 null 時傳遞
        if (color_id) url.searchParams.set("color_id", color_id);

        console.log("API 請求 URL:", url.toString()); // 調試信息

        // 處理合併分類的 letter
        if (letter) {
          if (letter === "B、C、D") {
            url.searchParams.set("letters", "B,C,D");
          } else if (letter === "E、F、G、H、I") {
            url.searchParams.set("letters", "E,F,G,H,I");
          } else if (letter === "L、M、N") {
            url.searchParams.set("letters", "L,M,N");
          } else if (letter === "O、P、R") {
            url.searchParams.set("letters", "O,P,R");
          } else if (letter === "T、V、W") {
            url.searchParams.set("letters", "T,V,W");
          } else {
            url.searchParams.set("letter", letter);
          }
        }

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
    []
  );

  // console.log("Brands in RentList:", brands); // 檢查 brands 資料是否成功傳遞

  // 使用 debounce 減少頻繁請求，解決頁面刷新閃動問題
  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 300),
    [fetchProducts]
  );

  // 從 URL 初始化狀態
  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 16;
    const sort = searchParams.get("sort") || "newest"; // 或者之後改""，再看看
    const bigCategory = parseInt(searchParams.get("category_big_id")) || null;
    const smallCategory =
      parseInt(searchParams.get("category_small_id")) || null;
    const letter = searchParams.get("letter") || null;
    const brand_id = parseInt(searchParams.get("brand_id")) || null;
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 50000;
    const color_id = parseInt(searchParams.get("color_id")) || null;

    setCurrentPage(page);
    setItemsPerPage(limit);
    setSort(sort);
    setSelectedBigCategory(bigCategory);
    setSelectedSmallCategory(smallCategory);
    setSelectedLetter(letter);
    setSelectedBrand(brand_id);
    setPriceRange([minPrice, maxPrice]);
    setIsPriceFilterActive(minPrice > 0 || maxPrice < 50000);
    setSelectedColorId(color_id);

    // 先檢查 localStorage 是否有快取
    const cacheKey = `products_${page}_${limit}_${sort}_${bigCategory}_${smallCategory}_${letter}_${brand_id}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (parsedData.data && parsedData.totalPages && parsedData.total) {
          setProducts(parsedData.data);
          setTotalPages(parsedData.totalPages);
          setTotalProducts(parsedData.total);
          setLoading(false);
          return; // 有快取則不發請求
        }
      } catch (error) {
        console.error("解析 localStorage 失敗:", error);
      }
    }

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
    // 根據 URL 參數初始化商品列表
    debouncedFetchProducts(
      page,
      sort,
      limit,
      bigCategory,
      smallCategory,
      letter,
      brand_id,
      minPrice,
      maxPrice,
      color_id
    );

    // 更新 URL 參數
    updateUrlParams(
      page,
      limit,
      sort,
      bigCategory,
      smallCategory,
      letter,
      brand_id,
      minPrice,
      maxPrice,
      color_id
    );
  }, [searchParams, debouncedFetchProducts, updateUrlParams]);

  useEffect(() => {
    // 根據 selectedLetter 過濾品牌列表
    if (selectedBrandId) {
      const selectedBrand = brands.find(
        (brand) => brand.brand_id === selectedBrandId
      );
      if (selectedBrand) {
        setSelectedBrandCategoryText(
          selectedLetter
            ? `字母分類：${selectedLetter} > 品牌：${selectedBrand.brand_name}`
            : `品牌：${selectedBrand.brand_name}`
        );
      }
    } else if (selectedLetter) {
      setSelectedBrandCategoryText(`字母分類：${selectedLetter}`);
    } else {
      setSelectedBrandCategoryText("");
    }
  }, [selectedLetter, brands, selectedBrandId]);

  useEffect(() => {
    let text = "";

    // 如果有字母大分類
    if (selectedLetter) {
      text += `字母分類：${selectedLetter}`;
    }

    // 如果有品牌小分類
    if (selectedBrandId) {
      const selectedBrand = brands.find(
        (brand) => brand.brand_id === selectedBrandId
      );
      if (selectedBrand) {
        text += selectedLetter
          ? ` > 品牌：${selectedBrand.brand_name}`
          : `品牌：${selectedBrand.brand_name}`;
      }
    }

    // 更新 selectedCategoryText
    setSelectedCategoryText(text);
  }, [selectedLetter, selectedBrandId, brands]);

  // 處理品牌開頭字母大分類選擇
  const handleLetterSelect = useCallback(
    (letter) => {
      setSelectedLetter(letter);
      setSelectedBrandId(null); // 重置品牌 ID
      setSelectedBrandCategoryText(`字母分類：${letter}`); // 更新品牌文字
      setCurrentPage(1); // 重置頁數

      debouncedFetchProducts(
        1, // page
        sort, // sort
        itemsPerPage, // limit
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        letter, // letter
        null // brand_id (重置為 null)
      );
      updateUrlParams(
        1, // page
        itemsPerPage, // limit
        sort, // sort
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        letter, // letter
        null // brand_id (重置為 null)
      );
    },
    [
      debouncedFetchProducts,
      updateUrlParams,
      sort,
      itemsPerPage,
      selectedBigCategory,
      selectedSmallCategory,
    ]
  );

  // 處理品牌選擇
  const handleBrandSelect = useCallback(
    (brandId, brandName, letter) => {
      setSelectedBrandId(brandId);
      setSelectedLetter(letter); // 根據品牌名稱動態設置 letter
      setSelectedBrandCategoryText(
        letter
          ? `字母分類：${letter} > 品牌：${brandName}`
          : `品牌：${brandName}`
      ); // 更新品牌文字
      setCurrentPage(1); // 重置頁數
      // 更新 URL 參數並發起 API 請求
      updateUrlParams(
        1, // page
        itemsPerPage, // limit
        sort, // sort
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        letter, // letter
        brandId // brand_id
      );

      debouncedFetchProducts(
        1, // page
        sort, // sort
        itemsPerPage, // limit
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        letter, // letter
        brandId // brand_id
      );
    },
    [
      debouncedFetchProducts,
      updateUrlParams,
      sort,
      itemsPerPage,
      selectedBigCategory,
      selectedSmallCategory,
    ]
  );

  // 更新品牌列表的渲染邏輯
  {
    selectedLetter && (
      <div className="brand-list">
        {brands
          .filter((brand) => brand.letter === selectedLetter)
          .map((brand) => (
            <div
              key={brand.brand_id}
              className={`brand-item ${
                selectedBrandId === brand.brand_id ? "selected" : ""
              }`}
              onClick={() =>
                handleBrandSelect(brand.brand_id, brand.brand_name)
              }
            >
              {brand.brand_name}
            </div>
          ))}
      </div>
    );
  }

  // 從後端獲取商品資料
  // 從後端獲取大分類和小分類
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/rent/categories"
        );
        const data = await response.json();

        const sortedBigCategories = data.categories.sort(
          (a, b) => a.category_big_id - b.category_big_id
        );
        setBigCategories(sortedBigCategories); // 設置排序後的大分類

        // 根據選擇的大分類，設置對應的小分類
        if (selectedBigCategory) {
          const selectedBigCategoryData = sortedBigCategories.find(
            (cat) => cat.category_big_id === selectedBigCategory
          );
          // 對小分類進行排序
          const sortedSmallCategories =
            selectedBigCategoryData?.category_small.sort(
              (a, b) => a.id - b.id // 按 id 排序
            );

          setSmallCategories(sortedSmallCategories || []); // 設置排序後的小分類
        }
      } catch (error) {
        console.error("分類資料獲取失敗:", error);
      }
    };

    fetchCategories();
  }, [selectedBigCategory]);

  // 從後端獲取品牌資料
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          "http://localhost:3005/api/rent/brandcategories"
        );
        const data = await response.json();
        console.log("API 回傳資料:", data); // 調試信息

        if (data.success && Array.isArray(data.data)) {
          setBrands(data.data); // 確保這裡是 data.data
          console.log("品牌資料更新成功:", data.data); // 調試信息
        } else {
          console.error("API 回傳的資料格式不正確:", data);
        }
      } catch (error) {
        console.error("品牌資料獲取失敗:", error);
      }
    };

    fetchBrands();
  }, []);

  // 從後端獲取顏色資料
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
        const response = await fetch(`${API_BASE_URL}/api/rent/colors`);

        // 檢查回應是否成功
        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
        }

        const result = await response.json();

        // 檢查回應格式是否正確
        if (result && result.success && Array.isArray(result.data)) {
          setColors(result.data); // 設置顏色資料
        } else {
          console.error("API 返回的顏色資料格式不正確:", result);
        }
      } catch (error) {
        console.error("獲取顏色資料失敗:", error);
      }
    };

    fetchColors();
  }, []);

  // 處理顏色選擇
  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId); // 更新選中的 color_id
    setCurrentPage(1); // 重置頁數

    // 更新 URL 參數並發起 API 請求
    updateUrlParams(
      1, // page
      itemsPerPage, // limit
      sort, // sort
      selectedBigCategory, // category_big_id
      selectedSmallCategory, // category_small_id
      selectedLetter, // letter
      selectedBrandId, // brand_id
      isPriceFilterActive ? priceRange[0] : null, // minPrice
      isPriceFilterActive ? priceRange[1] : null, // maxPrice
      colorId // color_id
    );

    // 發送 API 請求
    debouncedFetchProducts(
      1, // page
      sort, // sort
      itemsPerPage, // limit
      selectedBigCategory, // category_big_id
      selectedSmallCategory, // category_small_id
      selectedLetter, // letter
      selectedBrandId, // brand_id
      isPriceFilterActive ? priceRange[0] : null, // minPrice
      isPriceFilterActive ? priceRange[1] : null, // maxPrice
      colorId // color_id
    );
  };

  // 清除顏色過濾
  const handleClearColorFilter = () => {
    setSelectedColorId(null); // 清除選中的 color_id
    setCurrentPage(1); // 重置頁數

    // 更新 URL 參數並發起 API 請求
    updateUrlParams(
      1, // page
      itemsPerPage, // limit
      sort, // sort
      selectedBigCategory, // category_big_id
      selectedSmallCategory, // category_small_id
      selectedLetter, // letter
      selectedBrandId, // brand_id
      isPriceFilterActive ? priceRange[0] : null, // minPrice
      isPriceFilterActive ? priceRange[1] : null, // maxPrice
      null // 清除 color_id
    );

    // 發送 API 請求
    debouncedFetchProducts(
      1, // page
      sort, // sort
      itemsPerPage, // limit
      selectedBigCategory, // category_big_id
      selectedSmallCategory, // category_small_id
      selectedLetter, // letter
      selectedBrandId, // brand_id
      isPriceFilterActive ? priceRange[0] : null, // minPrice
      isPriceFilterActive ? priceRange[1] : null // maxPrice
    );
  };

  // 切換顏色選項展開/收起
  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState); // 切換展開狀態
  };

  // 獲取新品資料
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
        const response = await fetch(`${API_BASE_URL}/api/rent/new-arrivals`);

        // 檢查回應是否成功
        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
        }

        const result = await response.json();

        // 檢查回應格式是否正確
        if (result && result.success && Array.isArray(result.data)) {
          setNewArrivals(result.data); // 設置新品資料
        } else {
          console.error("API 返回的新品資料格式不正確:", result);
        }
      } catch (error) {
        console.error("獲取新品資料失敗:", error);
      }
    };

    fetchNewArrivals();
  }, []);

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 特惠商品推薦
  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
        const response = await fetch(`${API_BASE_URL}/api/rent/new-discounted`);

        // 檢查回應是否成功
        if (!response.ok) {
          throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`);
        }

        const result = await response.json();

        // 檢查回應格式是否正確
        if (result && result.success && Array.isArray(result.data)) {
          setSaleProducts(result.data); // 設置新品資料
        } else {
          console.error("API 返回的特惠商品資料格式不正確:", result);
        }
      } catch (error) {
        console.error("獲取特惠商品資料失敗:", error);
      }
    };

    fetchSaleProducts();
  }, []);

  // 初始加載
  useEffect(() => {
    debouncedFetchProducts(
      currentPage,
      sort,
      itemsPerPage,
      selectedBigCategory,
      selectedSmallCategory,
      selectedLetter,
      selectedBrandId,
      isPriceFilterActive ? priceRange[0] : null, // 只有當 isPriceFilterActive 為 true 時傳遞 minPrice
      isPriceFilterActive ? priceRange[1] : null, // 只有當 isPriceFilterActive 為 true 時傳遞 maxPrice
      selectedColorId
    );
    updateUrlParams(
      currentPage,
      itemsPerPage,
      sort,
      selectedBigCategory,
      selectedSmallCategory,
      selectedLetter,
      selectedBrandId,
      isPriceFilterActive ? priceRange[0] : null, // 只有當 isPriceFilterActive 為 true 時傳遞 minPrice
      isPriceFilterActive ? priceRange[1] : null, // 只有當 isPriceFilterActive 為 true 時傳遞 maxPrice
      selectedColorId
    );
  }, [
    currentPage,
    sort,
    itemsPerPage,
    selectedBigCategory,
    selectedSmallCategory,
    selectedLetter,
    selectedBrandId,
    priceRange,
    isPriceFilterActive,
    selectedColorId,
    debouncedFetchProducts,
    updateUrlParams,
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

  // 清除分類條件
  const handleClearCategory = useCallback(() => {
    setSelectedBigCategory(null); // 清除大分類
    setSelectedSmallCategory(null); // 清除小分類
    setSelectedLetter(null); // 清除字母大分類
    setSelectedBrandId(null); // 清除品牌小分類
    setSelectedCategoryText(""); // 清除分類文字
    setSelectedBrandCategoryText(""); // 清除品牌分類文字
    setCurrentPage(1); // 重置分頁
    // 更新 URL 參數並重新獲取商品列表
    updateUrlParams(
      1, // page
      itemsPerPage, // limit
      sort, // sort
      selectedBigCategory, // category_big_id
      selectedSmallCategory, // category_small_id
      null, // letter
      null // brand_id
    );

    debouncedFetchProducts(
      1, // page
      sort, // sort
      itemsPerPage, // limit
      selectedBigCategory, // category_big_id
      selectedSmallCategory, // category_small_id
      null, // letter
      null // brand_id
    );
  }, [
    debouncedFetchProducts,
    updateUrlParams,
    sort,
    itemsPerPage,
    selectedBigCategory,
    selectedSmallCategory,
  ]);

  // 更新選擇的分類文字（商品分類）
  useEffect(() => {
    let text = "";
    if (selectedBigCategory && selectedSmallCategory) {
      // 如果有大分類和小分類
      const bigCategoryName = bigCategories.find(
        (cat) => cat.category_big_id === selectedBigCategory
      )?.category_big_name;
      const smallCategoryName = smallCategories.find(
        (cat) => cat.id === selectedSmallCategory
      )?.name;
      text = `${bigCategoryName} > ${smallCategoryName}`;
    } else if (selectedBigCategory) {
      // 如果只有大分類
      const bigCategoryName = bigCategories.find(
        (cat) => cat.category_big_id === selectedBigCategory
      )?.category_big_name;
      text = `${bigCategoryName}`;
    }
    setSelectedCategoryText(text);
  }, [
    selectedBigCategory,
    selectedSmallCategory,
    bigCategories,
    smallCategories,
  ]);

  // 更新選擇的分類文字（品牌專區）
  useEffect(() => {
    if (selectedBrand) {
      setSelectedBrandCategoryText(`品牌：${selectedBrand.brand_name}`);
    } else {
      setSelectedBrandCategoryText("");
    }
  }, [selectedBrand]);

  const handleCategorySelect = (bigCategory) => {
    setSelectedBigCategory(bigCategory.category_big_id);
    setSelectedSmallCategory(null); // 重置小分類
    setCurrentPage(1); // 重置頁數
    setSelectedCategoryText(`${bigCategory.category_big_name}`);
    debouncedFetchProducts(
      1,
      sort,
      itemsPerPage,
      bigCategory.category_big_id,
      null
    );
    updateUrlParams(1, itemsPerPage, sort, bigCategory.category_big_id, null);
  };

  // 更新選擇的小分類
  const handleSmallCategorySelect = useCallback(
    (smallCategory) => {
      setSelectedSmallCategory(smallCategory.id); // 設置選中的小分類
      setShowCategoryDropdown(false); // 收起大分類選單
      setShowSmallCategoryDropdown(false); // 收起小分類選單
      setCurrentPage(1); // 重置分頁

      // 從 bigCategories 中獲取大分類名稱
      const selectedBigCategoryData = bigCategories.find(
        (cat) => cat.category_big_id === selectedBigCategory
      );
      const selectedBigCategoryName = selectedBigCategoryData
        ? selectedBigCategoryData.category_big_name
        : "未選擇大分類";

      // 更新選擇的分類文字
      setSelectedCategoryText(
        `${selectedBigCategoryName} > ${smallCategory.name}`
      );

      debouncedFetchProducts(
        1,
        sort,
        itemsPerPage,
        selectedBigCategory,
        smallCategory.id
      );

      // 篩選小分類商品
      updateUrlParams(
        1,
        itemsPerPage,
        sort,
        selectedBigCategory,
        smallCategory.id
      ); // 更新 URL 參數
    },
    [
      debouncedFetchProducts,
      updateUrlParams,
      selectedBigCategory,
      sort,
      itemsPerPage,
      bigCategories,
    ]
  );

  // 在渲染小分類列表時，根據 selectedBigCategory 過濾出對應的小分類
  {
    selectedBigCategory && (
      <div className="small-category-dropdown">
        {bigCategories
          .find((cat) => cat.category_big_id === selectedBigCategory)
          ?.category_small.map((small) => (
            <div
              key={small.id}
              className={`small-category-dropdown-item ${
                selectedSmallCategory === small.id ? "selected" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡
                handleSmallCategorySelect(small);
              }}
            >
              {small.name}
            </div>
          ))}
      </div>
    );
  }

  // 每頁顯示資料數量
  const handleItemsPerPageChange = useCallback(
    (limit) => {
      setItemsPerPage(limit);
      setCurrentPage(1);
      // 更新 URL 參數
      updateUrlParams(
        1, // page
        limit, // limit
        sort, // sort
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        selectedLetter, // letter
        selectedBrandId // brand_id
      );

      // 發送 API 請求
      debouncedFetchProducts(
        1, // page
        sort, // sort
        limit, // limit
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        selectedLetter, // letter
        selectedBrandId // brand_id
      );
    },
    [
      sort,
      selectedBigCategory,
      selectedSmallCategory,
      selectedLetter,
      selectedBrandId,
      updateUrlParams,
      debouncedFetchProducts,
    ]
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
      setSort(sortType || "newest");
      setCurrentPage(1);
      setShowClearSort(true);
      debouncedFetchProducts(
        1, // page
        sortType || "newest", // sort
        itemsPerPage, // limit
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        selectedLetter, // letter
        selectedBrandId, // brand_id
        isPriceFilterActive ? priceRange[0] : null, // minPrice
        isPriceFilterActive ? priceRange[1] : null // maxPrice
      );
      updateUrlParams(
        1, // page
        itemsPerPage, // limit
        sortType || "newest", // sort
        selectedBigCategory, // category_big_id
        selectedSmallCategory, // category_small_id
        selectedLetter, // letter
        selectedBrandId, // brand_id
        isPriceFilterActive ? priceRange[0] : null, // minPrice
        isPriceFilterActive ? priceRange[1] : null // maxPrice
      );
    },
    [
      itemsPerPage,
      selectedBigCategory,
      selectedSmallCategory,
      selectedLetter,
      selectedBrandId,
      priceRange,
      isPriceFilterActive,
      updateUrlParams,
      debouncedFetchProducts,
    ]
  );

  // 清除排序條件
  const handleClearSort = useCallback(() => {
    setSelectedSort("下拉選取排序條件");
    setSort("newest");
    setCurrentPage(1);
    setShowClearSort(false);
    debouncedFetchProducts(
      1,
      "newest",
      itemsPerPage,
      selectedBigCategory,
      selectedSmallCategory
    );
    updateUrlParams(
      1,
      itemsPerPage,
      "newest",
      selectedBigCategory,
      selectedSmallCategory
    );
  }, [
    itemsPerPage,
    selectedBigCategory,
    selectedSmallCategory,
    updateUrlParams,
    debouncedFetchProducts,
  ]);

  // 處理分頁
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      debouncedFetchProducts(
        page,
        sort,
        itemsPerPage,
        selectedBigCategory,
        selectedSmallCategory,
        selectedLetter, // 傳遞 selectedLetter
        selectedBrandId // 傳遞 selectedBrandId
      );
      updateUrlParams(
        page,
        itemsPerPage,
        sort,
        selectedBigCategory,
        selectedSmallCategory,
        selectedLetter, // 傳遞 selectedLetter
        selectedBrandId // 傳遞 selectedBrandId
      );
    },
    [
      itemsPerPage,
      sort,
      selectedBigCategory,
      selectedSmallCategory,
      selectedLetter,
      selectedBrandId,
      updateUrlParams,
      debouncedFetchProducts, // 添加 debouncedFetchProducts 到依賴陣列
    ]
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

  // 點擊圖標時顯示 Modal
  const handleIconClick = (product, e) => {
    e.stopPropagation(); // 防止事件冒泡（才不會點到跳轉 rent detail）
    // setSelectedProduct(product);

    // 重設選擇的商品及相關狀態
    setSelectedProduct({
      ...product,
      quantity: 1, // 重置數量
    });

    setQuantity(1); // 確保數量輸入框重置
    setBookingDate(""); // 重置預訂日期
    setRentDateRange([]); // 重置日期區間

    // 清空日期選擇器的值
    const dateRangeInput = document.getElementById("rentDateRange");
    if (dateRangeInput && dateRangeInput._flatpickr) {
      dateRangeInput._flatpickr.clear();
    }

    // 觸發 Bootstrap Modal
    const myModal = new bootstrap.Modal(
      document.getElementById("rentDetailModal")
    );
    myModal.show();
    // 在 modal 顯示後初始化 flatpickr
    const modalElement = document.getElementById("rentDetailModal");

    const handleModalShown = () => {
      const dateRangeInput = document.getElementById("rentDateRange");

      if (dateRangeInput && !dateRangeInput._flatpickr) {
        dateRangeInput.classList.add("rentlist-flatpickr");

        const flatpickrInstance = flatpickr(dateRangeInput, {
          mode: "range", // 設置為日期區間選擇模式
          dateFormat: "Y年m月d日", // 設置日期格式
          minDate: "today", // 設置最小日期為今天
          locale: {
            rangeSeparator: " ~ ", // 設置日期區間的分隔符
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
              const [startDate, endDate] = selectedDates.map(
                (date) => date.toISOString().split("T")[0]
              ); // 轉換為 YYYY-MM-DD 格式

              setRentDateRange([startDate, endDate]);
              console.log("選擇的日期區間:", startDate, endDate);
            }
          },
          onOpen: () => {
            // 在日曆打開時，將 rentlist-flatpickr 類名添加到日曆容器
            const calendarContainer = document.querySelector(
              ".flatpickr-calendar"
            );
            if (calendarContainer) {
              calendarContainer.classList.add("rentlist-flatpickr");
            }
            // 清空日期選擇器的值
            dateRangeInput.value = "";
          },
        });
      }
    };

    // 綁定事件監聽器
    modalElement.addEventListener("shown.bs.modal", handleModalShown);

    // 清理事件監聽器
    return () => {
      modalElement.removeEventListener("shown.bs.modal", handleModalShown);
    };
  };
  // const handleConfirmRent = () => {
  //   if (!rentDateRange.startDate || !rentDateRange.endDate) {
  //     alert("請填寫完整的租借日期");
  //     return;
  //   }

  //   if (!quantity) {
  //     alert("請填寫數量");
  //     return;
  //   }

  //   // 確保租借資訊正確後，加入購物車
  //   addToCart(
  //     selectedProduct.id,
  //     rentDateRange.startDate,
  //     rentDateRange.endDate,
  //     quantity
  //   );
  //   closeModal(); // 關閉 Modal
  // };

  // const addToCart = async (productId, startDate, endDate, rentQuantity) => {
  //   try {
  //     const response = await fetch('/add-to-cart', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         productId,
  //         startDate,
  //         endDate,
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
              <div className="d-flex flex-column sidebar-category">
                {/* 1. 商品類別區塊 */}
                <div className="d-flex flex-column sidebar-lists product-category">
                  <div
                    className={`d-flex justify-content-between align-items-center sidebar-lists-title ${
                      showCategoryDropdown ? "open" : ""
                    }`}
                    onClick={toggleCategoryDropdown}
                    style={{ cursor: "pointer" }}
                  >
                    <h6>商品類別</h6>
                    <i className="bi bi-chevron-down"></i>
                  </div>

                  {showCategoryDropdown && (
                    <div className="sidebar-dropdown">
                      {bigCategories.map((bigCategory) => (
                        <div
                          key={bigCategory.category_big_id}
                          className={`sidebar-dropdown-item ${
                            selectedBigCategory === bigCategory.category_big_id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleCategorySelect(bigCategory)}
                        >
                          {bigCategory.category_big_name}
        
                          <div className="small-category-dropdown">
                            {bigCategory.category_small.map((small) => (
                              <div
                                key={small.id}
                                className={`small-category-dropdown-item ${
                                  selectedSmallCategory === small.id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation(); // 阻止事件冒泡
                                  handleSmallCategorySelect(small);
                                }}
                              >
                                {small.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. 品牌專區區塊 */}
                <div className="d-flex flex-column sidebar-lists brand-category">
                  <RentBrand
                    setSelectedBrand={handleBrandSelect} // 傳遞品牌選擇事件
                    setSelectedBrandCategoryText={setSelectedBrandCategoryText} // 傳遞品牌文字更新事件
                    setSelectedLetter={handleLetterSelect} // 傳遞字母分類選擇事件
                    selectedLetter={selectedLetter} // 當前選擇的字母
                    selectedBrandId={selectedBrandId} // 當前選擇的品牌 ID
                    brands={brands} // 傳遞 brands 列表
                  />
                </div>
              </div>

              {/* 篩選按鈕 */}

              {/* 2. 篩選條件區塊 */}
              <div className="d-flex flex-column sidebar-lists product-filter">
                <div className="d-flex justify-content-between align-items-center sidebar-lists-title">
                  <h6>篩選條件</h6>
                  <button
                    type="button"
                    className={`btn sidebar-selectBtn d-flex flex-row ${
                      isPriceFilterActive ? "active" : ""
                    }`} // 根據 isPriceFilterActive 狀態來決定是否加上 active 類別
                    disabled={isPriceFilterActive} // 啟用價格篩選時禁用按鈕
                    onClick={() => {
                      setIsPriceFilterActive((prevState) => !prevState); // 切換篩選條件的啟用狀態
                      setPriceRange(tempPriceRange); // 將臨時價格區間設置為正式價格區間
                      updateUrlParams(
                        currentPage,
                        itemsPerPage,
                        sort,
                        selectedBigCategory,
                        selectedSmallCategory,
                        selectedLetter,
                        selectedBrandId,
                        tempPriceRange[0], // 傳遞 minPrice
                        tempPriceRange[1] // 傳遞 maxPrice
                      );
                      // 觸發 API 請求
                      debouncedFetchProducts(
                        currentPage,
                        sort,
                        itemsPerPage,
                        selectedBigCategory,
                        selectedSmallCategory,
                        selectedLetter,
                        selectedBrandId,
                        tempPriceRange[0], // 傳遞 minPrice
                        tempPriceRange[1] // 傳遞 maxPrice
                      );
                    }}
                  >
                    <i className="bi bi-funnel-fill"></i>
                    <i className="bi bi-list"></i>
                  </button>
                </div>

                {/* 價格區間 */}
                <div className="product-filter-price">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="filter-subtitle">價格區間</p>
                    {(priceRange[0] > 0 || priceRange[1] < 50000) && ( // 如果有設定價格範圍
                      <i
                        className="bi bi-x clear-filter"
                        onClick={() => {
                          setPriceRange([0, 50000]); // 重置價格範圍
                          setTempPriceRange([0, 50000]); // 重置臨時價格區間
                          setIsPriceFilterActive(false); // 停用價格篩選

                          // 觸發商品列表更新
                          debouncedFetchProducts(
                            currentPage,
                            sort,
                            itemsPerPage,
                            selectedBigCategory,
                            selectedSmallCategory,
                            selectedLetter,
                            selectedBrandId,
                            0, // 重置最小價格
                            50000 // 重置最大價格
                          );

                          // 更新 URL 參數（移除價格條件）
                          updateUrlParams(
                            currentPage,
                            itemsPerPage,
                            sort,
                            selectedBigCategory,
                            selectedSmallCategory,
                            selectedLetter,
                            selectedBrandId,
                            0, // 重置最小價格
                            50000 // 重置最大價格
                          );
                        }}
                      ></i>
                    )}
                  </div>
                  <div className="price-input d-flex flex-row align-items-center">
                    {/* <div> 從 </div> */}
                    <div className="d-flex align-items-center price-box">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        className="min-price"
                        placeholder="從"
                        aria-label="最低價格"
                        value={tempPriceRange[0]}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setTempPriceRange([value, tempPriceRange[1]]);
                          setPriceRange([value, tempPriceRange[1]]);
                          debouncedFetchProducts(
                            currentPage,
                            sort,
                            itemsPerPage,
                            selectedBigCategory,
                            selectedSmallCategory,
                            selectedLetter,
                            selectedBrandId,
                            value, // 傳遞 minPrice
                            tempPriceRange[1] // 傳遞 maxPrice
                          );
                        }}
                      />
                    </div>
                    <div> ~ </div>
                    <div className="d-flex align-items-center price-box">
                      <span className="currency-symbol">$</span>
                      <input
                        type="number"
                        className="max-price"
                        placeholder="至"
                        aria-label="最高價格"
                        value={tempPriceRange[1]}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setTempPriceRange([tempPriceRange[0], value]);
                          setPriceRange([tempPriceRange[0], value]);
                          debouncedFetchProducts(
                            currentPage,
                            sort,
                            itemsPerPage,
                            selectedBigCategory,
                            selectedSmallCategory,
                            selectedLetter,
                            selectedBrandId,
                            tempPriceRange[0], // 傳遞 minPrice
                            value // 傳遞 maxPrice
                          );
                        }}
                      />
                    </div>
                  </div>
                  <Slider
                    className="custom-slider"
                    range
                    min={0}
                    max={50000}
                    value={tempPriceRange}
                    onChange={(value) => {
                      setTempPriceRange(value);
                      setIsPriceFilterActive(true); // 啟用價格篩選
                      setPriceRange(value);
                      debouncedFetchProducts(
                        currentPage,
                        sort,
                        itemsPerPage,
                        selectedBigCategory,
                        selectedSmallCategory,
                        selectedLetter,
                        selectedBrandId,
                        value[0], // 傳遞 minPrice
                        value[1] // 傳遞 maxPrice
                      );
                    }}
                  />
                </div>

                {/* 顏色類別 */}
                <div className="product-filter-color ">
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="filter-subtitle filter-subtitle2">
                      顏色類別
                      <i
                        className={`bi bi-chevron-down ${
                          isExpanded ? "rotate" : ""
                        }`}
                        onClick={toggleExpansion}
                      ></i>{" "}
                    </p>
                    {selectedColorId && ( // 當選中顏色時顯示清除按鈕
                      <i
                        className="bi bi-x clear-filter"
                        onClick={handleClearColorFilter}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      ></i>
                    )}
                  </div>
                  <div
                    className={`d-flex flex-wrap align-items-center color-options ${
                      isExpanded ? "expanded" : ""
                    }`}
                  >
                    {colors.map((color) => (
                      <div
                        key={color.id} // 使用 color.id 作為 key
                        className={`color-circle ${
                          selectedColorId === color.id ? "selected" : "" // 使用 color.id 進行比較
                        }`}
                        style={{ backgroundColor: color.rgb }} // 使用 color.rgb 設置背景色
                        onClick={() => handleColorSelect(color.id)} // 傳遞 color.id 給 handleColorSelect
                        title={`${color.name} (${color.rgb})`} // 懸停時顯示顏色名稱和 RGB
                      ></div>
                    ))}
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
                  {newArrivals.map((product) => (
                    <div className="card" key={product.id}>
                      <Link
                        href={`/rent/${product.id}`}
                        passHref
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                          color: "none",
                        }}
                      >
                        <div className="d-flex flex-row align-items-center new-product">
                          <Image
                            src={product.img_url}
                            alt={product.name}
                            width={90} // 設定圖片的寬度
                            height={90} // 設定圖片的高度
                            className="card-img-left product-img"
                            priority
                            unoptimized
                          />
                          <div className="card-body d-flex flex-column">
                            <p className="product-brand">{product.brand}</p>
                            <p className="product-name">{product.name}</p>
                            <h6 className="product-price">
                              NT$ {product.price}
                            </h6>
                            <div className="d-flex flex-row align-items-center product-color">
                              {/* 假設商品顏色資料在 product.color_rgb 中 */}
                              {product.color_rgb &&
                                product.color_rgb
                                  .split(", ")
                                  .map((color, index) => (
                                    <span
                                      key={index}
                                      className="color-box"
                                      style={{ backgroundColor: color }}
                                    ></span>
                                  ))}
                            </div>
                            {/* <p className="product-created-at">
                    上架時間: {formatDate(product.created_at)}
                  </p>
                  <p className="product-updated-at">
                    最後更新: {formatDate(product.update_at)}
                  </p> */}
                          </div>
                        </div>
                      </Link>
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
                  {saleProducts.map((product) => (
                    <div className="card" key={product.id}>
                      <Link
                        href={`/rent/${product.id}`}
                        passHref
                        style={{
                          cursor: "pointer",
                          textDecoration: "none",
                          color: "none",
                        }}
                      >
                        <div className="d-flex flex-row align-items-center sale-product">
                          <Image
                            src={product.img_url || "/image/rent/no-img.png"} // 如果沒有圖片則顯示預設圖
                            alt={product.name}
                            width={90}
                            height={90}
                            className="card-img-left product-img"
                            priority
                            unoptimized
                          />
                          <div className="card-body d-flex flex-column">
                            <p className="product-brand">{product.brand}</p>
                            <p className="product-name">{product.name}</p>
                            <h6 className="product-price">
                              NT$ {product.price}
                            </h6>
                            <h6 className="product-price2">
                              NT$ {product.price2}
                            </h6>
                            <div className="d-flex flex-row align-items-center product-color">
                              {product.color_rgb &&
                                product.color_rgb
                                  .split(", ")
                                  .map((color, index) => (
                                    <span
                                      key={index}
                                      className="color-box"
                                      style={{ backgroundColor: color }}
                                    ></span>
                                  ))}
                            </div>
                          </div>
                        </div>
                      </Link>
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
                  src="/image/rent/rentimg.jpg"
                  alt="輕鬆租賃，探索深海無負擔！"
                  className="main-img w-100"
                  width={420} // 設定圖片的寬度
                  height={188} // 設定圖片的高度
                  priority
                  unoptimized
                />
              </div>

              {/* Main Select */}
              <div className="d-flex flex-row justify-content-between align-items-center">
                {/* 大小分類的篩選顯示 & 清除 */}
                <div className="selected-category-text">
                  {selectedCategoryText ||
                    selectedBrandCategoryText ||
                    "全館租借商品"}
                  {(selectedBigCategory ||
                    selectedSmallCategory ||
                    selectedLetter ||
                    selectedBrand) && (
                    <span
                      className="ms-2 clear-category-icon"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        handleClearCategory(); // 清除分類條件
                      }}
                      style={{ cursor: "pointer" }} // 設置滑鼠指針樣式
                    >
                      <i className="bi bi-x"></i>
                    </span>
                  )}
                </div>
                {/* 排序與一頁資料數量顯示 */}
                <div className="py-3 d-flex flex-row justify-content-end gap-2 align-items-center main-select">
                  {/* 排序選項 */}
                  <div className="d-flex flex-row justify-content-between align-items-center select-order">
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
                  {/* 分頁選項 */}
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
              </div>

              {/* Bootstrap Modal */}
              <div
                className="modal fade"
                id="rentDetailModal"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-custom">
                  <div className="modal-content">
                    {/* modal標題 */}
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {selectedProduct?.brand_name || "未知品牌"} -{" "}
                        {selectedProduct?.name || "租借商品詳情"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    {/* modal內容區塊 */}
                    <div className="modal-body">
                      {selectedProduct ? (
                        <div className="row d-flex flex-row justify-content-center align-items-center">
                          {/* 左側：商品圖片 */}
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

                          {/* 右側：商品資訊 */}
                          <div className="col-md-7 d-flex flex-column gap-2">
                            {/* 商品價格 */}
                            <div className="subdetails-titles d-flex flex-column">
                              {/* 判斷是否有特價資料 */}
                              {selectedProduct.price2 ? (
                                <>
                                  {/* 顯示特價並加強顯示 */}
                                  <p className="modal-product-price2">
                                    NT${selectedProduct.price2}/日
                                  </p>
                                  {/* 顯示劃掉的原價 */}
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
                                // 沒有特價則只顯示原價
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
                                  // 將 color_rgb 字串分割成陣列
                                  <div className="product-colors d-flex">
                                    {selectedProduct.color_rgb
                                      .split(",")
                                      .map((color, index) => (
                                        <span
                                          key={index}
                                          className="color-box rounded-circle mx-1 border"
                                          style={{
                                            backgroundColor: color.trim(), // 使用每個顏色值來設置背景顏色
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
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  onClick={() =>
                                    setQuantity((prev) =>
                                      prev > 1 ? prev - 1 : prev
                                    )
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
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
                                    if (
                                      !selectedProduct.stock ||
                                      quantity < selectedProduct.stock
                                    ) {
                                      setQuantity((prev) => prev + 1);
                                    }
                                  }}
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
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
                            <div className="booking-date mt-3">
                              <p className="fw-bold">預訂日期</p>
                              <input
                                type="text"
                                id="rentDateRange"
                                className="form-control"
                                placeholder="選擇日期區間"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>租借商品資訊載入中...</p>
                      )}
                    </div>

                    {/* 按鈕區 */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="cancel-button"
                        data-bs-dismiss="modal"
                      >
                        取消租借
                      </button>
                      <button type="button" className="confirm-button">
                        確認租借
                      </button>
                    </div>
                  </div>
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
                            src={product.img_url || "/image/rent/no-img.png"}
                            className="card-img-top product-img"
                            alt={product.name}
                            // layout="intrinsic"
                            width={124}
                            height={124}
                            style={{ objectFit: "contain" }}
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
                          <div className="icon-container d-flex flex-row justify-content-center align-items-center">
                            <div className="icon d-flex justify-content-center align-items-center">
                              <i className="bi bi-heart"></i>
                            </div>
                            <div
                              className="icon d-flex justify-content-center align-items-center"
                              onClick={(e) => handleIconClick(product, e)}
                            >
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
