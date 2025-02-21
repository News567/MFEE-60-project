// "use client";

// import { useEffect, useState } from "react"; // useState 儲存從後端獲取的資料，並使用 useEffect 在組件加載時發送請求
// import Image from "next/image";
// import "./RentList.css";
// import "../../../public/globals.css";

// export default function RentList() {
//   const [categories, setCategories] = useState([]); // 存儲分類數據
//   const [isCategoryOpen, setIsCategoryOpen] = useState(false); // 控制分類區塊的展開/收起狀態

//   // 從後端獲取分類數據
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const API_BASE_URL =
//           process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";
//         const response = await fetch(`${API_BASE_URL}/api/categories`);
//         if (!response.ok) {
//           throw new Error("無法獲取分類數據");
//         }
//         const data = await response.json();
//         setCategories(data);
//       } catch (error) {
//         console.error("獲取分類數據失敗:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className="col-12 col-lg-3 col-md-4 order-2 order-md-1 d-flex flex-column sidebar">
//       {/* 產品分類區塊 */}
//       <div className="d-flex flex-column sidebar-lists product-category">
//         {/* 分類標題 */}
//         <div
//           className="d-flex justify-content-between align-items-center sidebar-lists-title"
//           onClick={() => setIsCategoryOpen(!isCategoryOpen)} // 點擊時切換展開/收起狀態
//           style={{ cursor: "pointer" }} // 設置滑鼠指針樣式
//         >
//           <h6>產品分類</h6>
//           <i
//             className={`bi bi-chevron-down ${
//               isCategoryOpen ? "rotate-180" : ""
//             }`} // 根據狀態旋轉箭頭
//           ></i>
//         </div>

//         {/* 分類內容 */}
//         {isCategoryOpen && ( // 根據狀態決定是否顯示分類內容
//           <div className="product-category-content">
//             {categories.map((category) => (
//               <ul
//                 key={category.id}
//                 className="list-unstyled d-flex justify-content-between align-items-center"
//               >
//                 {category.category_big}
//                 <i className="bi bi-chevron-down"></i>
//               </ul>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* 其他 Sidebar 內容 */}
//       {/* ... */}
//     </div>
//   );
// }
