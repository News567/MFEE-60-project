"use client";
import React from "react";
import CouponCard from "../../components/CouponCard";

export default function CouponClaimList({ coupons, loading, error, onClaim }) {
  if (loading) return <div>載入中...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4 mb-2" id="couponContainer">
      {coupons.map((coupon, index) => (
        <div key={`${coupon.id}-${index}`}>
          <CouponCard coupon={coupon} onClaim={onClaim} />
        </div>
      ))}
    </div>
  );
}
