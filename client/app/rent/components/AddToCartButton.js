import React, { useState, useRef } from "react"; // 確保導入 useRef
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
// import { FiShoppingCart } from "react-icons/fi"; // header 的購物車圖標
import FlyToCartAnimation from "./FlyToCartAnimation"; // 動畫組件

import "./AddToCartButton.css";

const AddToCartButton = ({ onClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef(null); // 用於獲取按鈕的位置

  const handleClick = async () => {
    const success = await onClick(); // 執行加入購物車的邏輯，並獲取返回值

    if (success && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const cartIcon = document.getElementById("cart-icon");
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();

        // 定義偏移值（可根據需求調整）
        const offsetStartY = 80; // 起點向上移動20px
        const offsetEndX = 5; // 終點向右移動10px
        const offsetEndY = 50; // 終點向上移動10px

        // 計算起點和終點的位置
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2 - offsetStartY;
        const endX = cartRect.left + cartRect.width / 2 + offsetEndX;
        const endY = cartRect.top + cartRect.height / 2 - offsetEndY;

        console.log("起點位置:", { startX, startY }); // 調試訊息
        console.log("終點位置:", { endX, endY }); // 調試訊息

        setIsAnimating({ startX, startY, endX, endY });
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="mybtn btn-cart flex-grow-1"
        onClick={handleClick}
        ref={buttonRef}
      >
        加入購物車
      </button>

      {isAnimating && (
        <FlyToCartAnimation
          startX={isAnimating.startX}
          startY={isAnimating.startY}
          endX={isAnimating.endX}
          endY={isAnimating.endY}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      )}
    </>
  );
};

export default AddToCartButton;
