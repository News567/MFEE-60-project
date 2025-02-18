"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Breadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean); // 分割網址並移除空值
  let fullPath = "";

  // 租借用：取得最後一個 segment，檢查是否為商品 ID
  const lastSegment = pathSegments[pathSegments.length - 1];
  const isProductDetail = pathname.includes("/rent/"); // 檢查是否為商品詳情頁
  const [productName, setProductName] = useState(null); // 用來存儲商品名稱

  // 在商品詳情頁獲取商品名稱
  useEffect(() => {
    if (isProductDetail) {
      const fetchProductName = async () => {
        const response = await fetch(`/api/rent?id=${lastSegment}`); // 使用 id 作為查詢參數
        const data = await response.json();
        if (data.success && data.data) {
          setProductName(data.data.name); // 設定商品名稱
        }
      };
      fetchProductName();
    }
  }, [isProductDetail, lastSegment]);

  // 麵包屑名稱對應表
  const breadcrumbNames = {
    activity: {
      "": "活動列表", // activity 主分類名稱
      detail: "活動詳情",
    },
    group: {
      "": "揪團首頁", // group 主分類名稱
      list: "揪團列表",
      detail: "揪團詳情",
      create: "創立新揪團",
    },
    rent: {
      "": "租借商品列表", // rent 主分類名稱
      list: "租借商商品詳情",
      detail: "",
    },
  };

  return (
    <div className="bread container d-none d-sm-block">
      <nav aria-label="breadcrumb">
        <ol className="m-0 breadcrumb breadcrumb-list">
          <li className="breadcrumb-item">
            <a className="a" href="#">
              首頁
            </a>
          </li>
          {pathSegments.map((segment, index) => {
            fullPath += `/${segment}`; // 累積完整路徑

            const parent = pathSegments[0];
            const label =
              breadcrumbNames[parent]?.[segment] ||
              breadcrumbNames[segment]?.[""] ||
              segment;
            const isLast = index === pathSegments.length - 1; // 是否是最後一個

            // 處理商品詳情頁面的名稱顯示
            if (isProductDetail && isLast) {
              return (
                <li key={index} className="breadcrumb-item active">
                  <span>{productName || `商品 ${lastSegment}`}</span>{" "}
                  {/* 顯示商品名稱 */}
                </li>
              );
            }

            return (
              <li
                key={index}
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
              >
                {isLast ? (
                  <span>{label}</span> // 最後一個是文字，不加連結
                ) : (
                  <Link className="a" href={fullPath}>
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
