"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";

const API_BASE_URL = "http://localhost:3005/api";

export default function RecommendedProducts() {
  const params = useParams();
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // 先獲取當前商品的分類
        const productResponse = await axios.get(
          `${API_BASE_URL}/products/${params.id}`
        );

        if (productResponse.data.status === "success") {
          const currentProduct = productResponse.data.data;

          // 使用現有的 products API 獲取同分類商品
          const recommendedResponse = await axios.get(
            `${API_BASE_URL}/products`,
            {
              params: {
                category_id: currentProduct.category_id,
                limit: 8,
                page: 1,
              },
            }
          );

          if (recommendedResponse.data.status === "success") {
            // 過濾掉當前商品
            const filteredProducts = recommendedResponse.data.data
              .filter((p) => p.id !== currentProduct.id)
              .map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description || "",
                imgSrc: p.main_image,
                salePrice: `NT$${p.price}`,
                originalPrice: p.original_price ? `NT$${p.original_price}` : "",
              }));

            setRecommendedProducts(filteredProducts);
          }
        }
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };

    if (params.id) {
      fetchRecommendedProducts();
    }
  }, [params.id]);

  if (recommendedProducts.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-center mb-4">你可能會喜歡</h3>
      <div className="position-relative">
        {/* 左箭頭 - 在手機版隱藏 */}
        <div className="col-auto d-none d-md-block position-absolute start-0 top-50 translate-middle-y">
          <i className="fa-solid fa-angle-left fa-2x text-secondary"></i>
        </div>

        {/* 商品清單區塊 */}
        <div className="products-slider">
          <div className="products-track">
            {recommendedProducts.map((product, index) => (
              <div key={index} className="product-slide">
                <div className="product-img mb-2 position-relative">
                  <Image
                    src={`/img/product/${product.imgSrc}`}
                    alt={product.name}
                    width={200}
                    height={200}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                  <div className="button-group">
                    <button className="like-button">
                      <i className="fa-heart fa-solid text-danger"></i>
                    </button>
                    <button className="cart-button">
                      <i className="fa-solid fa-cart-shopping text-primary"></i>
                    </button>
                  </div>
                </div>
                <div>
                  <div className="fw-bold text-truncate">{product.name}</div>
                  <div className="text-muted text-truncate">
                    {product.description}
                  </div>
                  <div className="text-danger fw-bold">{product.salePrice}</div>
                  {product.originalPrice && (
                    <div className="text-decoration-line-through text-secondary">
                      {product.originalPrice}
                    </div>
                  )}
                </div>
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
