"use client";
import Link from "next/link";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./products.module.css";
import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";

export default function ProductCard({ product }) {
  const { isFavorite, toggleFavorite, loading } = useFavorite(product.id);

  const { addToCart } = useCart();

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className={`col-lg-3 col-md-4 col-sm-6 ${styles.productItem}`}>
      <Link href={`/activity/${product.id}`} className={styles.productLink}>
        <div className={styles.productImg}>
          <Image
            src={`/image/activity/${product.id}/${product.main_image}` || "/image/activity/1.jpg"}
            alt={product.name || "商品圖片"}
            width={200}
            height={200}
            className="w-100"
          />
          <div className={styles.productOverlay}>
            <button
              className={styles.iconButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite();
              }}
              style={{ border: "none", background: "none" }}
              disabled={loading}
            >
              {isFavorite ? (
                <AiFillHeart color="red" size={24} />
              ) : (
                <AiOutlineHeart color="white" size={24} />
              )}
            </button>
            {/* <button className="btn btn-primary w-75" onClick={handleCartClick}>
              加入購物車
            </button> */}
          </div>
        </div>
        {/* <div
          className={`${styles.dFlex} ${styles.justifyContentCenter} ${styles.gap1} my-2`}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.saleCircle}></div>
          ))}
        </div> */}
        <div className={styles.productInfo}>
          <div className={styles.brandName}>
            {product.city_name || "活動地點"}
          </div>
          <div>{product.name || "活動名稱"}</div>
          <div className={styles.salePrice}>NT${product.price}</div>
          <div className={styles.originalPrice}>
            NT${product.original_price || (product.price || 0) * 1.5}
          </div>
        </div>
      </Link>
    </div>
  );
}
