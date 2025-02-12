"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import "./ProductDetail.css";
import ProductReviews from "./ProductReviews";
import BrowsingHistory from "./BrowsingHistory";
import RecommendedProducts from "./RecommendedProducts";
import SocialToolbar from "./SocialToolbar";
import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";
// API 基礎 URL
const API_BASE_URL = "http://localhost:3005/api";
export default function ProductDetail() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(params.id);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productId = Number(params.id);
        if (!productId) {
          setError("無效的商品 ID");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/products/${productId}`
        );

        if (response.data.status === "success" && response.data.data) {
          const productData = response.data.data;
          setProduct(productData);

          // 設置默認選中的尺寸和顏色
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0].name);
          }

          // 根據選擇的顏色和尺寸更新庫存和價格
          const variant = productData.variants.find(
            (v) =>
              v.color_id === productData.colors[0]?.id &&
              v.size_id === productData.sizes[0]?.id
          );
          if (variant) {
            setQuantity(Math.min(quantity, variant.stock));
          }
        } else {
          setError("找不到商品");
        }
      } catch (err) {
        console.error("獲取商品詳情失敗:", err);
        setError(err.response?.data?.message || "商品獲取失敗");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (loading) return <div>...</div>;
  if (error) return <div>錯誤 {error}</div>;
  if (!product) return <div>未找到商品</div>;

  return (
    <div className="container">
      <div className="row">
        {/* 左側產品圖片 */}
        <div className="col-md-6">
          <div className="product-img">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              priority
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>
          <div className="d-flex justify-content-evenly mt-3">
            {product.images.map((image, index) => (
              <div key={index} className="box">
                <Image
                  src={image}
                  alt={`${product.name}-${index + 1}`}
                  width={100}
                  height={100}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 右側產品訊息 */}
        <div className="col-md-6">
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="fw-bold text-secondary mb-0">
                {product.brand_name}
              </h3>
              <div className="d-flex gap-2">
                <button className="btn p-0">
                  <i className="fa-solid fa-share-from-square fs-4"></i>
                </button>
                <button
                  className="btn p-0"
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                >
                  {isFavorite ? (
                    <AiFillHeart color="red" size={24} />
                  ) : (
                    <AiOutlineHeart size={24} />
                  )}
                </button>
              </div>
            </div>
            <h2>{product.name}</h2>
            <hr />
            <h2 className="text-primary">NT${product.price}</h2>

            <h5 className="text-secondary text-decoration-line-through">
              NT${product.original_price}
            </h5>

            <div className="mb-2">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`fa-${
                    index < Math.floor(product.rating) ? "solid" : "regular"
                  } fa-star text-warning`}
                ></i>
              ))}
              <span className="ms-2 text-muted">
                {product.review_count} 則評價
              </span>
            </div>

            <div>{product.description}</div>

            {/* 尺寸選擇 */}
            <div className="my-2">產品尺寸</div>
            <div className="d-flex gap-2">
              {product.sizes.map((size) => (
                <div
                  key={size}
                  className={`sizeBox ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>

            {/* 顏色選擇 */}
            <div className="my-2">產品顏色</div>
            <div className="d-flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <div
                  key={color.id}
                  className={`circle ${
                    selectedColor === color.name ? "active" : ""
                  }`}
                  style={{
                    backgroundColor: `#${color.code.replace("#", "")}`,
                  }}
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                ></div>
              ))}
            </div>

            {/* 數量選擇 */}
            <div className="my-2">產品數量</div>
            <div className="buttonCount">
              <button
                className="button-left"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <input
                type="text"
                className="input-field"
                value={quantity}
                readOnly
              />
              <button
                className="button-right"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>

            {/* 購買按鈕 */}
            <div className="d-flex mt-4">
              <button
                onClick={() => addToCart(product)}
                className="btn btn-info addCartButton flex-grow-1"
              >
                加入購物車
              </button>
              <button className="btn btn-warning buyButton flex-grow-1">
                直接購買
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 產品詳情和評價標籤 */}
      <div className="mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              商品詳情
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              商品評價
            </button>
          </li>
        </ul>

        <div className="tab-content">
          {activeTab === "description" ? (
            <div className="mt-3 descriptionField">
              <div>
                <h4>{product.name}</h4>
                <p className="custom-border">{product.detailed_description}</p>
              </div>
            </div>
          ) : (
            <ProductReviews
              rating={product.rating}
              reviewCount={product.review_count}
            />
          )}
        </div>
      </div>

      {/* 瀏覽記錄 */}
      <BrowsingHistory />

      {/* 推薦商品 */}
      <RecommendedProducts />
      {/* 社交工具欄 */}
      <SocialToolbar />
    </div>
  );
}
