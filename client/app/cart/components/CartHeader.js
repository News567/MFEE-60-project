"use client";
import React from "react";

const CartHeader = ({ totalItems = 1, title }) => {
  return (
    <div className="card-header">
      <h5 className="mb-0">
        {title}({totalItems}件)
      </h5>
    </div>
  );
};

export default CartHeader;
