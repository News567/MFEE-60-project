// RentalSidebar.js
import React, { useState } from 'react';
import "./RentalSidebar.css";

const RentalSidebar = ({ onClose, onSubmit }) => {

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleSubmit = () => {
    if (!selectedDate || selectedQuantity < 1) {
      alert('請選擇日期和數量');
      return;
    }

    // 將選擇的數據傳遞給父組件
    onSubmit({ date: selectedDate, quantity: selectedQuantity });
  };

  return (
    <div className="rental-sidebar open">
      <div className="sidebar-header">
        <h3>選擇租借資訊</h3>
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
      </div>
      <div className="sidebar-content">
        <label htmlFor="rental-date">租借日期</label>
        <input
          type="date"
          id="rental-date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <label htmlFor="rental-quantity">租借數量</label>
        <input
          type="number"
          id="rental-quantity"
          min="1"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
        />
        <button onClick={handleSubmit} className="submit-btn">
          確認
        </button>
      </div>
    </div>
  );
};

export default RentalSidebar;