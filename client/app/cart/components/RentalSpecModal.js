import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RentalSpecModal.css";

const RentalSpecModal = ({ item, onClose, onUpdate }) => {
  const [startDate, setStartDate] = useState(item.start_date);
  const [endDate, setEndDate] = useState(item.end_date);
  const [color, setColor] = useState(item.color); // 存儲顏色中文名稱，跟購物車cart-rental-item邏輯對應
  const [error, setError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [allColors, setAllColors] = useState([]); // 存儲所有顏色選項（包括中文名稱和 RGB 色碼）

  // 從 API 獲取該商品的所有顏色選項
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/rent/${item.id}/colors`
        );
        setAllColors(response.data.data); // 設置所有顏色選項
      } catch (error) {
        console.error("獲取商品顏色選項失敗:", error);
      }
    };

    fetchColors();
  }, [item.id]);

  // 處理提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 驗證日期區間
    if (new Date(endDate) < new Date(startDate)) {
      setError("結束日期不能早於起始日期");
      return;
    }

    // // 調錯用
    // console.log("傳遞的資料：", {
    //   userId: 1, // 替換為實際的用戶 ID
    //   type: "rental",
    //   itemId: item.id,
    //   startDate,
    //   endDate,
    //   color, // 傳遞顏色中文名稱
    // });

    try {
      const response = await axios.put(
        `http://localhost:3005/api/cart/update`,
        {
          userId: 1, // 替換為實際的用戶 ID
          type: "rental",
          itemId: item.id,
          startDate,
          endDate,
          color, // 傳遞顏色中文名稱
          quantity: item.quantity, // 固定傳遞購物車中的當前數量，避免報錯
        }
      );

      // console.log("更新成功，返回資料：", response.data);

      // 手動傳遞更新後的資料給父組件
      onUpdate({
        id: item.id,
        start_date: startDate,
        end_date: endDate,
        color,
        quantity: item.quantity,
      });

      // 關閉 Modal
      onClose();
    } catch (error) {
      console.error("更新租借訂單資訊失敗:", error);
      if (error.response) {
        console.error("API 返回的錯誤狀態碼:", error.response.status);
        console.error("API 返回的錯誤資料:", error.response.data);
      }
      alert("更新失敗，請稍後再試");
    }
  };
  
  // 處理關閉 modal
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 100);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-custom">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title">修改租借資訊</h5>
            <button
              type="button"
              className="btn close-btn"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* 起始日期 */}
              <div className="form-group">
                <label className="color-title">起始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {/* 結束日期 */}
              <div className="form-group">
                <label className="color-title">結束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              {/* 錯誤訊息 */}
              {error && <p className="error-message">{error}</p>}

              {/* 顏色選擇 */}
              <div className="form-group">
                <label className="color-title">顏色</label>
                <div className="product-color">
                  <div className="colors d-flex flex-row">
                    {/* 檢查是否有顏色資料 */}
                    {allColors.length > 0 ? (
                      allColors.map((colorOption) => (
                        <div
                          key={colorOption.color_id}
                          className={`color-box ${
                            color === colorOption.color_name ? "selected" : ""
                          }`}
                          style={{ backgroundColor: colorOption.color_rgb }} // 使用 color_rgb
                          onClick={() => setColor(colorOption.color_name)} // 更新顏色中文名稱
                          title={colorOption.color_name}
                        ></div>
                      ))
                    ) : (
                      <p className="no-colors">本商品暫無其他顏色</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 按鈕區 */}
            <div className="modal-footer">
              <button type="button" className="cancel-button" onClick={onClose}>
                取消
              </button>
              <button type="submit" className="confirm-button">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RentalSpecModal;
