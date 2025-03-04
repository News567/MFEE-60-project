"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import styles from "./products.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import GroupCard from "../_components/GroupCard";
import Calendar from "react-calendar";
import { FaRegCalendar } from "react-icons/fa";
import "./Calendar.css";

export default function GroupListPage() {
    // 設定揪團資料
    const [groups, setGroups] = useState([]);
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
    const [language, setLanguage] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [duration, setDuration] = useState("");
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
    // 處理排序
    const handleSort = (text, value) => {
        console.log("text:" + text, "value:" + value);
        setSelectedSort({ text, value });
        setShowDropdown(false); // 關閉下拉選單

        const sortedGroups = [...groups];
        switch (value) {
            case 1: // 綜合
            sortedGroups.sort((a, b) => a.id - b.id);
                break;
            case 2: // 最新上架
            sortedGroups.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                break;
            case 3: // 價格：由低到高
            sortedGroups.sort((a, b) => a.price - b.price);
                break;
            case 4: // 價格：由高到低
            sortedGroups.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }
    };
    // 每頁顯示按鈕
    const handleDisplayChange = (newLimit, displayText) => {
        setSelectedDisplay(displayText);
        setLimit(newLimit);
        setPage(1); // 切換顯示數量時重置為第一頁
        setShowDisplayDropdown(false); //關閉下拉選單
    };

    // 設定api路徑
    const api = "http://localhost:3005/api";

    // 連接後端獲取揪團資料
    useEffect(() => {
        const getList = async () => {
            await axios
                .get(api + "/group")
                .then((res) => {
                    // console.log(res.data.data);
                    setGroups(res.data.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getList();
    }, []);

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
                                    >
                                        台灣
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                屏東
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                台東
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                澎湖
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                綠島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                蘭嶼
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                小琉球
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                其他
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                    >
                                        日本
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                沖繩
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                石垣島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                其他
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                    >
                                        菲律賓
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                長灘島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                宿霧
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                薄荷島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                            >
                                                其他
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li
                                    className={`${styles.categoryItem} ${styles.hasSubmenu}`}>
                                    <a
                                        href="#"
                                    >
                                        其他
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 揪團篩選 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>揪團篩選</h5>
                            </div>
                            <div className={styles.filterSection}>
                                <div className={styles.filterTitle}>
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
                                            無須證照
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-owd"
                                        />
                                        <label htmlFor="brand-owd">
                                            需OWD證照
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-aowd"
                                        />
                                        <label htmlFor="brand-aowd">
                                            需AOWD證照
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.filterTitle}>
                                    揪團類型
                                </div>
                                <div className={styles.checkboxGroup}>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-leaders"
                                        />
                                        <label htmlFor="brand-leaders">
                                            浮潛
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-owd"
                                        />
                                        <label htmlFor="brand-owd">
                                            自由潛水
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-aowd"
                                        />
                                        <label htmlFor="brand-aowd">
                                            水肺潛水
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="type-other"
                                        />
                                        <label htmlFor="type-other">
                                            其他
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

                        {/* 最新揪團 */}
                        {/* <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>最新揪團</h5>
                            </div>
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={`new-${item}`}
                                    className={styles.sidebarProduct}>
                                    <div className={styles.sidebarProductImg}>
                                        <Image
                                            src="/image/1.webp"
                                            alt="最新揪團"
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
                                            揪團地點
                                        </div>
                                        <div
                                            className={
                                                styles.sidebarProductTitle
                                            }>
                                            揪團名稱
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
                        </div> */}

                    </div>
                </div>

                {/* 右側主要內容區 */}
                <div className="col-lg-9 col-md-8">
                    {/* 商品介紹 */}
                    <div className="mb-4">
                        <h3 className="mb-3">開團或參團就是這麼簡單</h3>
                        <p className="mb-2">
                            選擇喜歡的行程、確認細節，快速加入。從初次潛水的新手團，到進階技術挑戰和深海探險，隨時都有精彩行程等您來參與。
                        </p>
                        <p>
                            快來加入揪團，和志同道合的夥伴一起探索深藍世界吧！
                        </p>
                    </div>

                    {/* 輪播圖 */}
                    <div
                        className="position-relative mb-4"
                        style={{ height: "188px", overflow: "hidden" }}>
                        <Image
                            src="/image/group/product-top-slide.png"
                            alt="揪團橫幅"
                            priority
                            fill
                            style={{ objectFit: "cover" }}
                        />
                        <div className="position-absolute top-50 end-0 translate-middle-y pe-5">
                            <div className="text-end">
                                <h3 className="text-white mb-4">
                                    揪團出發，
                                    <br />
                                    一起開啟深海冒險新旅程！
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
                                className={`dropdown-menu ${showDisplayDropdown ? "show" : ""
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
                                className={`dropdown-menu ${showDropdown ? "show" : ""
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
                    {/* <div className="row g-4">
                        <ProductCard key="1" product="1" />
                    </div> */}
                    {/* <div className="row g-4">
                        {groups.map((group) => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div> */}
                    <div className="d-flex flex-column gap-3">
                        {groups && groups.length > 0 ? (
                            groups.map((group, i) => {
                                return (
                                    <Link className="text-black text-decoration-none" key={i} href={`/group/list/${group.id}`}>
                                        <GroupCard group={group} />
                                    </Link>
                                );
                            })
                        ) : (
                            <div>沒有相關資料</div>
                        )}
                    </div>


                    {/* 分頁 */}
                </div>
            </div>
        </div>
    );
}
