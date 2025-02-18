"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import styles from "./products.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { FaRegCalendar } from "react-icons/fa";
import Calendar from "react-calendar";
import "./Calendar.css";

// API 基礎 URL
const API_BASE_URL = "http://localhost:3005/api";

export default function ProductList() {
    // 撈取資料
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDisplayDropdown, setShowDisplayDropdown] = useState(false);
    const [selectedSort, setSelectedSort] = useState({
        text: "排序",
        value: 1,
    });
    const [showClassification, setShowClassification] = useState(false);
    const [selectedDisplay, setSelectedDisplay] = useState("每頁顯示24件");
    const [showBrandClassification, setShowBrandClassification] =
        useState(false);
    const [location, setLocation] = useState("");
    const [country, setCountry] = useState("");

    // 分頁
    //parseInt 把字串轉成數字    || 負責設定預設值
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [limit, setLimit] = useState(
        parseInt(searchParams.get("limit")) || 24
    );
    const [totalPages, setTotalPages] = useState(1);
    // 可以放動畫 先不動
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 處理 URL 更新
    const updateURL = (newPage, newLimit, newSort, newLocation, newCountry) => {
        const params = new URLSearchParams();
        // 先確保變數不是 undefined，若是則設置默認值
        params.set("page", (newPage || 1).toString()); // 如果 newPage 是 undefined，則使用 1
        params.set("limit", (newLimit || 24).toString()); // 如果 newLimit 是 undefined，則使用 24
        params.set("sort", (newSort || 1).toString()); // 如果 newSort 是 undefined，則使用 1
        if (newLocation) {
            params.set("location", (newLocation || "").toString());
        } // 如果 newLocation 是 undefined，則使用空字串
        if (newCountry) {
            params.set("country", (newCountry || "").toString());
        }

        router.push(`/activity?${params.toString()}`, undefined, {
            shallow: true,
        });
    };

    // 獲取產品資料
    // FIXME: - 有依賴問題
    useEffect(() => {
        fetchActivity(page, limit, selectedSort.value, location); // 讓 API 依照當前排序方式請求
    }, [page, limit, selectedSort.value, location]); // 監聽 selectedSort.value

    // 每頁顯示按鈕
    const handleDisplayChange = (newLimit, displayText) => {
        setSelectedDisplay(displayText);
        setLimit(newLimit);
        setPage(1); // 切換顯示數量時重置為第一頁
        setShowDisplayDropdown(false); //關閉下拉選單
    };

    // 處理排序
    const handleSort = (text, value) => {
        setSelectedSort({ text, value });
        setShowDropdown(false); // 關閉下拉選單

        const sortedProducts = [...products];
        switch (value) {
            case 1: // 綜合
                sortedProducts.sort((a, b) => a.id - b.id);
                break;
            case 2: // 最新上架
                sortedProducts.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                break;
            case 3: // 價格：由低到高
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 4: // 價格：由高到低
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
        fetchActivity(page, limit, value);
        updateURL(page, limit, value); // ✅ 更新 URL
    };

    // TODO:處理活動地點篩選
    const handleLocation = () => {};

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

    const fetchActivity = async (
        currentPage,
        itemsPerPage,
        sortValue,
        location
    ) => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${API_BASE_URL}/activity?page=${currentPage}&limit=${itemsPerPage}&sort=${sortValue}&location=${location}`
            );
            console.log("API Response:", response.data);
            if (response.data.status === "success") {
                setProducts(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setPage(response.data.pagination.currentPage);
                updateURL(response.data.pagination.currentPage, itemsPerPage);
                console.log("API Response:", response.data.data);
            } else {
                setError("獲取活動資料失敗");
            }
        } catch (error) {
            console.error("Error fetching products:", error.response || error);
            setError("獲取活動資料時發生錯誤");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row">
                {/* 左側邊欄 */}
                <div className="col-lg-3 col-md-4">
                    <div className="d-grid ">
                        {/* 活動地點分類 */}
                        <div
                            className={`${styles.productClassification} ${styles.sideCard} ${styles.open}`}>
                            <div className={styles.cardTitle}>
                                <h5>活動地點</h5>
                                <i className="bi bi-chevron-down"></i>
                            </div>
                            <ul className={styles.classificationMenu}>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newCountry = 1;
                                            setCountry(newCountry);
                                            updateURL(
                                                page,
                                                limit,
                                                selectedSort.value,
                                                "",
                                                newCountry
                                            );
                                        }}>
                                        台灣
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 1;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                屏東
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 2;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                台東
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 3;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                澎湖
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 4;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                綠島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 5;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                蘭嶼
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 7;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                小琉球
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 8;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                其他
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleCategoryFilter("蛙鞋");
                                        // }}
                                    >
                                        日本
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 10;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                沖繩
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 11;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                石垣島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 12;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                其他
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleCategoryFilter("蛙鞋");
                                        // }}
                                    >
                                        菲律賓
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 13;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                長灘島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 14;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                宿霧
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 15;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                薄荷島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newLocation = 16;
                                                    setLocation(newLocation);
                                                    updateURL(
                                                        page,
                                                        limit,
                                                        selectedSort.value,
                                                        newLocation
                                                    );
                                                }}>
                                                其他
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleCategoryFilter("蛙鞋");
                                        // }}
                                    >
                                        其他
                                    </a>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newLocation = "";
                                            setLocation(newLocation);
                                            updateURL(
                                                page,
                                                limit,
                                                selectedSort.value,
                                                newLocation
                                            );
                                        }}>
                                        所有活動
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 活動篩選 */}
                        <form action="/activity" method="GET">
                            <div className={styles.sideCard}>
                                <div className={styles.cardTitle}>
                                    <h5>活動篩選</h5>
                                </div>
                                <div className={styles.filterSection}>
                                    {/* TODO: p2 證照資格篩選 */}
                                    {/* <div className={styles.filterTitle}>
                                    證照資格
                                </div>
                                <div className={styles.checkboxGroup}>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-leaders"
                                        />
                                        <label htmlFor="brand-leaders">
                                            無須證照 (4)
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-owd"
                                        />
                                        <label htmlFor="brand-owd">
                                            需OWD證照 (15)
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-aowd"
                                        />
                                        <label htmlFor="brand-aowd">
                                            需AOWD證照 (15)
                                        </label>
                                    </div>
                                </div> */}
                                    {/* TODO: 導覽語言這邊是不是要直接reduce然後做成陣列，就變成語言是活的，然後數量也比較好算？但可能要useEffect確保他只有在第一次載入時讀取，不然他會一直變動影響ui */}
                                    <div className={styles.filterTitle}>
                                        導覽語言
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="language-english"
                                                value="english"
                                                name="language"
                                            />
                                            <label htmlFor="language-english">
                                                英文 (4)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="language-chinese"
                                                value="chinese"
                                                name="language"
                                            />
                                            <label htmlFor="language-chinese">
                                                中文 (15)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="language-jp"
                                                value="japanese"
                                                name="language"
                                            />
                                            <label htmlFor="language-jp">
                                                日文 (15)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="language-korean"
                                                value="korean"
                                                name="language"
                                            />
                                            <label htmlFor="language-korean">
                                                韓文 (15)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="language-cantonese"
                                                value="cantonese"
                                                name="cantonese"
                                            />
                                            <label htmlFor="language-cantonese">
                                                廣東話 (15)
                                            </label>
                                        </div>
                                    </div>
                                    <div className={styles.filterTitle}>
                                        價格區間
                                    </div>
                                    <div className={styles.priceInputs}>
                                        <input
                                            type="number"
                                            placeholder="最低"
                                            className={styles.priceInput}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            placeholder="最高"
                                            className={styles.priceInput}
                                        />
                                    </div>
                                    <div className={styles.filterTitle}>
                                        行程時間
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="duration-less4"
                                                value="less4"
                                                name="duration"
                                            />
                                            <label htmlFor="duration-less4">
                                                少於4小時 (4)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="duration-4toDay"
                                                value="4toDay"
                                                name="duration"
                                            />
                                            <label htmlFor="duration-4toDay">
                                                4小時-1日 (15)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="oneToTwo"
                                                value="oneToTwo"
                                                name="duration"
                                            />
                                            <label htmlFor="oneToTwo">
                                                1日-2日 (15)
                                            </label>
                                        </div>
                                        <div className={styles.checkboxItem}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkbox}
                                                id="twoDaysUp"
                                                value="twoDaysUp"
                                                name="duration"
                                            />
                                            <label htmlFor="twoDaysUp">
                                                2日以上 (15)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 活動日期選擇 */}
                            <div className={styles.sideCard}>
                                <div className={styles.cardTitle}>
                                    <h5 className="d-flex gap-2 align-items-center">
                                        <FaRegCalendar />
                                        選擇出發日期
                                    </h5>
                                </div>
                                <div className="">
                                    <Calendar />
                                </div>
                            </div>

                            <button className="btn btn-primary w-100 mb-3">
                                套用篩選(0/20)
                            </button>
                        </form>

                        {/* 最新活動 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>最新活動</h5>
                            </div>
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={`new-${item}`}
                                    className={styles.sidebarProduct}>
                                    <div className={styles.sidebarProductImg}>
                                        <Image
                                            src="/images/1.webp"
                                            alt="最新活動"
                                            fill
                                            sizes="80px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={styles.sidebarProductInfo}>
                                        <div
                                            className={
                                                styles.sidebarProductBrand
                                            }>
                                            活動地點
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductTitle
                                            }>
                                            活動名稱
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductPrice
                                            }>
                                            NT$0000
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 特惠活動 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>特惠活動</h5>
                            </div>
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={`special-${item}`}
                                    className={styles.sidebarProduct}>
                                    <div className={styles.sidebarProductImg}>
                                        <Image
                                            src="/images/1.webp"
                                            alt="特惠活動"
                                            fill
                                            sizes="80px"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div className={styles.sidebarProductInfo}>
                                        <div
                                            className={
                                                styles.sidebarProductBrand
                                            }>
                                            活動地點
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductTitle
                                            }>
                                            活動名稱
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductPrice
                                            }>
                                            NT$0000
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 右側主要內容區 */}
                <div className="col-lg-9 col-md-8">
                    {/* 商品介紹 */}
                    <div className="mb-4">
                        <h3 className="mb-3">潛入藍色世界，追逐自由與夢想</h3>
                        <p className="mb-2">
                            歡迎來到我們的課程與活動專區，這裡匯集了潛水愛好者不可錯過的精彩體驗！從基礎潛水課程到進階技術培訓，還有刺激有趣的深海探險活動，我們為您精心設計每一項內容，確保安全與專業性兼具。無論您是剛開始接觸潛水還是已有豐富經驗，這裡都有適合您的選擇。
                        </p>
                        <p>
                            現在報名，還可享受獨家優惠：單次報名滿 $3000
                            即贈精美潛水紀念品，部分課程更有限時折扣活動！立即瀏覽，輕鬆找到專屬於您的潛水體驗，為下一次海底旅程做好準備。學習新技能、探索深海奧秘，就從這裡開始！
                        </p>
                    </div>

                    {/* 輪播圖 */}
                    <div
                        className="position-relative mb-4"
                        style={{ height: "188px", overflow: "hidden" }}>
                        <Image
                            src="/image/product-top-slide.png"
                            alt="潛水裝備橫幅"
                            priority
                            fill
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
                                onClick={() =>
                                    setShowDisplayDropdown(!showDisplayDropdown)
                                }>
                                {selectedDisplay}
                            </button>
                            <ul
                                className={`dropdown-menu ${
                                    showDisplayDropdown ? "show" : ""
                                }`}>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                24,
                                                "每頁顯示24件"
                                            )
                                        }>
                                        每頁顯示24件
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                48,
                                                "每頁顯示48件"
                                            )
                                        }>
                                        每頁顯示48件
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                72,
                                                "每頁顯示72件"
                                            )
                                        }>
                                        每頁顯示72件
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                onClick={() => setShowDropdown(!showDropdown)}>
                                <i className="bi bi-sort-down-alt me-2"></i>
                                {selectedSort.text}
                            </button>
                            <ul
                                className={`dropdown-menu ${
                                    showDropdown ? "show" : ""
                                }`}>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleSort("綜合", 1)}>
                                        綜合
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("最新上架", 2)
                                        }>
                                        最新上架
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("價格：由低到高", 3)
                                        }>
                                        價格：由低到高
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("價格：由高到低", 4)
                                        }>
                                        價格：由高到低
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleSort("商品評分最高", 5)
                                        }>
                                        商品評分最高
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 商品列表 */}
                    <div className="row g-4">
                        {products.map((activity) => (
                            <ProductCard key={activity.id} product={activity} />
                        ))}
                    </div>

                    {/* 分頁 */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div>
                            第{page}頁/共{totalPages}頁
                        </div>
                        <nav aria-label="Page navigation">
                            <ul className="pagination mb-0">
                                {/* 上一頁按鈕 */}
                                <li
                                    className={`page-item ${
                                        page === 1 ? "disabled" : ""
                                    }`}>
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={page === 1}>
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
                                        (pageNumber >= page - 1 &&
                                            pageNumber <= page + 1) // 當前頁的前後一頁
                                    ) {
                                        return (
                                            <li
                                                key={pageNumber}
                                                className={`page-item ${
                                                    page === pageNumber
                                                        ? "active"
                                                        : ""
                                                }`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setPage(pageNumber)
                                                    }>
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
                                            <li
                                                key={pageNumber}
                                                className="page-item disabled">
                                                <span className="page-link">
                                                    ...
                                                </span>
                                            </li>
                                        );
                                    }
                                    return null;
                                })}

                                {/* 下一頁按鈕 */}
                                <li
                                    className={`page-item ${
                                        page === totalPages ? "disabled" : ""
                                    }`}>
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setPage((prev) =>
                                                Math.min(prev + 1, totalPages)
                                            )
                                        }
                                        disabled={page === totalPages}>
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
