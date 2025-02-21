"use client";
import { useState, useEffect } from "react";
import "./cart1.css";
import { useRouter } from "next/navigation";
import CartFlow from "../components/cartFlow";
import CartHeader from "../components/CartHeader";
import BatchActions from "../components/BatchActions";
import CartItem from "../components/CartItem";
import { useCart } from "@/hooks/cartContext";

const Cart1 = () => {
  const router = useRouter();
  const userId = 1; // 這裡要改成實際的用戶ID
  const { cartData, loading, error, fetchCart, selectedItems, removeFromCart } =
    useCart();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCart(userId);
  }, [userId]);

  if (loading) {
    return <div>載入中...</div>;
  }

  if (error) {
    return <div>錯誤: {error}</div>;
  }

  // 如果 cartData 為 []，顯示空購物車
  if (
    cartData.products?.length === 0 &&
    cartData.activities?.length === 0 &&
    cartData.rentals?.length === 0
  ) {
    return (
      <div className="cartCss">
        <div className="container py-5">
          <CartFlow currentStep={1} />
          <div className="card">
            <div className="card-body text-center py-5">
              <h5>購物車是空的</h5>
              <button
                className="btn btn-primary mt-3"
                onClick={() => router.push("/products")}
              >
                去購物
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { products = [], activities = [], rentals = [], total = {} } = cartData;

  return (
    <div>
      <div className="cartCss">
        <div className="container py-5">
          <CartFlow currentStep={1} />
          <div className="row mt-3">
            <div className="col-12">
              {/* 一般商品區塊 */}
              {products.length > 0 && (
                <div className="card mb-3">
                  <CartHeader title="一般商品" totalItems={products.length} />
                  <div className="card-body">
                    <BatchActions type="products" />
                    {products.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image: "/article-5ae9687eec0d4.jpg" || item.image_url,
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
              {activities.length > 0 && (
                <div className="card mb-3">
                  <CartHeader title="活動商品" totalItems={activities.length} />
                  <div className="card-body">
                    <BatchActions type="activities" />
                    {activities.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image:
                            "./article-5ae9687eec0d4.jpg" || item.image_url,
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
              {rentals.length > 0 && (
                <div className="card mb-3">
                  <CartHeader title="租賃商品" totalItems={rentals.length} />
                  <div className="card-body">
                    <BatchActions type="rentals" />
                    {rentals.map((item) => (
                      <CartItem
                        key={item.id}
                        item={{
                          ...item,
                          image:
                            "./article-5ae9687eec0d4.jpg" || item.image_url,
                          name: item.rental_name,
                          rentalInfo: `${item.start_date} ~ ${item.end_date} (${item.rental_days}天)`,
                          deposit: item.deposit_fee,
                        }}
                        type="rentals"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 訂單總計 */}
              {(products.length > 0 ||
                activities.length > 0 ||
                rentals.length > 0) && (
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col text-end">
                        {total.rentals?.deposit > 0 && (
                          <div className="text-muted mb-2">
                            租賃押金：NT$ {total.rentals.deposit}
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="me-3">總計金額：</span>
                          <span className="h4 text-danger mb-0">
                            NT$ {total.final || 0}
                          </span>
                        </div>
                        <small className="text-muted">
                          結帳後可獲得 {Math.floor((total.final || 0) / 100)}{" "}
                          點購物金
                        </small>
                      </div>
                      <div className="col-auto">
                        <button
                          className="btn btn-primary btn-lg"
                          onClick={() => router.push("/cart/step2")}
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
        </div>
      </div>
    </div>
  );
};

export default Cart1;
