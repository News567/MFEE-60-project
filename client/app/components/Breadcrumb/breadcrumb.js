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
    products: {
      "": "商品列表",
    },
    cart: {
      "": "購物車",
      create: "新增文章",
    },
    article: {
      "": "文章首頁", 
      list: "文章列表",
      detail: "文章詳情",
      create: "建立文章",
    },
  };
  };

  // 租借用：在商品詳情頁獲取商品名稱
  useEffect(() => {
    if (isProductDetail) {
      const fetchProductName = async () => {
        try {
          const API_BASE_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

          const response = await fetch(
            `${API_BASE_URL}/api/rent/${encodeURIComponent(lastSegment)}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          if (data.success && data.data) {
            const brandName = data.data.brand_name || "未知品牌";
            const productName = data.data.name || "暫無商品名稱";
            const formattedName = `${brandName} - ${productName}`;
            setProductName(formattedName); // 設定商品名稱
          } else {
            setProductName("未知品牌 - 暫無商品名稱"); // 如果 API 返回的數據不符合預期，顯示默認名稱
          }
        } catch (error) {
          console.error("Failed to fetch product name:", error);
          setProductName("未知品牌 - 暫無商品名稱"); // 如果請求失敗，顯示默認名稱
        }
      };
      fetchProductName();
    }
  }, [isProductDetail, lastSegment]);

    return (
        <div className="bread container d-none d-sm-block">
            <nav aria-label="breadcrumb">
                <ol className="m-0 breadcrumb breadcrumb-list">
                    <li className="breadcrumb-item">
                        <Link className="a" href="/">
                            首頁
                        </Link>
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
                  <span>{productName || `${lastSegment}`}</span>{" "}
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
