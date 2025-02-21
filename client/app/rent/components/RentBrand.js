import { useState } from "react";
import "./RentBrand.css";
import "../../../public/globals.css";

const RentBrand = ({ brands }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 控制品牌專區的展開/收起
  const [hoveredLetter, setHoveredLetter] = useState(null); // 記錄當前 hover 的字母

  console.log("Brands data:", brands); // 檢查 brands 資料

  // 將品牌按照字母分類
  const categorizeBrands = (brands) => {
    const categorizedBrands = {};

    brands.forEach((brand) => {
      const firstLetter = brand.brand_name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstLetter)) {
        if (!categorizedBrands[firstLetter]) {
          categorizedBrands[firstLetter] = [];
        }
        categorizedBrands[firstLetter].push(brand);
      } else {
        if (!categorizedBrands["其他"]) {
          categorizedBrands["其他"] = [];
        }
        categorizedBrands["其他"].push(brand);
      }
    });

    return categorizedBrands;
  };

  const categorizedBrands = categorizeBrands(brands);

  console.log("Categorized brands:", categorizedBrands); // 檢查 categorizedBrands

  return (
    <div className="rent-brand">
      {/* 品牌專區標題 */}
      <div
        className="rent-brand-header"
        onClick={() => setIsExpanded(!isExpanded)} // 點擊時切換展開/收起
        style={{ cursor: "pointer" }}
      >
        <h6>品牌專區</h6>
        <i
          className={`bi bi-chevron-down ${isExpanded ? "rotate" : ""}`}
          style={{ transition: "transform 0.3s" }}
        ></i>
      </div>

      {/* 字母分類列表 */}
      {isExpanded && (
        <ul className="brand-letter-list">
          {Object.keys(categorizedBrands).map((letter) => (
            <li
              key={letter}
              onMouseEnter={() => setHoveredLetter(letter)} // 滑鼠懸停時設置 hoveredLetter
              onMouseLeave={() => setHoveredLetter(null)} // 滑鼠離開時清除 hoveredLetter
            >
              {letter}
              {/* 顯示 hover 的品牌名稱 */}
              {hoveredLetter === letter && (
                <div className="brand-names-popup">
                  {categorizedBrands[letter].map((brand) => (
                    <div key={brand.brand_id} className="brand-name">
                      {brand.brand_name}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RentBrand;