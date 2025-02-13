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
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(params.id);

  // 取得當前選擇的變體
  const getCurrentVariant = () => {
    if (!product || !selectedColor || !selectedSize) return null;

    // 從 sizes 陣列中找到對應的尺寸物件
    const sizeObj = product.sizes.find((s) => s.name === selectedSize);
    if (!sizeObj) return null;

    // 使用 size_id 和 color_id 來找到對應的變體
    return product.variants.find(
      (v) => v.color_id === selectedColor.id && v.size_id === sizeObj.id
    );
  };

  // 處理數量變更
  const handleQuantityChange = (value) => {
    const currentVariant = getCurrentVariant();
    const newQuantity = quantity + value;

    if (newQuantity >= 1) {
      if (currentVariant) {
        if (newQuantity <= currentVariant.stock) {
          setQuantity(newQuantity);
        } else {
          alert("超過庫存數量！");
        }
      } else {
        setQuantity(newQuantity);
      }
    }
  };

  // 加入購物車
  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      alert("請選擇商品尺寸和顏色");
      return;
    }

    const currentVariant = getCurrentVariant();
    if (!currentVariant) {
      alert("找不到對應的商品規格");
      return;
    }

    try {
      // 1. 先呼叫後端 API
      const cartData = {
        userId: 1,
        productId: product.id,
        variantId: currentVariant.id,
        rentalId: null,
        activityId: null,
        quantity: quantity,
        rentalPeriod: null,
        participants: null,
      };

      const response = await axios.post(`${API_BASE_URL}/cart/add`, cartData);

      if (response.data.success) {
        // 2. 如果後端成功，再更新前端的購物車狀態
        const cartItem = {
          id: product.id,
          variant_id: currentVariant.id,
          name: product.name,
          price: product.price,
          color: selectedColor.name,
          size: selectedSize,
          quantity: quantity,
          image: product.images[0],
        };

        addToCart(cartItem); // 使用 context 的 addToCart
        alert("成功加入購物車！");
      } else {
        alert(response.data.message || "加入購物車失敗");
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert("加入購物車失敗，請稍後再試");
    }
  };

  // 修改尺寸選擇的處理
  const handleSizeSelect = (size) => {
    setSelectedSize(size.name); // 儲存尺寸名稱
  };

  // 修改顏色選擇的處理
  const handleColorSelect = (color) => {
    console.log("Selected color:", color);
    setSelectedColor(color);
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
            setSelectedSize(productData.sizes[0].name);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
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
              src={`/img/product/${product.images[0]}`}
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
                  src={`/img/product/${image}`}
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
                    <AiFillHeart color="red" size={40} />
                  ) : (
                    <AiOutlineHeart size={40} />
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
              {product?.sizes.map((size) => (
                <div
                  key={size.id}
                  className={`sizeBox ${
                    selectedSize === size.name ? "active" : ""
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size.name}
                </div>
              ))}
            </div>

            {/* 顏色選擇 */}
            <div className="my-2">產品顏色</div>
            <div className="d-flex gap-2 flex-wrap">
              {product?.colors.map((color) => (
                <div
                  key={color.id}
                  className={`circle ${
                    selectedColor?.id === color.id ? "active" : ""
                  }`}
                  style={{
                    backgroundColor: color.code,
                  }}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                ></div>
              ))}
            </div>

            {/* 數量選擇 */}
            <div className="my-2">
              產品數量
              {getCurrentVariant() && (
                <span className="text-muted ms-2">
                  (庫存: {getCurrentVariant().stock})
                </span>
              )}
            </div>
            <div className="buttonCount">
              <button
                className="button-left"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <span>-</span>
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
                disabled={
                  getCurrentVariant() && quantity >= getCurrentVariant().stock
                }
              >
                <span>+</span>
              </button>
            </div>

            {/* 購買按鈕 */}
            <div className="d-flex mt-4">
              <button
                onClick={handleAddToCart}
                className="btn btn-info addCartButton flex-grow-1"
                disabled={!selectedColor || !selectedSize}
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
      {/* <BrowsingHistory /> */}

      {/* 推薦商品 */}
      {/* <RecommendedProducts /> */}
      {/* 社交工具欄 */}
      <SocialToolbar />
    </div>
  );
}
