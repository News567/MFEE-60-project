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

// API 基礎 URL 
const API_BASE_URL = "http://localhost:3005/api";

export default function ProductList() {
    const [activities, setActivities] = useState([]);
    // console.log(API_BASE_URL + "/activity");
    useEffect(() => {
        const getList = async () => {
            await axios
                .get(API_BASE_URL + "/activity")
                .then((res) => {
                    if (res.data.status !== "success")
                        throw new Error("讀取資料失敗");
                    setActivities(res.data.data);
                })
                .catch((error) => {
                    console.error("載入活動失敗:", error);
                });
        };
        getList();
    }, []);
    useEffect(() => {
        console.log("資料更新:", activities);
    }, [activities]); // 當 activities 更新時才會執行 console.log

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
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleCategoryFilter("面鏡");
                                        // }}
                                    >
                                        台灣
                                    </a>
                                    <ul className={styles.submenu}>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
                                            >
                                                屏東
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
                                            >
                                                台東
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
                                            >
                                                澎湖
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
                                            >
                                                綠島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
                                            >
                                                蘭嶼
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
                                            >
                                                小琉球
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "自由潛水面鏡"
                                                //     );
                                                // }}
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
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
                                            >
                                                沖繩
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
                                            >
                                                石垣島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
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
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
                                            >
                                                長灘島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
                                            >
                                                宿霧
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
                                            >
                                                薄荷島
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href="#"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleCategoryFilter(
                                                //         "開放式蛙鞋"
                                                //     );
                                                // }}
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
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     handleCategoryFilter("蛙鞋");
                                        // }}
                                    >
                                        其他
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* 活動篩選 */}
                        <div className={styles.sideCard}>
                            <div className={styles.cardTitle}>
                                <h5>活動篩選</h5>
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
                                </div>
                                <div className={styles.filterTitle}>
                                    導覽語言
                                </div>
                                <div className={styles.checkboxGroup}>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="language-english"
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
                                        />
                                        <label htmlFor="language-jp">
                                            日文 (15)
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
                                        />
                                        <label htmlFor="duration-4toDay">
                                            4小時-1日 (15)
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-omer"
                                        />
                                        <label htmlFor="brand-omer">
                                            1日-2日 (15)
                                        </label>
                                    </div>
                                    <div className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            id="brand-omer"
                                        />
                                        <label htmlFor="brand-omer">
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
                            現在購物，還可享受獨家優惠：單筆滿 $3000
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
                                // onClick={() =>
                                //     setShowDisplayDropdown(!showDisplayDropdown)
                                // }
                            >
                                {/* {selectedDisplay} */}
                            </button>
                            <ul className={`dropdown-menu`}>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        // onClick={() =>
                                        //     handleDisplayChange(
                                        //         24,
                                        //         "每頁顯示24件"
                                        //     )
                                        // }
                                    >
                                        每頁顯示24件
                                    </button>
                                </li>
                                <li>
                                    {/* <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                48,
                                                "每頁顯示48件"
                                            )
                                        }>
                                        每頁顯示48件
                                    </button> */}
                                </li>
                                <li>
                                    {/* <button
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDisplayChange(
                                                72,
                                                "每頁顯示72件"
                                            )
                                        }>
                                        每頁顯示72件
                                    </button> */}
                                </li>
                            </ul>
                        </div>

                        <div className="dropdown">
                            <button
                                className="btn btn-outline-secondary dropdown-toggle"
                                // onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <i className="bi bi-sort-down-alt me-2"></i>
                                {/* {selectedSort.text} */}
                            </button>
                            <ul className={`dropdown-menu show`}>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        // onClick={() => handleSort("綜合", 1)}
                                    >
                                        綜合
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        // onClick={() =>
                                        //     handleSort("最新上架", 2)
                                        // }
                                    >
                                        最新上架
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        // onClick={() =>
                                        //     handleSort("價格：由低到高", 3)
                                        // }
                                    >
                                        價格：由低到高
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        // onClick={() =>
                                        //     handleSort("價格：由高到低", 4)
                                        // }
                                    >
                                        價格：由高到低
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        // onClick={() =>
                                        //     handleSort("商品評分最高", 5)
                                        // }
                                    >
                                        活動評分最高
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
                    <GroupCard />

                    {/* 分頁 */}
                </div>
            </div>
        </div>
    );
}
