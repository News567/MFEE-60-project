"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CartFlow from "./components/cartFlow";
import { redirect } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  useEffect(() => {
    // 跳轉到第一步
    redirect("/cart/step1");
  }, []);

  return <></>;
}
