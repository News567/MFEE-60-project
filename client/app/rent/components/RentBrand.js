import { useState, useEffect, useMemo } from "react";
import "./RentBrand.css"; // 品牌專區 CSS
import "../../../public/globals.css";

const RentBrand = ({ setSelectedBrand, setSelectedBrandCategoryText }) => {
  const [brands, setBrands] = useState([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null); // 當前選擇的字母
  const [hoveredLetter, setHoveredLetter] = useState(null); // 用於 hover 時顯示品牌小分類

  // 從後端獲取品牌資料
  useEffect(() => {
    fetch("http://localhost:3005/api/rent/brandcategories")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBrands(data.data);
        } else {
          console.error("API 返回資料格式錯誤", data);
          setBrands([]);
        }
      })
      .catch((error) => {
        console.error("獲取品牌資料時出錯:", error);
        setBrands([]);
      });
  }, []);

  // 將品牌按字母分類
  const categorizeBrands = (brands) => {
    const categoryMap = {
      A: "A",
      B: "B、C、D",
      C: "B、C、D",
      D: "B、C、D",
      E: "E、F、G、H、I",
      F: "E、F、G、H、I",
      G: "E、F、G、H、I",
      H: "E、F、G、H、I",
      I: "E、F、G、H、I",
      L: "L、M、N",
      M: "L、M、N",
      N: "L、M、N",
      O: "O、P、R",
      P: "O、P、R",
      R: "O、P、R",
      S: "S",
      T: "T、V、W",
      V: "T、V、W",
      W: "T、V、W",
    };

    const categories = {
      "A": [],
      "B、C、D": [],
      "E、F、G、H、I": [],
      "L、M、N": [],
      "O、P、R": [],
      "S": [],
      "T、V、W": [],
      "其他": [],
    };

    brands.forEach((brand) => {
      const firstLetter = brand.brand_name.charAt(0).toUpperCase();
      const category = categoryMap[firstLetter] || "其他";
      categories[category].push(brand);
    });

    return categories;
  };

  const categorizedBrands = useMemo(() => categorizeBrands(brands), [brands]);

  const handleBrandSelect = (brand) => {
    console.log("點擊品牌小分類，傳遞的 brand_id:", brand.brand_id); // 調試訊息
    setSelectedBrand(brand.brand_id); // 傳遞 brand_id
    setSelectedBrandCategoryText(`品牌：${brand.brand_name}`); // 更新品牌文字
  };

  const handleLetterClick = (letter) => {
    console.log("點擊字母大分類，傳遞的分類:", letter); // 調試訊息
    setSelectedLetter(selectedLetter === letter ? null : letter); // 切換選中的字母大分類
    setSelectedLetter(letter); // 更新父組件的字母狀態
  };

  return (
    <div className="d-flex flex-column sidebar-lists rent-brand">
      {/* 品牌專區標題 */}
      <div
        className={`d-flex justify-content-between align-items-center sidebar-lists-title ${
          showBrandDropdown ? "open" : ""
        }`}
        onClick={() => setShowBrandDropdown(!showBrandDropdown)}
        style={{ cursor: "pointer" }}
      >
        <h6>品牌專區</h6>
        <i className="bi bi-chevron-down"></i>
      </div>

      {/* 品牌分類區塊 */}
      {showBrandDropdown && (
        <div className="sidebar-dropdown">
          {Object.keys(categorizedBrands).map((letter) => (
            <div
              key={letter}
              className={`sidebar-dropdown-item ${
                selectedLetter === letter ? "selected" : ""
              }`}
              onClick={() => handleLetterClick(letter)} // 點擊字母大分類
              onMouseEnter={() => setHoveredLetter(letter)}
              onMouseLeave={() => setHoveredLetter(null)}
            >
              {letter}

              {/* 顯示品牌小分類 */}
              {(selectedLetter === letter || hoveredLetter === letter) && (
                <div className="small-category-dropdown">
                  {categorizedBrands[letter].map((brand) => (
                    <div
                      key={brand.brand_id}
                      className="small-category-dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrandSelect(brand); // 點擊品牌小分類
                      }}
                    >
                      {brand.brand_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentBrand;