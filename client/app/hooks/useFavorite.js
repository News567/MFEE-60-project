"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import useToast from "@/hooks/useToast";

// type 可以是 'product', 'activity', 或 'rental'
export default function useFavorite(itemId, type = "product") {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const API_BASE_URL = "http://localhost:3005/api/favorites";

  // 檢查收藏狀態
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL);

        if (response.data.success) {
          // 根據類型檢查對應的收藏列表
          const favorites = response.data.data[`${type}s`] || [];
          const ItemFavorited = favorites.some((item) => {
            const itemIdField = `${type}_id`;
            return item[itemIdField] === itemId;
          });

          setIsFavorite(ItemFavorited);
        }
      } catch (err) {
        console.error("獲取收藏狀態失敗:", err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      checkFavoriteStatus();
    }
  }, [itemId, type]);

  // 切換收藏狀態
  const toggleFavorite = async () => {
    if (!itemId) return;

    try {
      setLoading(true);
      const endpoint = isFavorite ? "remove" : "add";

      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, {
        type: type,
        itemIds: [itemId],
      });

      if (response.data.success) {
        setIsFavorite(!isFavorite);
        showToast(
          isFavorite ? "已從收藏移除" : "已加入收藏",
          isFavorite
            ? {
                style: {
                  backgroundColor: "red",
                },
              }
            : {}
        );
      }
    } catch (err) {
      console.error("收藏操作失敗:", err);
      showToast(err.response?.data?.message || "操作失敗，請稍後再試", "error");
    } finally {
      setLoading(false);
    }
  };

  // 新增批量收藏操作
  const batchToggleFavorites = async (ids, action) => {
    if (!ids || ids.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/${action}`, {
        type: type,
        itemIds: ids,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return true;
    } catch (err) {
      console.error("批量收藏操作失敗:", err);
      setError(err.response?.data?.message || "批量收藏操作失敗");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    batchToggleFavorites,
    loading,
    error,
  };
}
