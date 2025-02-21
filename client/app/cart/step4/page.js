"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartFlow from "../components/cartFlow";
import OrderSuccess from "./components/OrderSuccess";
import OrderSummary from "./components/OrderSummary";
import PaymentInfo from "./components/PaymentInfo";
import ShippingInfo from "./components/ShippingInfo";
import "./step4.css";

export default function Cart4() {
  const router = useRouter();

  // 模擬訂單資料
  const orderData = {
    orderNumber: "20240315001",
    orderDate: "2024-03-15 15:30:00",
    status: "已付款",
    totalAmount: 15000,
    rewardPoints: 150,
    payment: {
      method: "信用卡",
      status: "付款成功",
      cardLast4: "1234",
    },
    shipping: {
      method: "宅配",
      address: "台北市大安區...",
      recipient: "王小明",
      phone: "0912345678",
      estimatedDelivery: "2-3 個工作天",
    },
    items: {
      products: [
        {
          id: 1,
          name: "潛水面鏡",
          quantity: 1,
          price: 2000,
          specs: "黑色",
        },
      ],
      activities: [
        {
          id: 1,
          name: "OWD｜自選日期班",
          date: "2024-03-20",
          time: "09:00",
          participants: [
            {
              name: "王小明",
              phone: "0912345678",
            },
          ],
          price: 12000,
        },
      ],
      rentals: [
        {
          id: 1,
          name: "潛水裝備組",
          startDate: "2024-03-20",
          endDate: "2024-03-22",
          deposit: 5000,
          rentalFee: 1000,
        },
      ],
    },
  };

  return (
    <div className="cartCss4">
      <div className="container py-5">
        <CartFlow />

        <div className="success-container text-center py-4">
          <OrderSuccess orderNumber={orderData.orderNumber} />
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
                <PaymentInfo payment={orderData.payment} />
              </div>
            </div>

            {/* 配送資訊 */}
            {(orderData.items.products.length > 0 ||
              orderData.items.rentals.length > 0) && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">配送資訊</h5>
                </div>
                <div className="card-body">
                  <ShippingInfo shipping={orderData.shipping} />
                </div>
              </div>
            )}
          </div>

          {/* 右側訂單摘要 */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">訂單資訊</h5>
              </div>
              <div className="card-body">
                <div className="vstack gap-2">
                  <div className="d-flex justify-content-between">
                    <span>訂單編號</span>
                    <span>{orderData.orderNumber}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>訂單日期</span>
                    <span>{orderData.orderDate}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>訂單狀態</span>
                    <span className="text-success">{orderData.status}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>總計金額</span>
                    <span className="text-danger">
                      NT$ {orderData.totalAmount}
                    </span>
                  </div>
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      本次消費可獲得 {orderData.rewardPoints} 點購物金
                    </small>
                  </div>
                  <div className="d-grid  mt-3">
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
