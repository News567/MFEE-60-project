"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SocialToolbar() {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const thumbnailListRef = useRef(null);
  const itemHeight = 48; // 40px高度 + 8px間距

  // 瀏覽紀錄
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("browsingHistory")) || [];
    setHistoryItems(storedHistory);
  }, []);

  useEffect(() => {
    if (thumbnailListRef.current) {
      const containerHeight = 140; // thumbnails-container 的高度
      const totalHeight = thumbnailListRef.current.scrollHeight;
      setMaxScroll(Math.max(0, totalHeight - containerHeight));
    }
  }, []);

  const handleScroll = (direction) => {
    const step = itemHeight;
    let newPosition;

    if (direction === "up") {
      newPosition = Math.max(0, currentPosition - step);
    } else {
      newPosition = Math.min(maxScroll, currentPosition + step);
    }

    setCurrentPosition(newPosition);
  };

  //清除紀錄
  const handleClearHistory = () => {
    localStorage.removeItem("browsingHistory");
    setHistoryItems([]);
  };

  return (
    <div className="main-toolbar d-none d-lg-flex">
      {/* 社交按鈕組 */}
      <div className="social-group">
        <button className="social-btn">
          <i className="fab fa-facebook-f text-primary"></i>
        </button>
        <button className="social-btn">
          <i className="fab fa-instagram text-danger"></i>
        </button>
        <button className="social-btn">
          <i className="fas fa-store text-dark"></i>
        </button>
      </div>

      {/* 歷史記錄面板 */}
      <div className="history-panel d-flex flex-column justify-content-between">
        <button
          className="scroll-arrow up"
          onClick={() => handleScroll("up")}
          disabled={currentPosition <= 0}
        >
          <i className="fas fa-chevron-up fa-lg"></i>
        </button>

        <div className="thumbnails-container">
          <ul
            className="thumbnail-list"
            ref={thumbnailListRef}
            style={{
              transform: `translateY(-${currentPosition}px)`,
              transition: "transform 0.3s ease",
            }}
          >
            {historyItems.map((item, index) => (
              <Link href={`/products/${item.id}`} key={index}>
                <li className="thumbnail-item">
                  <img src={`/img/product/${item.image}`} alt={item.name} />
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <button
          className="scroll-arrow down"
          onClick={() => handleScroll("down")}
          disabled={currentPosition >= maxScroll}
        >
          <i className="fas fa-chevron-down fa-lg"></i>
        </button>
      </div>

      <div className="clear-btn" onClick={handleClearHistory}>
        清除記錄
      </div>
    </div>
  );
}
