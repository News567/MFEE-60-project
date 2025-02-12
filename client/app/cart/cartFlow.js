import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./cartFlow.css";

export default function CartFlow() {
  const stepRefs = useRef([]);
  const connectorRefs = useRef([]);

  useEffect(() => {
    // 🔹 讓步驟標記有明顯的水波擴散
    stepRefs.current.forEach((el) => {
      if (el) {
        gsap.fromTo(
          el,
          { boxShadow: "0 0 30px rgba(0, 123, 255, 0.3)", scale: 1 },
          {
            boxShadow:
              "0 0 60px rgba(0, 123, 255, 0.6), 0 0 100px rgba(0, 123, 255, 0.4)",
            scale: 1.3,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          }
        );
      }
    });

    // 🔹 讓連接線的水流動畫生效
    connectorRefs.current.forEach((el) => {
      if (el) {
        gsap.to(el, {
          backgroundPosition: "-200% 0",
          duration: 2,
          repeat: -1,
          ease: "linear",
        });
      }
    });
  }, []);

  return (
    <div className="cart-flow">
      {["確認購物車", "付款及運送方式", "完成訂購"].map((text, index) => (
        <div key={index} className="step-wrapper">
          {/* 步驟標記，確保漣漪動畫生效 */}
          <div
            className="step-badge"
            ref={(el) => (stepRefs.current[index] = el)}
          >
            {index + 1}
            <span className="wave-effect"></span> {/* 水波效果 */}
          </div>

          {/* 文字 */}
          <div className="step-text">{text}</div>

          {/* 連接線 (最後一個不顯示) */}
          {index < 2 && (
            <div
              className="step-connector flowing"
              ref={(el) => (connectorRefs.current[index] = el)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
