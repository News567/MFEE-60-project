"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./products.module.css";

export default function SidebarProductList({ title, products }) {
  return (
    <div className={styles.sideCard}>
      <div className={styles.cardTitle}>
        <h5>{title}</h5>
      </div>
      {products.map((product) => (
        <Link
          href={`/products/${product.id}`}
          key={product.id}
          className={styles.sidebarProduct}
        >
          <div className={styles.sidebarProductImg}>
            <Image
              src={`/img/product/${product.image_name}`}
              alt={product.name}
              fill
              sizes="80px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.sidebarProductInfo}>
            <div className={styles.sidebarProductBrand}>
              {product.brand_name}
            </div>
            <div className={styles.sidebarProductTitle}>{product.name}</div>
            <div className={styles.sidebarProductPrice}>
              NT${product.min_price}
              {product.min_original_price > product.min_price && (
                <span className={styles.originalPrice}>
                  NT${product.min_original_price}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
