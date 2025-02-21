// routes/products/index.js
import express from "express";
import allProductsRouter from "./all.js";
import byBrandRouter from "./byBrand.js";
import byCategoryRouter from "./byCategory.js";
import productDetailRouter from "./productDetail.js";
import productListRouter from "./productsList.js";

const router = express.Router();

// 當路徑為 /api/products（無其他路徑），則回傳全部商品
router.use("/", allProductsRouter);

// 掛載品牌入口 API：例如 /api/products/brand/1
router.use("/", byBrandRouter);

// 掛載分類入口 API：例如 /api/products/category/2
router.use("/", byCategoryRouter);

// 掛載產品列表 API：例如 /api/products/new
router.use("/", productListRouter);

// 掛載產品詳細資訊 API：例如 /api/products/product/123
router.use("/", productDetailRouter);

export default router;
