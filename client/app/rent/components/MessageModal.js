import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./MessageModal.css";

const MessageModal = ({ message, show, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [modalRoot, setModalRoot] = useState(null);

  // 建立 portal 容器
  useEffect(() => {
    const root = document.createElement("div");
    root.id = "modal-portal-root";
    document.body.appendChild(root);
    setModalRoot(root);
    return () => {
      if (document.body.contains(root)) { // 檢查 root 是否仍在 DOM 中
        document.body.removeChild(root);
      }
    };
  }, []);

  // 禁用背景內容的點擊事件
  useEffect(() => {
    const mainContent = document.body; // 直接禁用 body 的點擊事件
    if (show) {
      mainContent.classList.add("disable-interaction");
    } else {
      mainContent.classList.remove("disable-interaction");
    }
  }, [show]);

  // 處理關閉modal
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // 點擊背景遮罩本身時觸發動畫
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
    }
  };

  if (!modalRoot || !show) return null;

  return ReactDOM.createPortal(
    <div className="custom-message-modal">
      <div
        className={`modal-overlay ${isClosing ? "closing" : ""} ${isShaking ? "shake" : ""}`}
        onClick={handleOverlayClick} // 點擊背景遮罩時觸發動畫
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">DiveIn</h5>
            <button
              type="button"
              className="close-btn"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="confirm-btn" onClick={handleClose}>
              關閉
            </button>
          </div>
        </div>
      </div>
      ,
    </div>,
    modalRoot
  );
};

export default MessageModal;
