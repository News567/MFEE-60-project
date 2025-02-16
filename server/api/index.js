import express from "express";
import "dotenv/config.js";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import createError from "http-errors";

// 路由模組
import productRouter from "../routes/products/index.js";
import favoritesRouter from "../routes/favorites/index.js";
import cartRouter from "../routes/cart/index.js";
import categoriesRouter from "../routes/categories/index.js";
import brandRouter from "../routes/brands/index.js";
import activityRouter from "../routes/activity/index.js";
import rentRouter from "../routes/rent/index.js";
import rentDetailRouter from "../routes/rent/detail.js";

// 建立 Express 應用程式
const app = express();

// 設定 CORS
app.use(
  cors({
    origin: "http://localhost:3000", // 只允許前端的域名
    credentials: true,
  })
);

// 中間件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "../public")));

// 測試 API
app.get("/", (req, res) => {
  res.json({ message: "Express server is running" });
});

// API 路由
const apiRouter = express.Router();
app.use("/api", apiRouter);

// 產品相關路由
apiRouter.use("/products", productRouter); // 負責 `/api/products`

// 收藏相關路由
apiRouter.use("/favorites", favoritesRouter); // 負責 `/api/favorites`

// 購物車相關路由
apiRouter.use("/cart", cartRouter); // 負責 `/api/cart`

// 分類相關路由
apiRouter.use("/categories", categoriesRouter); // 負責 `/api/categories`

// 品牌相關路由
apiRouter.use("/brands", brandRouter); // 負責 `/api/brands`

// 活動相關路由
apiRouter.use("/activity", activityRouter);

// 租借相關路由
apiRouter.use("/rent", rentRouter); // 負責 `/api/rent`
apiRouter.use("/rent", rentDetailRouter); // 負責 `/api/rent/:id`

// 捕捉 404 錯誤
app.use((req, res, next) => {
  next(createError(404));
});

// 錯誤處理
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ status: "error", message: err.message });
});

// 啟動伺服器
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`後端伺服器運行在 http://localhost:${port}`);
});

export default app;
