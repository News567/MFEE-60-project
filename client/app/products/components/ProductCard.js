"use client";
import Link from "next/link";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./products.module.css";
import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";
import useToast from "@/hooks/useToast";
import { useState } from "react";

export default function ProductCard({ product }) {
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(product.id, "product");
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // 如果沒有 variants，使用商品本身的資料建立預設變體
      const cartData = {
        userId: 1, // 暫時寫死
        type: "product",
        variantId: product.variant_id, // 直接使用商品 ID
        quantity: 1,
      };
      console.log(" DEBUG: cartData =", cartData);

      const success = await addToCart(1, cartData);
      if (success) {
        showToast ? showToast("商品已加入購物車") : alert("成功加入購物車！");
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert("加入購物車失敗，請稍後再試");
    }
  };

  // 顯示價格範圍的函數
  const renderPriceRange = () => {
    // 使用 min_price 和 max_price 顯示價格範圍
    const minPrice = product.min_price || product.price;
    const maxPrice = product.max_price;

    // 如果最低價格和最高價格相同，只顯示一個價格
    if (!maxPrice || minPrice === maxPrice) {
      return `NT$${minPrice}`;
    }

    // 否則顯示價格範圍
    return `NT$${minPrice} ~ NT$${maxPrice}`;
  };

  return (
    <div
      className={`${styles.productItem} ${imageLoaded ? styles.fadeIn : ""}`}
    >
      <Link href={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.productImg}>
          <Image
            src={`/img/product/${product.main_image}`}
            alt={product.name || "商品圖片"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease-in",
            }}
            onLoadingComplete={() => setImageLoaded(true)}
            priority={false}
          />
          <div className={styles.productOverlay}>
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!favoriteLoading) {
                  toggleFavorite();
                }
              }}
              style={{ border: "none", background: "none" }}
              disabled={favoriteLoading}
            >
              {isFavorite ? (
                <AiFillHeart color="red" size={36} />
              ) : (
                <AiOutlineHeart color="white" size={36} />
              )}
            </button>
            <button
              className="btn btn-primary w-75 mt-2"
              onClick={handleCartClick}
            >
              加入購物車
            </button>
          </div>
        </div>
        <div className={`d-flex justify-content-center gap-1 my-2`}>
          {product.color && product.color.length > 0 ? (
            product.color.map((color, index) => (
              <div
                key={color.color_id}
                className={styles.saleCircle}
                style={{
                  backgroundColor: color.color_code,
                  border: "1px solid #e0e0e0",
                  cursor: "pointer",
                }}
                title={color.color_name}
              />
            ))
          ) : (
            <div className={styles.saleCircle} style={{ opacity: 0.3 }} />
          )}
        </div>
        <div className={styles.productInfo}>
          <div className={styles.brandName}>
            {product.brand_name || "自由品牌"}
          </div>
          <div>{product.name || "商品名稱"}</div>
          <div className={styles.salePrice}>{renderPriceRange()}</div>
          <div className={styles.originalPrice}>
            NT${product.original_price || (product.min_price || 0) * 1.5}
          </div>
        </div>
      </Link>
    </div>
  );
}
