import { useCart } from "@/hooks/cartContext";

// 加入購物車
const handleAddToCart = async () => {
  //放入要送往後端的useState 取得目前你點擊得商品/租賃/活動
  //規格
  //舉例
  const currentRental = getCurrentRental();
  const currentActivity = getCurrentActivity();


  try {
    //---- 發送購物車請求----
    //租賃
    const rental = {
      userId: 1, //(寫死)
      type: "rental",   //(寫死)
      rentalId: 1, //(綁定資料來源 rental.id之類的)
      quantity: 5, //(綁定按鈕)
      startDate: "2025-02-20", //(綁定按鈕)
      endDate: "2025-02-25", //(綁定按鈕)
    };

    //活動
    const activity = {
      userId: 1, //(寫死)
      type: "activity", //(寫死)
      projectId: 1, //(綁定資料來源)
      quantity: 1, //(綁定按鈕)
      date: "2025-02-20", //(綁定按鈕)
      time: "10:00:00", //(綁定按鈕)
    };

    //   下面不動
    const response = await axios.post(`${API_BASE_URL}/cart/add`, cartData);

    if (response.data.success) {
      //讓購物車重新從後端獲取最新數據，而不是自己組裝 cartItem
      fetchCart(1);
      alert("成功加入購物車！");
    } else {
      alert(response.data.message || "加入購物車失敗");
    }
  } catch (error) {
    console.error("加入購物車失敗:", error);
    alert("加入購物車失敗，請稍後再試");
  }
};

// 最後把這個handleAddToCart綁定到加入購物車按鈕上
