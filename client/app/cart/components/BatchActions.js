"use client";
import React, { useState } from "react";
import { useCart } from "@/hooks/cartContext";

const BatchActions = ({ type = "products" }) => {
  const {
    cartData,
    selectedItems,
    handleSelectAll,
    isAllSelected,
    removeFromCart,
  } = useCart();
  const [isDeleting, setIsDeleting] = useState(false);

  const items = cartData[type] || [];
  const selectedCount = selectedItems[type].length;

  // 處理批量刪除
  const handleBatchDelete = async () => {
    if (isDeleting || !selectedCount) return;

    if (!confirm("確定要刪除選中的商品嗎？")) return;

    try {
      setIsDeleting(true);
      await removeFromCart(type, selectedItems[type]);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="row g-0 py-2 border-bottom align-items-center">
      <div className="col-1">
        <input
          type="checkbox"
          className="ms-2"
          id={`selectAll-${type}`}
          checked={isAllSelected(type)}
          onChange={(e) => handleSelectAll(type, items, e.target.checked)}
        />
      </div>
      <div className="col">
        <label
          htmlFor={`selectAll-${type}`}
          className="mb-0"
          style={{ fontSize: 14 }}
        >
          全選
        </label>
      </div>
      <div className="col-auto me-3">
        <div className="d-flex gap-3 text-muted" style={{ fontSize: 14 }}>
          <button
            className="btn p-0 text-muted batch-action"
            disabled={selectedCount === 0}
          >
            加入收藏 {selectedCount > 0 && `(${selectedCount})`}
          </button>
          <button
            className="btn p-0 text-muted batch-action"
            disabled={selectedCount === 0 || isDeleting}
            onClick={handleBatchDelete}
          >
            {isDeleting
              ? "刪除中..."
              : `刪除 ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchActions;
