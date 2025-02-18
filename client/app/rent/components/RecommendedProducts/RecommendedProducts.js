// components/RecommendedProducts.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const RecommendedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // 從後端獲取推薦商品
  const fetchRecommendedProducts = async () => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

      const response = await fetch(`${API_BASE_URL}/api/rent/recommended`);
      if (!response.ok) {
        throw new Error("無法獲取推薦商品數據");
      }
      const result = await response.json(); // 解析後端返回的 JSON
      const data = result.data; // 提取 data 物件

      console.log("後端返回的推薦商品資料:", data); // 檢查資料結構
      setRecommendedProducts(data);
    } catch (err) {
      console.error("獲取推薦商品數據時發生錯誤:", err);
    }
  };

  // 初次加載時獲取推薦商品
  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  // 點擊時重新獲取推薦商品
  const handleRecommendationClick = () => {
    fetchRecommendedProducts();
  };

  return (
    <div className="col-12 d-flex flex-column mt-4 you-may-likes">
      <div className="you-may-like">
        <h3 className="you-may-like-title" onClick={handleRecommendationClick}>
          你可能會喜歡
        </h3>
      </div>
      <div className="row you-may-like-products">
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 you-may-like-product mb-4"
          >
            <div className="card border-0 h-100">
              <Image
                src={product.images[0]?.img_url || "/img/rent/no-img.png"}
                className="card-img-top product-img w-100"
                alt={product.name}
                width={148}
                height={148}
                layout="responsive"
                priority
                unoptimized
              />
              <div className="py-2 px-0 d-flex flex-column justify-content-start align-items-center card-body">
                <p className="product-brand">{product.brand_name || "未知品牌"}</p>
                <p className="product-name">{product.name}</p>
                <h6 className="product-price">NT ${product.price}</h6>
                {product.price2 && (
                  <h6 className="product-price2">NT ${product.price2}</h6>
                )}
                <div className="d-flex flex-row justify-content-center align-items-center product-color">
                  {product.specifications.map(
                    (spec, index) =>
                      spec.color_rgb && (
                        <span
                          key={index}
                          className="color-box"
                          style={{ backgroundColor: spec.color_rgb }}
                        ></span>
                      )
                  )}
                </div>

                {/* 右上角hover */}
                <div className="icon-container d-flex flex-row">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <i className="bi bi-heart"></i>
                  </div>
                  <div className="icon d-flex justify-content-center align-items-center">
                    <i className="bi bi-cart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;