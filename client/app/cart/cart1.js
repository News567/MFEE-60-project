"use client";
import React from "react";
import "./cart1.css";
import { useRouter } from "next/navigation";

const Cart1 = () => {
  const router = useRouter();
  return (
    <div>
      <div className="cartCss">
        <div className="container py-5">
          <div className="d-flex align-items-start justify-content-between">
            {/* 步驟1 */}
            <div className="text-center position-relative">
              <div className="step-badge bg-primary text-white d-inline-flex rounded-circle align-items-center justify-content-center">
                1
              </div>
              <div className="mt-2">確認購物車</div>
            </div>
            {/* 連接線1 */}
            <div className="step-connector" />
            {/* 步驟2 */}
            <div className="text-center position-relative">
              <div className="step-badge bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center">
                2
              </div>
              <div className="mt-2">
                付款及運送方式
                <br />
                優惠券填寫
              </div>
            </div>
            {/* 連接線2 */}
            <div className="step-connector" />
            {/* 步驟3 */}
            <div className="text-center position-relative">
              <div className="step-badge bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center">
                3
              </div>
              <div className="mt-2">完成訂購</div>
            </div>
          </div>
          {/*-----------------------------------------------------*/}
          <div className="row mt-3">
            <div className="col-12">
              <div className="card mb-3">
                <div className="card-header">
                  <h5 className="mb-0">購物車(1件)</h5>
                </div>
                <div className="card-body">
                  {/* 全選和批量操作區 */}
                  <div className="row g-0 py-2 border-bottom align-items-center">
                    <div className="col-1">
                      <input type="checkbox" className="ms-2" id="selectAll" />
                    </div>
                    <div className="col">
                      <label
                        htmlFor="selectAll"
                        className="mb-0"
                        style={{ fontSize: 14 }}
                      >
                        全選
                      </label>
                    </div>
                    <div className="col-auto me-3">
                      <div
                        className="d-flex gap-3 text-muted"
                        style={{ fontSize: 14 }}
                      >
                        <button
                          className="btn p-0 text-muted batch-action"
                          disabled
                        >
                          加入收藏 <span className="selected-count" />
                        </button>
                        <button
                          className="btn p-0 text-muted batch-action"
                          disabled
                        >
                          刪除 <span className="selected-count" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 商品列表 */}
                  <div className="row g-0 py-3 align-items-center border-bottom">
                    <div className="col-1">
                      <input type="checkbox" className="ms-2" />
                    </div>
                    {/* 商品資訊區 */}
                    <div className="col-4 d-flex align-items-start gap-2">
                      <img
                        src="https://picsum.photos/100/100"
                        className="img-thumbnail"
                        style={{ width: 80, height: 80 }}
                      />
                      <div className="flex-grow-1">
                        <div className="mb-2">產品名稱</div>
                      </div>
                    </div>
                    {/* 規格區 */}
                    <div className="col-2">
                      <div className="spec-display">
                        <div>
                          <div className="spec-row">
                            <span className="spec-title">尺碼：</span>
                            <span className="spec-value">XL</span>
                          </div>
                          <div className="spec-row">
                            <span className="spec-title">顏色：</span>
                            <span className="spec-value">灰色</span>
                          </div>
                        </div>
                        <span className="edit-mark">修改</span>
                      </div>
                    </div>
                    {/* 單價 */}
                    <div className="col-1 text-center">
                      <div className="text-muted">$65</div>
                    </div>
                    {/* 數量 */}
                    <div className="col-2 d-flex justify-content-center align-items-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        style={{ width: 30 }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control form-control-sm text-center"
                        style={{ width: 45 }}
                        defaultValue={1}
                      />
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        style={{ width: 30 }}
                      >
                        +
                      </button>
                    </div>
                    {/* 小計 */}
                    <div className="col-1 text-center text-danger">$65</div>
                    {/* 收藏和刪除按鈕 */}
                    <div className="col-1 text-center">
                      <div className="d-flex flex-column align-items-center gap-2">
                        <button className="btn p-0 text-muted">加入收藏</button>
                        <button className="btn p-0 text-muted">刪除</button>
                      </div>
                    </div>
                  </div>
                  {/* 優惠提示區 */}
                  <div className="row py-3">
                    <div className="col-8">
                      <div>尚有更多精彩優惠等著你！目前未享用：</div>
                      <div className="d-flex gap-2">
                        <div className="text-primary">優惠促銷</div>
                        <div>
                          全館結帳滿3000免運 <span>再買NT$1000</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-4 d-flex justify-content-end text-primary">
                      <a>繼續購物</a>
                    </div>
                  </div>
                </div>
              </div>
              {/* 推薦商品區 */}
              <div className="card mb-3">
                <div className="card-header">
                  <h5 className="mb-0">海編推推好物</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 col-md-3">
                      {" "}
                      {/* 響應式設計 */}
                      <div className="card h-100 shadow-sm">
                        {" "}
                        {/* 增加卡片陰影 */}
                        <div className="d-flex p-2">
                          <img
                            src="https://picsum.photos/100/100"
                            className="img-thumbnail flex-shrink-0"
                            style={{ width: 100, height: 100 }}
                          />
                          <div className="d-flex flex-column ms-2 w-100">
                            <div className="fw-bold">商品名稱</div>
                            <div className="text-danger mt-1">NT$480</div>
                            <div className="mt-auto">
                              {" "}
                              {/* 固定按鈕在底部 */}
                              <button className="btn btn-sm btn-outline-primary w-100">
                                加入購物車
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 訂單總計和結帳按鈕 */}
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col text-end">
                      <div className="mb-2">
                        <span className="me-3">總計金額：</span>
                        <span className="h4 text-danger mb-0">NT$ 1,200</span>
                      </div>
                      <small className="text-muted">
                        結帳後可獲得 12 點購物金
                      </small>
                    </div>
                    <div className="col-auto">
                      <a
                        href="cart2.html"
                        className="btn btn-primary btn-lg"
                        onClick={() => router.push("/cart/step2")}
                      >
                        前往結帳
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart1;
