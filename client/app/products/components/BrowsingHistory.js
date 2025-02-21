"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BrowsingHistory() {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("browsingHistory")) || [];
    setHistoryItems(storedHistory);
  }, []);

  if (historyItems.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-center mb-4">瀏覽記錄</h3>
      <div className="position-relative">
        {/* 左箭頭 - 在手機版隱藏 */}
        <div className="col-auto d-none d-md-block position-absolute start-0 top-50 translate-middle-y">
          <i className="fa-solid fa-angle-left fa-2x text-secondary"></i>
        </div>

        {/* 商品清單區塊 */}
        <div className="products-slider">
          <div className="products-track">
            {historyItems.map((item, index) => (
              <div key={index} className="product-slide">
                <Link
                  href={`/products/${item.id}`}
                  className="text-decoration-none"
                >
                  <div
                    className="product-img mb-2 position-relative"
                    style={{ paddingTop: "100%" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="button-group">
                      <button
                        className="like-button"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fa-heart fa-solid text-danger"></i>
                      </button>
                      <button
                        className="cart-button"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fa-solid fa-cart-shopping text-primary"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="fw-bold text-truncate text-dark">
                      {item.name}
                    </div>
                    <div className="text-danger fw-bold">NT${item.price}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 右箭頭 - 在手機版隱藏 */}
        <div className="col-auto d-none d-md-block position-absolute end-0 top-50 translate-middle-y">
          <i className="fa-solid fa-angle-right fa-2x text-secondary"></i>
        </div>
      </div>
    </div>
  );
}
