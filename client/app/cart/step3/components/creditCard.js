"use client";
import { Modal } from "antd";
import { useState } from "react";

export default function CreditCard({ isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCVCFocus = () => {
    setIsFlipped(true);
  };

  const handleCVCBlur = () => {
    setIsFlipped(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      className="cartCss2"
    >
      {/* 付款方式 */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">信用卡付款資訊</h5>
        </div>
        <div className="card-body">
          <div className="vstack gap-3">
            {/* 信用卡表單（預設顯示） */}
            <form id="creditCardForm" className="mt-3">
              {/* 信用卡預覽 */}
              <div className="card-container mb-4">
                <div className={`credit-card ${isFlipped ? "flipped" : ""}`}>
                  <div className="card-front">
                    <div className="card-logo">
                      <i className="bi bi-credit-card" />
                    </div>
                    <div className="card-number">•••• •••• •••• ••••</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="card-holder">持卡人姓名</div>
                      <div className="card-expiry">MM/YY</div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="card-strip" />
                    <div className="card-signature">
                      <div className="signature-line" />
                      <div className="cvc">•••</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 信用卡輸入表單 */}
              <div className="row g-3">
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    placeholder="卡號"
                    maxLength={19}
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    id="cardHolder"
                    placeholder="持卡人姓名"
                  />
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control"
                    id="expiry"
                    placeholder="有效期限 MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="col-4">
                  <input
                    type="password"
                    className="form-control"
                    id="cvc"
                    placeholder="CVV"
                    maxLength={3}
                    onFocus={handleCVCFocus}
                    onBlur={handleCVCBlur}
                  />
                </div>
              </div>
              {/* 確認付款按鈕 */}
              <div className="mt-4">
                <button
                  className="btn btn-warning w-100 p-3 fw-bold shadow-lg"
                  onClick={() => {
                    // 這裡添加付款邏輯
                    console.log("處理付款...");
                    onClose();
                  }}
                >
                  確認付款
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
