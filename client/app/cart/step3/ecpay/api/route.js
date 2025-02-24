import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // 將 formData 轉換為查詢字串
    const queryString = new URLSearchParams(formData).toString();

    // 重導向到回調頁面
    redirect(`/cart/step3/ecpay/callback?${queryString}`);
  } catch (error) {
    console.error("處理綠界回調時發生錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        message: "處理付款回調時發生錯誤",
      },
      { status: 500 }
    );
  }
}

// 測試用
// export async function GET(request) {
//   return NextResponse.json({ message: 'hello' }, { status: 200 })
// }
