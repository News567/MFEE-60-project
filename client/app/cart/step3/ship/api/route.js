import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(request) {
  let body = null;

  try {
    body = await request.formData();
    console.log("body", body);
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 200 });
  }

  // 修改回調函數
  redirect(`/cart/step3/ship/callback?${new URLSearchParams(body).toString()}`);
}

// 測試用
// export async function GET(request) {
//   return NextResponse.json({ message: 'hello' }, { status: 200 })
// }
