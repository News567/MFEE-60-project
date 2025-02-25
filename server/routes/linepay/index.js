import express from "express";
const router = express.Router();
import * as crypto from "crypto";
import { createLinePayClient } from "line-pay-merchant";
import "dotenv/config.js";
import { serverConfig } from "../../config/server.config.js";
import { isDev, successResponse, errorResponse } from "../../lib/utils.js";

const linePayClient = createLinePayClient({
  channelId: isDev
    ? serverConfig.linePay.development.channelId
    : serverConfig.linePay.production.channelId,
  channelSecretKey: isDev
    ? serverConfig.linePay.development.channelSecret
    : serverConfig.linePay.production.channelSecret,
  env: process.env.NODE_ENV,
});

const redirectUrls = {
  confirmUrl: isDev
    ? serverConfig.linePay.development.confirmUrl
    : serverConfig.linePay.production.confirmUrl,
  cancelUrl: isDev
    ? serverConfig.linePay.development.cancelUrl
    : serverConfig.linePay.production.cancelUrl,
};

//  **改動 1：不使用 session，讓前端保存 `transactionId`**
router.get("/reserve", async (req, res) => {
  try {
    const amount = req.query.amount;
    if (!amount || isNaN(Number(amount))) {
      return errorResponse(res, "金額無效");
    }

    const items = req.query.items
      ? decodeURIComponent(req.query.items).split(",")
      : ["商品一批"];

    const orderId = req.query.orderId || crypto.randomUUID();

    const order = {
      orderId: orderId,
      currency: "TWD",
      amount: Number(amount),
      packages: [
        {
          id: crypto.randomBytes(5).toString("hex"),
          amount: Number(amount),
          products: [
            {
              id: crypto.randomBytes(5).toString("hex"),
              name: items.join(", ").substring(0, 100),
              quantity: 1,
              price: Number(amount),
            },
          ],
        },
      ],
      options: { display: { locale: "zh_TW" } },
    };

    console.log("LINE Pay 訂單資料:", order);

    const linePayResponse = await linePayClient.request.send({
      body: { ...order, redirectUrls },
    });

    if (linePayResponse.body.returnCode !== "0000") {
      return errorResponse(
        res,
        `LINE Pay 錯誤: ${linePayResponse.body.returnCode} - ${linePayResponse.body.returnMessage}`
      );
    }

    const transactionId = linePayResponse.body.info.transactionId;

    // 🚀 **不使用 session，直接讓前端保存 `transactionId`**
    successResponse(res, {
      transactionId,
      paymentUrl: linePayResponse.body.info.paymentUrl.web,
    });
  } catch (error) {
    console.error("LINE Pay Reserve 錯誤:", error);
    errorResponse(res, error.toString());
  }
});

router.get("/confirm", async (req, res) => {
  try {
    const transactionId = req.query.transactionId;
    if (!transactionId) {
      return errorResponse(res, "缺少交易編號");
    }

    const amount = req.query.amount; // 前端需要提供交易金額
    if (!amount || isNaN(Number(amount))) {
      return errorResponse(res, "金額錯誤");
    }

    const linePayResponse = await linePayClient.confirm.send({
      transactionId: transactionId,
      body: {
        currency: "TWD",
        amount: Number(amount),
      },
    });

    successResponse(res, { ...linePayResponse.body });
  } catch (error) {
    console.error("LINE Pay Confirm 錯誤:", error);
    errorResponse(res, error.toString());
  }
});

export default router;
