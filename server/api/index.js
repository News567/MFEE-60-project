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
import activityDetailRouter from "../routes/activity/detail.js";
import groupRouter from "../routes/group/index.js";
import groupListRouter from "../routes/group/list.js";
import groupDetailRouter from "../routes/group/detail.js";
import groupCreate from "../routes/group/create.js";
import groupJoin from "../routes/group/join.js";
import rentRouter from "../routes/rent/index.js";
import rentCategoryRouter from "../routes/rent/categories.js";
import rentBrandCategoryRouter from "../routes/rent/brandcategories.js";
import rentColorRouter from "../routes/rent/colors.js";
import rentNewRouter from "../routes/rent/new-arrivals.js";
import rentDiscountedRouter from "../routes/rent/new-discounted.js";
import rentFilterRouter from "../routes/rent/filter.js";
import rentDetailRouter from "../routes/rent/detail.js";
import rentRecommendedRouter from "../routes/rent/recommended.js";
import articleRouter from "../routes/article/index.js"; // 文章列表 & 動態文章頁
import articleCreateRouter from "../routes/article/create.js"; // 取得新建文章所需的分類/標籤 & 新增文章
import articleSidebarRouter from "../routes/article/sidebar.js"; // 側邊欄篩選數據
import articleReplyRouter from "../routes/article/reply.js"; // 留言 & 回覆
import articleLikeRouter from "../routes/article/like.js"; // 文章與留言按讚
import couponRouter from "../routes/coupon/index.js";
import couponClaimRouter from "../routes/coupon/claim.js";
import memberRouter from "../routes/member/index.js";
// import shipmentRouter from "../routes/ship/index.js"; // 運送相關路由
import checkoutRouter from "../routes/checkout/index.js";
//ecpay
import ecpayRouter from "../routes/ecpay/index.js";
// 建立 Express 應用程式
const app = express();
// 設定 CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // 只允許前端的域名
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
// 訂單相關路由
apiRouter.use("/checkout", checkoutRouter); // 負責 `/api/checkout`

// 運送相關路由 (暫時使用next.js的api路由)
// apiRouter.use("/shipment", shipmentRouter); // 負責 `/api/shipment`

// ecpay
apiRouter.use("/ecpay", ecpayRouter); // 負責 `/api/ecpay`

// 活動相關路由
apiRouter.use("/activity", activityRouter);
apiRouter.use("/activity", activityDetailRouter);

// 揪團相關路由
apiRouter.use("/group", groupRouter);
apiRouter.use("/group", groupListRouter);
apiRouter.use("/group", groupDetailRouter);
apiRouter.use("/group", groupCreate);
apiRouter.use("/group", groupJoin);

// 租借相關路由
apiRouter.use("/rent", rentRouter); // 負責 `/api/rent`
apiRouter.use("/rent", rentCategoryRouter); // 負責 `/api/rent/categories`
apiRouter.use("/rent", rentBrandCategoryRouter); // 負責 `/api/rent/brandcategories`
apiRouter.use("/rent", rentColorRouter); // 負責 `/api/rent/colors`
apiRouter.use("/rent", rentNewRouter); // 負責 `/api/rent/new-arrivals`
apiRouter.use("/rent", rentDiscountedRouter); // 負責 `/api/rent/new-discounted`
apiRouter.use("/rent", rentFilterRouter); // 負責 `/api/rent/filter`
apiRouter.use("/rent", rentDetailRouter); // 負責 `/api/rent/:id`
apiRouter.use("/rent", rentRecommendedRouter); // 負責 `/api/rent/:id/recommended`
// 文章相關路由
apiRouter.use("/article", articleRouter); // `/api/article` 文章列表 & 文章內容
apiRouter.use("/article", articleCreateRouter); // `/api/article/create` 新增文章、取得新建文章所需數據
apiRouter.use("/article", articleSidebarRouter); // `/api/article/sidebar` 側邊欄篩選數據
apiRouter.use("/article", articleReplyRouter); // `/api/article/reply` 留言 & 回覆
apiRouter.use("/article", articleLikeRouter); // `/api/article/like` 文章 & 留言按讚

// 優惠券相關路由
apiRouter.use("/coupon", couponRouter); // 負責 `/api/coupon/index`
apiRouter.use("/coupon", couponClaimRouter); // 負責 `/api/coupon/claim`

// 會員相關路由
apiRouter.use("/member", memberRouter);

// 捕捉 404 錯誤
app.use((req, res, next) => {
  next(createError(404));
});
// 錯誤處理
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
  });
});
// 啟動伺服器
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`後端伺服器運行在 http://localhost:${port}`);
});
export default app;
