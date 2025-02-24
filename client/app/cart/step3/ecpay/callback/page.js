"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Link from "next/link";

export default function EcpayCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("處理中...");

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        // 取得綠界回傳的參數
        const merchantTradeNo = searchParams.get("MerchantTradeNo");
        const paymentStatus = searchParams.get("RtnCode");

        if (paymentStatus === "1") {
          // 支付成功
          setStatus("付款成功！正在處理您的訂單...");

          // 更新訂單狀態
          const response = await fetch(
            "http://localhost:3005/api/orders/update-status",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId: merchantTradeNo,
                status: "paid",
              }),
            }
          );

          if (response.ok) {
            // 導向成功頁面
            router.push("http://localhost:3000/cart/step4");
          } else {
            throw new Error("更新訂單狀態失敗");
          }
        } else {
          // 支付失敗
          setStatus("付款失敗，請重新嘗試");
          setTimeout(() => {
            router.push("/cart/step3");
          }, 3000);
        }
      } catch (error) {
        console.error("處理付款結果時發生錯誤:", error);
        setStatus("處理付款結果時發生錯誤");
      }
    };

    handlePaymentResult();
  }, [searchParams, router]);

  return (
    <div className="container py-5">
      <div className="card">
        <div className="card-body text-center">
          <h3>{status}</h3>
        </div>
      </div>
    </div>
  );
}

// 返回的範例:
// http://localhost:3000/ecpay/callback?CustomField1=&CustomField2=&CustomField3=&CustomField4=&MerchantID=3002607&MerchantTradeNo=od20241130223942231&PaymentDate=2024%2F11%2F30+23%3A11%3A51&PaymentType=TWQR_OPAY&PaymentTypeChargeFee=0&RtnCode=1&RtnMsg=Succeeded&SimulatePaid=0&StoreID=&TradeAmt=1000&TradeDate=2024%2F11%2F30+22%3A39%3A42&TradeNo=2411302239425452&CheckMacValue=958DF6A1C508F2A90F04440AF0F464960A71E315EBA903A4FCD53C1517C043ED
