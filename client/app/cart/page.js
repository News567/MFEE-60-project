"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartFlow from "./cartFlow";

export default function CartPage() {
  const router = useRouter();

  // useEffect(() => {
  //   router.replace("/cart/step1"); // 直接跳轉到第一步
  // }, []);

  return (
    <div>
      <CartFlow currentStep={1} />
    </div>
  );
}
