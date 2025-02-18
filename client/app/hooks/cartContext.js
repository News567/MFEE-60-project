"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";

// 創建 Context
const CartContext = createContext();
const API_BASE_URL = "http://localhost:3005/api";

// cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 加入商品到購物車
  // 如果已存在，覆蓋數量
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.variant_id === product.variant_id
      );

      if (existingItemIndex !== -1) {
        // 如果已存在，覆蓋數量
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity = product.quantity;
        return updatedCart;
      } else {
        // 否則新增
        return [...prevCart, product];
      }
    });
  };

  // 移除商品
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 從後端獲取購物車資料 目前失敗
  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/${userId}`);
      if (response.data.success) {
        setCart(response.data.cartItems);
      }
    } catch (error) {
      console.error("獲取購物車失敗:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
