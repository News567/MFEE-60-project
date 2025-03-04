"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartFlow from "../components/cartFlow";
import OrderSuccess from "./components/OrderSuccess";
import OrderSummary from "./components/OrderSummary";
import PaymentInfo from "./components/PaymentInfo";
import ShippingInfo from "./components/ShippingInfo";
import axios from "axios";
import "./step4.css";

export default function Cart4() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);
  const orderId = localStorage.getItem("lastOrderId");

  useEffect(() => {
    if (!orderId) {
      console.error("無效的訂單 ID");
      return;
    }

    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/order/${orderId}`
        );
        setOrderData(response.data.data); // 確保取到正確的 `data`
      } catch (error) {
        console.error("訂單資料獲取失敗:", error);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (!orderData) {
    return <div className="text-center">載入中...</div>;
  }

  return (
    <div className="cartCss4">
      <div className="container py-5">
        <CartFlow />

        <div className="success-container text-center py-4">
          <OrderSuccess orderNumber={orderData.orderInfo.orderNumber} />
        </div>

        <div className="row mt-4">
          <div className="col-md-8">
            {/* 訂單明細 */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">訂單明細</h5>
              </div>
              <div className="card-body">
                <OrderSummary items={orderData.items} />
              </div>
            </div>

            {/* 付款資訊 */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">付款資訊</h5>
              </div>
              <div className="card-body">
                <PaymentInfo payment={orderData.paymentInfo} />
              </div>
            </div>

            {/* 配送資訊 */}
            {orderData.shippingInfo && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">配送資訊</h5>
                </div>
                <div className="card-body">
                  <ShippingInfo shipping={orderData.shippingInfo} />
                </div>
              </div>
            )}
          </div>

          {/* 訂單資訊 */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">訂單資訊</h5>
              </div>
              <div className="card-body">
                <div className="vstack gap-2">
                  <div className="d-flex justify-content-between">
                    <span>訂單編號</span>
                    <span>{orderData.orderInfo.orderNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>訂單日期</span>
                    <span>{orderData.orderInfo.orderDate}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>訂單狀態</span>
                    <span className="text-success">
                      {orderData.orderInfo.orderStatusText}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>總計金額</span>
                    <span className="text-danger">
                      NT$ {orderData.orderInfo.totalAmount}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      本次消費可獲得 {orderData.orderInfo.rewardPoints} 點購物金
                    </small>
                  </div>
                  <div className="d-grid mt-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => router.push("/")}
                    >
                      回到首頁
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
