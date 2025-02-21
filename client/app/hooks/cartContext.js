"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";

// 創建 Context
const CartContext = createContext();
const API_BASE_URL = "http://localhost:3005/api";

// cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartData, setCartData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 添加選中項目的狀態
  const [selectedItems, setSelectedItems] = useState({
    products: [],
    activities: [],
    rentals: [],
  });

  // 處理全選
  const handleSelectAll = (type, items, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [type]: isSelected ? items.map((item) => item.id) : [],
    }));
  };

  // 處理單個選擇
  const handleSelectItem = (type, itemId, isSelected) => {
    setSelectedItems((prev) => ({
      ...prev,
      [type]: isSelected
        ? [...prev[type], itemId]
        : prev[type].filter((id) => id !== itemId),
    }));
  };

  // 檢查是否全選
  const isAllSelected = (type) => {
    const items = cartData[type] || [];
    return items.length > 0 && items.length === selectedItems[type].length;
  };

  // 加入商品到購物車
  const addToCart = async (userId, cartItem) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        ...cartItem,
      });

      if (response.data.success) {
        // 重新獲取購物車資料
        await fetchCart(userId);
        return true;
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      setError(error.message);
      return false;
    }
  };

  // 移除商品
  const removeFromCart = async (type, itemIds) => {
    try {
      const response = await axios.delete(
        "http://localhost:3005/api/cart/remove",
        {
          data: {
            userId: 1, // 暫時寫死
            type:
              type === "products"
                ? "product"
                : type === "activities"
                ? "activity"
                : type === "rentals"
                ? "rental"
                : type,
            itemIds: Array.isArray(itemIds) ? itemIds : [itemIds],
          },
        }
      );

      if (response.data.success) {
        // 刪除成功後重新獲取購物車數據
        await fetchCart(1);
        return true;
      }
      return false;
    } catch (error) {
      console.error("刪除購物車項目失敗:", error);
      throw new Error(error.response?.data?.message || "刪除失敗，請稍後再試");
    }
  };

  // 從後端獲取購物車資料
  const fetchCart = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      if (response.data.success) {
        // 直接使用後端回傳的資料結構
        setCartData(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("獲取購物車失敗:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartData,
        loading,
        error,
        selectedItems,
        handleSelectAll,
        handleSelectItem,
        isAllSelected,
        addToCart,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
