"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/cartContext";
import CartFlow from "../components/cartFlow";
import ActivityForm from "./components/ActivityForm";
import ActivitySummary from "./components/ActivitySummary";
import "./step2.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:3005/api";

export default function Cart3() {
  const router = useRouter();
  const { cartData, submitActivityTravelers } = useCart();
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (cartData.activities && cartData.activities.length > 0) {
      const formattedActivities = cartData.activities.map((activity) => ({
        id: activity.id,
        name: activity.activity_name,
        date: activity.date,
        time: activity.time,
        location: activity.location || "地點待定",
        provider: activity.provider || "未指定",
        price: activity.price,
        quantity: activity.quantity,
        isLastActivity: false, // 將在下面更新
      }));

      // 標記最後一個活動
      formattedActivities[formattedActivities.length - 1].isLastActivity = true;

      setActivities(formattedActivities);
    } else {
      router.push("/cart/step1");
    }
  }, [cartData, router]);

  const handleNext = async (travelersData) => {
    try {
      const currentActivityData = activities[currentActivity];

      // 直接將旅客資料存儲到 localStorage
      const storedTravelers = JSON.parse(
        localStorage.getItem("activityTravelers") || "{}"
      );
      storedTravelers[currentActivityData.id] = travelersData;
      localStorage.setItem(
        "activityTravelers",
        JSON.stringify(storedTravelers)
      );

      const success = true; // 因為我們只是存儲到 localStorage，所以不會失敗

      if (success) {
        if (currentActivity < activities.length - 1) {
          // 還有下一個活動，繼續填寫
          setCurrentActivity((prev) => prev + 1);
        } else {
          // 所有活動都填寫完成，導向下一步
          router.push("/cart/step3");
        }
      }
    } catch (error) {
      console.error("提交旅客資料失敗:", error);
    }
  };

  // 如果活動資料還未載入，顯示載入中
  if (activities.length === 0) {
    return <div>載入中...</div>;
  }

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
                <div className="mb-3">
                  <strong>
                    需填寫 {activities[currentActivity].quantity} 位旅客資料
                  </strong>
                </div>
                <ActivityForm
                  activity={{
                    ...activities[currentActivity],
                    currentTraveler: 1,
                  }}
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
