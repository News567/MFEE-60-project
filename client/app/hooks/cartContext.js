"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// 創建 Context
const CartContext = createContext();
const API_BASE_URL = "http://localhost:3005/api";

// cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartData, setCartData] = useState({
    products: [],
    activities: [],
    rentals: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 添加選中項目的狀態
  const [selectedItems, setSelectedItems] = useState({
    products: [],
    activities: [],
    rentals: [],
  });
  const router = useRouter();

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

  // 更新購物車數量
  const updateQuantity = async (type, itemId, newQuantity) => {
    try {
      // 轉換 type 格式
      const updateType =
        type === "products"
          ? "product"
          : type === "activities"
          ? "activity"
          : "rental";

      const response = await axios.put(`${API_BASE_URL}/cart/update`, {
        userId: 1,
        type: updateType, // 使用轉換後的 type
        itemId,
        quantity: newQuantity,
      });

      if (response.data.success) {
        // 更新成功後重新獲取購物車數據
        await fetchCart(1);
      } else {
        throw new Error(response.data.message || "更新失敗");
      }
    } catch (error) {
      throw error;
    }
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
        const data = response.data.data;
        setCartData(data);

        // 設置預設全選
        setSelectedItems({
          products: data.products?.map((item) => item.id) || [],
          activities: data.activities?.map((item) => item.id) || [],
          rentals: data.rentals?.map((item) => item.id) || [],
        });
      }
    } catch (error) {
      console.error("獲取購物車失敗:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 修改 proceedToCheckout 函數
  const proceedToCheckout = async () => {
    try {
      // 使用後端的 initialize endpoint 來初始化結帳流程
      const response = await axios.post(`${API_BASE_URL}/checkout/initialize`, {
        userId: 1, // 這裡應該使用實際的 userId
      });

      if (response.data.success) {
        const { checkoutSteps } = response.data.data;

        // 根據後端返回的結果決定導向
        if (checkoutSteps.needsActivityForm) {
          // 如果需要填寫活動表單，導向 step2
          router.push("/cart/step2");
        } else if (checkoutSteps.needsShippingInfo) {
          // 如果需要配送資訊但不需要活動表單，直接導向 step3
          router.push("/cart/step3");
        } else {
          // 處理錯誤情況
          setError("購物車內容有誤，請重新確認");
        }
      }
    } catch (error) {
      console.error("初始化結帳流程失敗:", error);
      setError(
        error.response?.data?.message || "初始化結帳流程失敗，請稍後再試"
      );
    }
  };

  // 在 CartProvider 中添加新的函數
  const submitActivityTravelers = async (data) => {
    try {
      // 創建 FormData
      const formData = new FormData();
      formData.append("activityId", data.activityId);
      formData.append("travelers", JSON.stringify(data.travelers));

      const response = await axios.post(
        `${API_BASE_URL}/checkout/activity-travelers`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("提交旅客資料失敗:", error);
      setError(error.response?.data?.message || "提交旅客資料失敗");
      return false;
    }
  };

  const completeCheckout = async (checkoutData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/checkout/complete`, {
        userId: 1, // 這裡應該使用實際的 userId
        ...checkoutData,
      });

      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || "結帳失敗");
    } catch (error) {
      console.error("完成結帳失敗:", error);
      throw error;
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
        updateQuantity,
        proceedToCheckout,
        submitActivityTravelers,
        completeCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
