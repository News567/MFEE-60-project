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
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // 移除商品
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // 從後端獲取購物車資料
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
