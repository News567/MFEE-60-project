import React, { useState } from 'react';

const RentCart = ({ addToCart, closeModal, selectedProduct }) => {
  const [rentDateRange, setRentDateRange] = useState({ startDate: '', endDate: '' });
  const [quantity, setQuantity] = useState(1);

  const handleConfirmRent = () => {
    if (!rentDateRange.startDate || !rentDateRange.endDate) {
      alert("請填寫完整的租借日期");
      return;
    }

    if (!quantity) {
      alert("請填寫數量");
      return;
    }

    // 確保租借資訊正確後，加入購物車
    addToCart(
      selectedProduct.id,
      rentDateRange.startDate,
      rentDateRange.endDate,
      quantity
    );
    closeModal(); // 關閉 Modal
  };

  return (
    <div>
      {/* 你的表單結構 */}
      <button onClick={handleConfirmRent}>確認租借</button>
    </div>
  );
};

export default RentCart;
