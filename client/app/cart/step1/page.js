"use client";
import { useState, useEffect, useMemo } from "react";
import "./cart1.css";
import { useRouter } from "next/navigation";
import CartFlow from "../components/cartFlow";
import CartHeader from "../components/CartHeader";
import BatchActions from "../components/BatchActions";
import CartItem from "../components/CartItem";
import { useCart } from "@/hooks/cartContext";

const Cart1 = () => {
  const router = useRouter();
  const userId = 1;
  const { cartData, fetchCart, selectedItems, proceedToCheckout } = useCart();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 計算商品小計
  const calculateSubtotal = () => {
    return cartData.total?.final || 0;
  };

  // 計算運費
  const calculateShipping = () => {
    // 如果只有活動商品，不需要運費
    if (hasOnlyActivities) {
      return 0;
    }
    // 根據配送方式計算運費
    const subtotal = calculateSubtotal();
    return subtotal >= 1000 ? 0 : 60; // step1 階段都用超商運費計算
  };

  // 計算總金額
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  // 計算單個商品的小計
  const calculateItemSubtotal = (item, type) => {
    switch (type) {
      case "products":
        return Number(item.price) * item.quantity;
      case "activities":
        return Number(item.price) * item.quantity;
      case "rentals":
        return Number(item.discounted_price) * item.rental_days * item.quantity;
      default:
        return 0;
    }
  };

  // 使用 useMemo 計算所有金額
  const totals = useMemo(() => {
    const selectedProducts = cartData.products.filter((item) =>
      selectedItems.products.includes(item.id)
    );
    const selectedActivities = cartData.activities.filter((item) =>
      selectedItems.activities.includes(item.id)
    );
    const selectedRentals = cartData.rentals.filter((item) =>
      selectedItems.rentals.includes(item.id)
    );

    const productsTotal = selectedProducts.reduce(
      (sum, item) => sum + calculateItemSubtotal(item, "products"),
      0
    );
    const activitiesTotal = selectedActivities.reduce(
      (sum, item) => sum + calculateItemSubtotal(item, "activities"),
      0
    );
    const rentalsTotal = selectedRentals.reduce(
      (sum, item) => sum + calculateItemSubtotal(item, "rentals"),
      0
    );

    // 計算租賃押金總額
    const deposit = selectedRentals.reduce(
      (sum, item) => sum + Number(item.deposit_fee || 0) * item.quantity,
      0
    );

    return {
      products: productsTotal,
      activities: activitiesTotal,
      rentals: rentalsTotal,
      deposit,
      subtotal: productsTotal + activitiesTotal + rentalsTotal,
      total: productsTotal + activitiesTotal + rentalsTotal + deposit,
    };
  }, [cartData, selectedItems]);

  useEffect(() => {
    // 簡化 useEffect，只負責獲取購物車數據
    fetchCart(userId).finally(() => {
      setIsInitialLoad(false);
    });
  }, [userId]); // 只依賴 userId

  // 在初始載入時不顯示任何內容
  if (isInitialLoad) {
    return null;
  }

  // 確保資料載入後才進行空購物車的判斷
  const isEmpty =
    !cartData.products?.length &&
    !cartData.activities?.length &&
    !cartData.rentals?.length;

  return (
    <div className="cartCss">
      <div className="container py-5">
        <CartFlow currentStep={1} />
        {isEmpty ? (
          <div className="card">
            <div className="card-body text-center py-4">
              <h5>購物車是空的</h5>
              <button
                className="btn btn-primary mt-3"
                onClick={() => router.push("/products")}
              >
                去購物
              </button>
            </div>
          </div>
        ) : (
          <div className="row mt-3">
            <div className="col-12">
              {/* 一般商品區塊 */}
              {cartData.products?.length > 0 && (
                <div className="card mb-3">
                  <CartHeader
                    title="一般商品"
                    totalItems={cartData.products.length}
                  />
                  <div className="card-body">
                    <BatchActions type="products" />
                    {cartData.products.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image: "/article-5ae9687eec0d4.jpg",
                          name: item.product_name,
                          color: item.color_name,
                          size: item.size_name,
                        }}
                        type="products"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 活動商品區塊 */}
              {cartData.activities?.length > 0 && (
                <div className="card mb-3">
                  <CartHeader
                    title="活動商品"
                    totalItems={cartData.activities.length}
                  />
                  <div className="card-body">
                    <BatchActions type="activities" />
                    {cartData.activities.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image: "./article-5ae9687eec0d4.jpg",
                          name: item.activity_name,
                          activityInfo: `${item.date} ${item.time}`,
                        }}
                        type="activities"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 租賃商品區塊 */}
              {cartData.rentals?.length > 0 && (
                <div className="card mb-3">
                  <CartHeader
                    title="租賃商品"
                    totalItems={cartData.rentals.length}
                  />
                  <div className="card-body">
                    <BatchActions type="rentals" />
                    {cartData.rentals.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image: "./article-5ae9687eec0d4.jpg",
                          name: item.rental_name,
                          rentalInfo: `${item.start_date} ~ ${item.end_date} (${item.rental_days}天)`,
                          deposit: item.deposit,
                        }}
                        type="rentals"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 訂單總計 */}
              {!isEmpty && (
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col text-end">
                        {totals.deposit > 0 && (
                          <div className="text-muted mb-2">
                            租賃押金：NT$ {totals.deposit}
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="me-3">總計金額：</span>
                          <span className="h4 text-danger mb-0">
                            NT$ {totals.total}
                          </span>
                        </div>
                        <small className="text-muted">
                          結帳後可獲得 {Math.floor(totals.total / 100)} 點購物金
                        </small>
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={proceedToCheckout}
                        >
                          前往結帳
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart1;
