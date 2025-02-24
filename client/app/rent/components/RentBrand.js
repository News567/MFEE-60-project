// import { useState, useEffect, useMemo } from "react";
// import "./RentBrand.css"; // 品牌專區 CSS
// import "../../../public/globals.css";

// const RentBrand = ({
//   setSelectedBrand,
//   setSelectedBrandCategoryText,
//   selectedLetter, // 從父組件傳遞的 selectedLetter
//   setSelectedLetter, // 從父組件傳遞的 setSelectedLetter
// }) => {
//   const [brands, setBrands] = useState([]);
//   const [showBrandDropdown, setShowBrandDropdown] = useState(false);
//   const [hoveredLetter, setHoveredLetter] = useState(null); // 用於 hover 時顯示品牌小分類
//   const [allBrands, setAllBrands] = useState([]); // 確保這一行存在

//   // 從後端獲取品牌資料
//   useEffect(() => {
//     fetch("http://localhost:3005/api/rent/brandcategories")
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success && Array.isArray(data.data)) {
//           setBrands(data.data);
//           setAllBrands(data.data); // 將資料存儲到 allBrands
//         } else {
//           console.error("API 返回資料格式錯誤", data);
//           setBrands([]);
//           setAllBrands([]); // 如果資料格式錯誤，清空 allBrands
//         }
//       })
//       .catch((error) => {
//         console.error("獲取品牌資料時出錯:", error);
//         setBrands([]);
//         setAllBrands([]); // 如果請求失敗，清空 allBrands
//       });
//   }, []);

//   // 將品牌按字母分類
//   const categorizeBrands = (brands) => {
//     const categoryMap = {
//       A: "A",
//       B: "B、C、D",
//       C: "B、C、D",
//       D: "B、C、D",
//       E: "E、F、G、H、I",
//       F: "E、F、G、H、I",
//       G: "E、F、G、H、I",
//       H: "E、F、G、H、I",
//       I: "E、F、G、H、I",
//       L: "L、M、N",
//       M: "L、M、N",
//       N: "L、M、N",
//       O: "O、P、R",
//       P: "O、P、R",
//       R: "O、P、R",
//       S: "S",
//       T: "T、V、W",
//       V: "T、V、W",
//       W: "T、V、W",
//     };

//     const categories = {
//       A: [],
//       "B、C、D": [],
//       "E、F、G、H、I": [],
//       "L、M、N": [],
//       "O、P、R": [],
//       S: [],
//       "T、V、W": [],
//       其他: [],
//     };

//     brands.forEach((brand) => {
//       const firstLetter = brand.brand_name.charAt(0).toUpperCase();
//       let letter = "其他"; // 默認為「其他」

//       // 檢查品牌的第一個字母是否屬於某個合併分類
//       if (firstLetter === "A") {
//         letter = "A";
//       } else if (["B", "C", "D"].includes(firstLetter)) {
//         letter = "B、C、D";
//       } else if (["E", "F", "G", "H", "I"].includes(firstLetter)) {
//         letter = "E、F、G、H、I";
//       } else if (["L", "M", "N"].includes(firstLetter)) {
//         letter = "L、M、N";
//       } else if (["O", "P", "R"].includes(firstLetter)) {
//         letter = "O、P、R";
//       } else if (firstLetter === "S") {
//         letter = "S";
//       } else if (["T", "V", "W"].includes(firstLetter)) {
//         letter = "T、V、W";
//       }

//       if (!categories[letter]) {
//         categories[letter] = [];
//       }
//       categories[letter].push(brand);
//     });

//     return categories;
//   };

//   const categorizedBrands = useMemo(() => categorizeBrands(brands), [brands]);

//   const handleBrandSelect = (brand) => {
//     console.log("點擊品牌小分類，傳遞的 brand_id:", brand.brand_id);
//     setSelectedBrand(brand.brand_id); // 傳遞 brand_id

//     // 動態獲取品牌對應的字母分類
//     const firstLetter = brand.brand_name.charAt(0).toUpperCase();
//     const letter = categoryMap[firstLetter] || "其他"; 

//     setSelectedLetter(letter); // 更新選中的字母大分類
//     setSelectedBrandCategoryText(
//       `字母分類：${letter} > 品牌：${brand.brand_name}`
//     ); // 更新品牌文字
//   };

//   // 處理字母大分類點擊
//   const handleLetterClick = (letter) => {
//     console.log("allBrands:", allBrands); // 調試信息
//     if (!allBrands) {
//       console.error("allBrands 未定義");
//       return;
//     }

//     // 根據 letter 過濾品牌列表
//     const filteredBrands = allBrands.filter((brand) => {
//       const firstLetter = brand.brand_name.charAt(0).toUpperCase();
//       if (letter === "B、C、D") {
//         return ["B", "C", "D"].includes(firstLetter);
//       } else if (letter === "E、F、G、H、I") {
//         return ["E", "F", "G", "H", "I"].includes(firstLetter);
//       } else if (letter === "L、M、N") {
//         return ["L", "M", "N"].includes(firstLetter);
//       } else if (letter === "O、P、R") {
//         return ["O", "P", "R"].includes(firstLetter);
//       } else if (letter === "T、V、W") {
//         return ["T", "V", "W"].includes(firstLetter);
//       } else {
//         return firstLetter === letter;
//       }
//     });

//     setBrands(filteredBrands);
//     setSelectedLetter(selectedLetter === letter ? null : letter); // 切換選中的字母大分類
//     setSelectedBrandCategoryText(`字母分類：${letter}`);
//   };

//   return (
//     <div className="d-flex flex-column sidebar-lists rent-brand">
//       {/* 品牌專區標題 */}
//       <div
//         className={`d-flex justify-content-between align-items-center sidebar-lists-title ${
//           showBrandDropdown ? "open" : ""
//         }`}
//         onClick={() => setShowBrandDropdown(!showBrandDropdown)}
//         style={{ cursor: "pointer" }}
//       >
//         <h6>品牌專區</h6>
//         <i className="bi bi-chevron-down"></i>
//       </div>

//       {/* 品牌分類區塊 */}
//       {showBrandDropdown && (
//         <div className="sidebar-dropdown">
//           {Object.keys(categorizedBrands).map((letter) => (
//             <div
//               key={letter}
//               className={`sidebar-dropdown-item ${
//                 selectedLetter === letter ? "selected" : ""
//               }`}
//               onClick={() => handleLetterClick(letter)} // 點擊字母大分類
//               onMouseEnter={() => setHoveredLetter(letter)}
//               onMouseLeave={() => setHoveredLetter(null)}
//             >
//               {letter}

//               {/* 顯示品牌小分類 */}
//               {(selectedLetter === letter || hoveredLetter === letter) && (
//                 <div className="small-category-dropdown">
//                   {categorizedBrands[letter].map((brand) => (
//                     <div
//                       key={brand.brand_id}
//                       className="small-category-dropdown-item"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleBrandSelect(brand); // 點擊品牌小分類
//                       }}
//                     >
//                       {brand.brand_name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RentBrand;

import { useState, useEffect, useMemo } from "react";
import "./RentBrand.css"; // 品牌專區 CSS
import "../../../public/globals.css";

const RentBrand = ({
  setSelectedBrand,
  setSelectedBrandCategoryText,
  selectedLetter, // 從父組件傳遞的 selectedLetter
  setSelectedLetter, // 從父組件傳遞的 setSelectedLetter
}) => {
  const [brands, setBrands] = useState([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState(null); // 用於 hover 時顯示品牌小分類
  const [allBrands, setAllBrands] = useState([]); // 確保這一行存在

  // 定義 categoryMap
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

  // 從後端獲取品牌資料
  useEffect(() => {
    fetch("http://localhost:3005/api/rent/brandcategories")
      .then((response) => response.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBrands(data.data);
          setAllBrands(data.data); // 將資料存儲到 allBrands
        } else {
          console.error("API 返回資料格式錯誤", data);
          setBrands([]);
          setAllBrands([]); // 如果資料格式錯誤，清空 allBrands
        }
      })
      .catch((error) => {
        console.error("獲取品牌資料時出錯:", error);
        setBrands([]);
        setAllBrands([]); // 如果請求失敗，清空 allBrands
      });
  }, []);

  // 將品牌按字母分類
  const categorizeBrands = (brands) => {
    const categories = {
      A: [],
      "B、C、D": [],
      "E、F、G、H、I": [],
      "L、M、N": [],
      "O、P、R": [],
      S: [],
      "T、V、W": [],
      其他: [],
    };

    brands.forEach((brand) => {
      const firstLetter = brand.brand_name.charAt(0).toUpperCase();
      let letter = "其他"; // 默認為「其他」

      // 檢查品牌的第一個字母是否屬於某個合併分類
      if (firstLetter === "A") {
        letter = "A";
      } else if (["B", "C", "D"].includes(firstLetter)) {
        letter = "B、C、D";
      } else if (["E", "F", "G", "H", "I"].includes(firstLetter)) {
        letter = "E、F、G、H、I";
      } else if (["L", "M", "N"].includes(firstLetter)) {
        letter = "L、M、N";
      } else if (["O", "P", "R"].includes(firstLetter)) {
        letter = "O、P、R";
      } else if (firstLetter === "S") {
        letter = "S";
      } else if (["T", "V", "W"].includes(firstLetter)) {
        letter = "T、V、W";
      }

      if (!categories[letter]) {
        categories[letter] = [];
      }
      categories[letter].push(brand);
    });

    return categories;
  };

  const categorizedBrands = useMemo(() => categorizeBrands(brands), [brands]);

  const handleBrandSelect = (brand) => {
    console.log("點擊品牌小分類，傳遞的 brand_id:", brand.brand_id);
    console.log("品牌名稱:", brand.brand_name);

    // 調用父組件傳遞的函數
    setSelectedBrand(brand.brand_id); // 傳遞 brand_id
    setSelectedBrandCategoryText(`品牌：${brand.brand_name}`); // 更新品牌文字
  };

  // 處理字母大分類點擊
  const handleLetterClick = (letter) => {
    console.log("allBrands:", allBrands); // 調試信息
    if (!allBrands) {
      console.error("allBrands 未定義");
      return;
    }

    // 根據 letter 過濾品牌列表
    const filteredBrands = allBrands.filter((brand) => {
      const firstLetter = brand.brand_name.charAt(0).toUpperCase();
      if (letter === "B、C、D") {
        return ["B", "C", "D"].includes(firstLetter);
      } else if (letter === "E、F、G、H、I") {
        return ["E", "F", "G", "H", "I"].includes(firstLetter);
      } else if (letter === "L、M、N") {
        return ["L", "M", "N"].includes(firstLetter);
      } else if (letter === "O、P、R") {
        return ["O", "P", "R"].includes(firstLetter);
      } else if (letter === "T、V、W") {
        return ["T", "V", "W"].includes(firstLetter);
      } else {
        return firstLetter === letter;
      }
    });

    setBrands(filteredBrands);
    setSelectedLetter(selectedLetter === letter ? null : letter); // 切換選中的字母大分類
    setSelectedBrandCategoryText(`字母分類：${letter}`);
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
                        e.stopPropagation(); // 阻止事件冒泡
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