// "use client";
// import "./RentDetailModal.css"
// import { useState } from "react";
// import ReactDOM from "react-dom";

// const RentDetailModal = ({ product, onClose }) => {
//   if (!product) return null;

//   return ReactDOM.createPortal(
//     <div className="modal-overlay">
//       <div className="modal">
//         <div className="modal-header">
//           <h2>{product.name}</h2>
//           <button onClick={onClose}>關閉</button>
//         </div>
//         <div className="modal-body">
//           <p>品牌：{product.brand_name || "未知"}</p>
//           <p>價格：NT$ {product.price} 元</p>
//         </div>
//       </div>
//     </div>,
//     document.body // 確保 Modal 渲染在 `body`
//   );
// };

// export default RentDetailModal;