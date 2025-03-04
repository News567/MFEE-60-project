import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFishFins } from "@fortawesome/free-solid-svg-icons";

// import { FiShoppingCart } from "react-icons/fi"; // 導入 header 的購物車圖標
import "./FlyToCartAnimation.css";

// 水花效果組件
// 水花效果組件
const SplashEffect = ({ x, y, onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background: "rgba(33, 158, 188, 0.6)",
        zIndex: 10000, // 確保水花在最上層
      }}
      onAnimationComplete={onComplete}
    />
  );
};

const FlyToCartAnimation = ({ startX, startY, endX, endY, onAnimationEnd }) => {
  const [showSplash, setShowSplash] = useState(false); // 控制水花效果的顯示
  const [splashPosition, setSplashPosition] = useState({ x: 0, y: 0 }); // 水花的位置

  // 小魚動畫結束時觸發
  const handleFishAnimationComplete = () => {
    console.log("小魚動畫完成，觸發水花效果"); // 調試訊息
    console.log("小魚消失位置：", { endX, endY }); // 檢查小魚消失位置

    // 獲取購物車圖標的位置
    const cartIcon = document.getElementById("cart-icon");
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      console.log("購物車圖標位置：", cartRect); // 檢查購物車圖標位置

      // 設置水花的位置為購物車圖標的中心
      const splashX = cartRect.left + cartRect.width / 2;
      const splashY = cartRect.top + cartRect.height / 2;
      setSplashPosition({ x: splashX, y: splashY });
      console.log("水花位置設置為：", { x: splashX, y: splashY });
    } else {
      console.error("未找到購物車圖標元素");
    }

    // 顯示水花效果
    setShowSplash(true);
    console.log("showSplash 狀態已設置為 true"); // 確認狀態更新

    // 觸發外部回調
    onAnimationEnd();
  };

  // 水花動畫結束時觸發
  const handleSplashComplete = () => {
    console.log("水花動畫完成");
    // 水花動畫完成後隱藏水花
    setShowSplash(false);
  };

  // 調試：每次渲染時輸出 showSplash 的值
  useEffect(() => {
    console.log("渲染時 showSplash 的值：", showSplash);
    console.log("水花位置：", splashPosition); // 檢查水花位置
  }, [showSplash, splashPosition]);

  return ReactDOM.createPortal(
    <>
      {/* 小魚動畫 */}
      <motion.div
        initial={{ x: startX, y: startY, scale: 1, rotate: 0 }}
        animate={{
          x: [startX, startX + (endX - startX) * 0.1, endX, endX], // 水平方向的運動
          y: [startY, startY - 200, endY + 10, endY], // 垂直方向的拋物線運動
          rotate: [0, -30, 90], // 旋轉角度
          scale: [1, 1.5, 0.8, 1], // 跳躍縮放效果
          color: ["#219ebc", "#ffd500", "#219ebc"], // 顏色漸變
          opacity: [1, 1, 1, 0], // 到達終點後消失
        }}
        transition={{
          duration: 1.5,
          ease: [0.17, 0.67, 0.83, 0.67], // 自定義拋物線曲線
          type: "tween", // 使用 tween 動畫類型
        }}
        style={{
          position: "fixed",
          fontSize: "40px", // 增加圖標大小
          filter: "drop-shadow(0 0 16px rgba(33, 158, 188, 0.9))", // 添加更明顯的陰影
          zIndex: 9999, // 確保圖標在最上層
        }}
        onAnimationComplete={handleFishAnimationComplete} // 動畫結束後觸發回調
      >
        <FontAwesomeIcon icon={faFishFins} />
      </motion.div>

      {/* 水花效果 */}
      {showSplash && (
        <>
          {/* 多個水花元素 */}
          <SplashEffect
            key="splash1"
            x={splashPosition.x}
            y={splashPosition.y}
            onComplete={handleSplashComplete}
          />
          <SplashEffect
            key="splash2"
            x={splashPosition.x - 15}
            y={splashPosition.y - 15}
            onComplete={handleSplashComplete}
          />
          <SplashEffect
            key="splash3"
            x={splashPosition.x + 15}
            y={splashPosition.y + 15}
            onComplete={handleSplashComplete}
          />
        </>
      )}
    </>,
    document.body
  );
};

export default FlyToCartAnimation;
