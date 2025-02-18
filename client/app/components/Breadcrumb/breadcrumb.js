"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Breadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean); // 分割網址並移除空值
    let fullPath = "";

    // 麵包屑名稱對應表
    const breadcrumbNames = {
        activity: {
            "": "活動列表", // activity 主分類名稱
            detail: "活動詳情",
        },
        group: {
            "": "揪團首頁", // group 主分類名稱
            list:"揪團列表",
            detail: "揪團詳情",
            create: "創立新揪團",
        },
        rent:{
            "":"租賃列表",
        },
        product:{
            "":"商品列表"
        },
        cart:{
            "":"購物車",
            "create":"新增文章"
        }
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
                        const label = breadcrumbNames[parent]?.[segment] || breadcrumbNames[segment]?.[""] || segment;
                        const isLast = index === pathSegments.length - 1; // 是否是最後一個

                        return (
                            <li key={index} className={`breadcrumb-item ${isLast ? "active" : ""}`}>
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
