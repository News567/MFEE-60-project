"use client";
import React, { useState } from "react";
import "./step3.css";
import CartFlow from "../components/cartFlow";
import { useRouter } from "next/navigation";
import CreditCard from "./components/creditCard";


const Cart2 = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [shippingMethod, setShippingMethod] = useState("homeDelivery");

  const shippingChange = (e) => {
    setShippingMethod(e.target.value);
  };
  // console.log(shippingMethod);

  // 宅配表單
  const HomeDeliveryForm = () => (
    <div className="mt-3">
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="sameAsCustomer"
          defaultChecked
        />
        <label className="form-check-label" htmlFor="sameAsCustomer">
          收件人資料與會員資料相同
        </label>
      </div>
      <div className="row g-3">
        <div className="col-6">
          <input
            type="text"
            className="form-control"
            placeholder="收件人姓名"
          />
        </div>
        <div className="col-6">
          <input type="tel" className="form-control" placeholder="手機號碼" />
        </div>
        <div className="col-12">
          <select className="form-select mb-2">
            <option>選擇縣市</option>
            {/* 縣市選項 */}
            {/* 找套件來使用 */}
          </select>
        </div>
        <div className="col-12">
          <input type="text" className="form-control" placeholder="詳細地址" />
        </div>
      </div>
    </div>
  );

  // 超商取貨表單
  const StorePickupForm = () => (
    <div className="mt-3">
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="sameAsCustomer2"
          defaultChecked
        />
        <label className="form-check-label" htmlFor="sameAsCustomer2">
          收件人資料與會員資料相同
        </label>
      </div>
      <div className="row g-3">
        <div className="col-6">
          <input
            type="text"
            className="form-control"
            placeholder="收件人姓名"
          />
        </div>
        <div className="col-6">
          <input type="tel" className="form-control" placeholder="手機號碼" />
        </div>
        <div className="col-12">
          <button
            className="btn btn-outline-primary w-100"
            onClick={() => {
              // 這裡添加選擇超商的邏輯
              console.log("選擇超商");
            }}
          >
            選擇超商
          </button>
        </div>
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            placeholder="超商名稱"
            readOnly
          />
        </div>
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            placeholder="超商地址"
            readOnly
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="cartCss2">
        <div className="container py-5">
          <CartFlow />
          <div className="total-price-area">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <button
                className="btn btn-link text-decoration-none p-0"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#cartPreview"
                aria-expanded="false"
                aria-controls="cartPreview"
              >
                購物車(3件) <i className="bi bi-chevron-down" />
              </button>
            </div>
            {/* 購物車預覽區域 */}
            <div className="collapse" id="cartPreview">
              <div className="cart-preview-items">
                {/* 商品項目 */}
                <div className="cart-preview-item d-flex align-items-center p-2 border-bottom">
                  <img
                    src="https://picsum.photos/100/100"
                    className="img-thumbnail"
                    style={{ width: 50, height: 50 }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <div className="small fw-bold">產品名稱</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        尺寸：XL / 顏色：灰色
                      </small>
                      <div className="text-end">
                        <div className="small fw-bold">NT$65</div>
                        <small className="text-muted">x1</small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 重複的商品項目... */}
                <div className="cart-preview-item d-flex align-items-center p-2 border-bottom">
                  <img
                    src="https://picsum.photos/100/100"
                    className="img-thumbnail"
                    style={{ width: 50, height: 50 }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <div className="small fw-bold">產品名稱 2</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">尺寸：L / 顏色：黑色</small>
                      <div className="text-end">
                        <div className="small fw-bold">NT$120</div>
                        <small className="text-muted">x2</small>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 返回購物車按鈕 */}
                <div className="text-center pt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => router.push("/cart/step1")}
                  >
                    返回購物車修改
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* 主要內容區 */}
          <div className="row mt-4">
            {/* 左側主要內容 (佔 8 欄位) */}
            <div className="col-8">
              {/* 送貨方式 */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">一般商品&租賃配送資訊</h5>
                </div>
                <div className="card-body">
                  <div className="vstack gap-3">
                    {/* 送貨選項 */}
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="shippingMethod"
                          id="homeDelivery"
                          value="homeDelivery"
                          checked={shippingMethod === "homeDelivery"}
                          onChange={shippingChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="homeDelivery"
                        >
                          <div className="fw-bold">宅配到府</div>
                          <small className="text-muted">運費 NT$60</small>
                          <span className="badge bg-success ms-2">
                            滿 NT$1,000 免運
                          </span>
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="shippingMethod"
                          id="storePickup"
                          value="storePickup"
                          checked={shippingMethod === "storePickup"}
                          onChange={shippingChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="storePickup"
                        >
                          <div className="fw-bold">超商取貨</div>
                          <small className="text-muted">運費 NT$60</small>
                          <span className="badge bg-success ms-2">
                            滿 NT$1,000 免運
                          </span>
                        </label>
                      </div>
                    </div>
                    {/* 根據選擇的配送方式顯示對應的表單 */}
                    {shippingMethod === "homeDelivery" ? (
                      <HomeDeliveryForm />
                    ) : (
                      <StorePickupForm />
                    )}
                  </div>
                </div>
              </div>
              {/* 優惠券 */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">使用優惠券</h5>
                </div>
                <div className="card-body">
                  {/* 優惠碼輸入區 */}
                  <div className="mb-4">
                    <label className="form-label">輸入優惠碼</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="couponInput"
                        placeholder="請輸入優惠碼"
                      />
                      <button
                        className="btn btn-outline-primary"
                        id="applyCoupon"
                      >
                        套用
                      </button>
                    </div>
                    {/* 優惠碼提示訊息 */}
                    <div
                      id="couponMessage"
                      className="mt-2"
                      style={{ display: "none" }}
                    >
                      <small className="text-success">
                        <i className="bi bi-check-circle-fill me-1" />
                        已套用優惠碼，折抵 NT$100
                      </small>
                    </div>
                  </div>
                  {/* 可領取的優惠券列表 */}
                  <div>
                    <label className="form-label">可領取的優惠券</label>
                    <div className="vstack gap-2">
                      {/* 優惠券項目 */}
                      <div className="border rounded p-3 position-relative">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold text-danger mb-1">
                              NT$100 折價券
                            </div>
                            <small className="text-muted d-block">
                              消費滿 NT$1,000 可使用
                            </small>
                            <small className="text-muted">
                              有效期限：2024/12/31
                            </small>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            // onClick="claimCoupon(this, 'SAVE100')"
                          >
                            可使用
                          </button>
                        </div>
                      </div>
                      <div className="border rounded p-3 position-relative">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold text-danger mb-1">
                              NT$200 折價券
                            </div>
                            <small className="text-muted d-block">
                              消費滿 NT$2,000 可使用
                            </small>
                            <small className="text-muted">
                              有效期限：2024/12/31
                            </small>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            // onclick="claimCoupon(this, 'SAVE200')"
                          >
                            可使用
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 右側訂單摘要 (佔 4 欄位) */}
            <div className="col-4">
              <div className="card position-sticky" style={{ top: "5rem" }}>
                <div className="card-header">
                  <h5 className="mb-0">訂單摘要</h5>
                </div>
                <div className="card-body">
                  <div className="vstack gap-2">
                    <div className="d-flex justify-content-between">
                      <span>商品金額</span>
                      <span>NT$ 1,810</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>運費</span>
                      <div className="text-end">
                        <span>NT$ 60</span>
                        {/* 簡化的湊單提示 */}
                        <div className="free-shipping-hint mt-1">
                          <small className="text-danger">
                            <i className="bi bi-info-circle me-1" />
                            還差 NT$190 享免運優惠
                            <a
                              href="http://localhost:3000/products"
                              className="text-danger text-decoration-none ms-1"
                            >
                              <small>去湊單</small>
                              <i className="bi bi-arrow-right" />
                            </a>
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between text-danger">
                      <span>優惠折抵</span>
                      <span>-NT$ 100</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>總計金額</span>
                      <span className="text-danger fs-5">NT$ 1,770</span>
                    </div>
                    <button className="btn btn-primary w-100 mt-3 p-3 fw-bold shadow-lg">
                      綠界支付
                    </button>
                    <button className="btn btn-success w-100 mt-3 p-3 fw-bold shadow-lg">
                      Line Pay
                    </button>
                    <button
                      className="btn btn-warning w-100 mt-3 p-3 fw-bold shadow-lg"
                      onClick={handleOpenModal}
                    >
                      信用卡支付
                    </button>
                    {/* <div className="text-center mt-2">
                      <small className="text-muted">
                        完成訂單可獲得 18 點購物金
                      </small>
                    </div> */}
                  </div>
                </div>
              </div>
              {/* 湊單商品推薦區 */}
              <div className="collapse mt-3" id="recommendProducts">
                <div className="recommend-products">
                  <div className="small fw-bold mb-2">推薦商品</div>
                  <div className="vstack gap-2">
                    {/* 推薦商品項目 */}
                    <div className="recommend-item d-flex align-items-center p-2 border rounded">
                      <img
                        src="https://picsum.photos/100/100"
                        className="img-thumbnail"
                        style={{ width: 50, height: 50 }}
                      />
                      <div className="ms-3 flex-grow-1">
                        <div className="small fw-bold">推薦商品名稱</div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-danger">NT$ 199</span>
                          <button className="btn btn-outline-danger btn-sm">
                            加入購物車
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="recommend-item d-flex align-items-center p-2 border rounded">
                      <img
                        src="https://picsum.photos/100/100"
                        className="img-thumbnail"
                        style={{ width: 50, height: 50 }}
                      />
                      <div className="ms-3 flex-grow-1">
                        <div className="small fw-bold">推薦商品名稱 2</div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-danger">NT$ 299</span>
                          <button className="btn btn-outline-danger btn-sm">
                            加入購物車
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 正確傳遞 props 給 CreditCard 組件 */}
      <CreditCard isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Cart2;
