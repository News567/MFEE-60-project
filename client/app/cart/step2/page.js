"use client";
import { useState } from "react";
import CartFlow from "../components/cartFlow";
import ActivityForm from "./components/ActivityForm";
import ActivitySummary from "./components/ActivitySummary";
import "./step2.css";

export default function Cart3() {
  const [currentActivity, setCurrentActivity] = useState(0);
  // axios 取得當前活動資訊
  const activities = [
    {
      id: 1,
      name: "OWD｜自選日期班",
      date: "2025年2月21日",
      time: "上午8:00",
      location: "Kenting Taiwan",
      provider: "DivePro",
      days: 2,
      price: 15000,
    },
    // ... 其他活動
  ];

  const handleNext = () => {
    if (currentActivity < activities.length - 1) {
      setCurrentActivity((prev) => prev + 1);
    } else {
      // 所有活動都填寫完成，導向下一步
      router.push("/cart/step3");
    }
  };

  return (
    <div className="cartCss3">
      <div className="container py-5">
        <CartFlow />
        <div className="row mt-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  活動預約資訊 ({currentActivity + 1}/{activities.length})
                </h5>
                <span className="badge bg-primary">
                  {activities[currentActivity].name}
                </span>
              </div>
              <div className="card-body">
                <ActivityForm
                  activity={activities[currentActivity]}
                  onSubmit={handleNext}
                />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <ActivitySummary
              activities={activities}
              currentIndex={currentActivity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
