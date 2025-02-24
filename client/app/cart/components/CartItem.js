"use client";
import React, { useState } from "react";
// import Image from "next/image";
import axios from "axios";
import "./CartItem.css";
import SpecModal from "./SpecModal";
import { useCart } from "@/hooks/cartContext";
import useFavorite from "@/hooks/useFavorite";

const CartItem = ({ item, type = "products" }) => {
  const { selectedItems, handleSelectItem, removeFromCart, updateQuantity } =
    useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 根據類型獲取正確的 ID
  const getFavoriteId = () => {
    switch (type) {
      case "products":
        return item.product_id;
      case "activities":
        return item.activity_id;
      case "rentals":
        return item.rental_id;
      default:
        return null;
    }
  };

  const favoriteId = getFavoriteId();
  // 不需要轉換 type，直接使用複數形式
  const { isFavorite, toggleFavorite } = useFavorite(favoriteId, type);

  // 檢查是否被選中
  const isSelected = selectedItems[type]?.includes(item.id);

  // 處理數量更新
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || isUpdating) return;
    setIsUpdating(true);

    try {
      // 更新購物車
      await updateQuantity(type, item.id, newQuantity);
      setQuantity(newQuantity);
    } catch (error) {
      console.error("更新數量錯誤:", error);
      alert(
        error.response?.data?.message || error.message || "更新失敗，請稍後再試"
      );
      // 如果更新失敗，恢復原來的數量
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  // 處理刪除
  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await removeFromCart(type, item.id);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // 加入收藏
  const handleAddToFavorites = async () => {
    try {
      const success = await toggleFavorite();
      if (success) {
        // 成功加入收藏後從購物車移除
        await removeFromCart(type, item.id);
      }
    } catch (error) {
      console.error("加入收藏失敗:", error);
    }
  };

  const renderQuantityControl = () => (
    <div className="quantity-control">
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={isUpdating}
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
        min="1"
        className="form-control form-control-sm"
        disabled={isUpdating}
      />
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => handleQuantityChange(quantity + 1)}
        disabled={isUpdating}
      >
        +
      </button>
    </div>
  );

  const renderSpecificInfo = () => {
    switch (type) {
      case "products":
        return (
          <SpecModal item={item}>
            <div className="spec-display">
              <div className="spec-content">
                <div className="spec-row">
                  <span className="spec-label">尺碼：</span>
                  <span className="spec-value">
                    {item?.size_name || "沒填"}
                  </span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">顏色：</span>
                  <span className="spec-value">
                    {item?.color_name || "沒填"}
                  </span>
                </div>
              </div>
              <span className="edit-mark">修改</span>
            </div>
          </SpecModal>
        );
      case "activities":
        return (
          <div className="info-display">
            <div className="info-content">
              <div className="info-row">
                <span className="info-label">活動時間：</span>
                <div className="info-value">
                  <div>{item.date}</div>
                  <div className="time">{item.time}</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "rentals":
        return (
          <div className="info-display">
            <div className="info-content">
              <div className="info-row">
                <span className="info-label">租賃期間：</span>
                <div className="info-value">
                  <div>{item.start_date}</div>
                  <div>~ {item.end_date}</div>
                  <div className="days">({item.rental_days}天)</div>
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">每日租金：</span>
                <span className="info-value">NT$ {item.discounted_price}</span>
              </div>
              <div className="info-row">
                <span className="info-label">押金：</span>
                <span className="info-value">NT$ {item.deposit_fee}</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cart-item row g-0 py-3 align-items-center border-bottom">
      <div className="col-12 col-md-4 mb-3 mb-md-0">
        <div className="d-flex align-items-start gap-2">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="ms-2"
              checked={isSelected}
              onChange={(e) =>
                handleSelectItem(type, item.id, e.target.checked)
              }
            />
          </div>
          <div className="product-image">
            <img
              src={item.image || "/article-5ae9687eec0d4.jpg"}
              alt={item.name || "商品圖片"}
              className="img-thumbnail"
              width={80}
              height={80}
            />
          </div>
          <div className="flex-grow-1">
            <div className="product-name mb-2">{item.name}</div>
            {type === "activities" && (
              <div className="text-muted">{item.project_name}</div>
            )}
          </div>
        </div>
      </div>

      <div className="col-12 col-md-2 mb-3 mb-md-0">{renderSpecificInfo()}</div>

      <div className="col-4 col-md-1 mb-3 mb-md-0">
        <div className="text-start text-md-center">
          <span className="d-inline d-md-none">
            {type === "rentals" ? "每日租金：" : "單價："}
          </span>
          <span className="text-muted">
            ${type === "rentals" ? item.discounted_price : item.price}
          </span>
        </div>
      </div>

      <div className="col-8 col-md-2 mb-3 mb-md-0">
        <div className="quantity-wrapper d-flex justify-content-end justify-content-md-center align-items-center gap-1">
          {renderQuantityControl()}
        </div>
      </div>

      <div className="col-6 col-md-1 mb-3 mb-md-0">
        <div className="text-start text-md-center">
          <span className="d-inline d-md-none">小計：</span>
          <div className="price">
            NT${" "}
            {type === "rentals"
              ? Number(item.discounted_price) * quantity * item.rental_days
              : Number(item.price) * quantity}
            {type === "rentals" && item.deposit_fee > 0 && (
              <div className="text-muted small">
                (押金：NT$ {item.deposit_fee})
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col-6 col-md-2">
        <div className="d-flex flex-row flex-md-column align-items-end align-items-md-center gap-2">
          <button
            className="btn p-0 text-muted"
            onClick={handleAddToFavorites}
            disabled={isFavorite}
            title={isFavorite ? "商品已在收藏中" : "加入收藏"}
          >
            {isFavorite ? "已在收藏中" : "加入收藏"}
          </button>
          <button
            className="btn p-0 text-muted"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "刪除中..." : "刪除"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
