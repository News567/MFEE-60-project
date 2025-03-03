import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// 獲取單一訂單的詳細資訊
router.get("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. 查詢訂單基本資訊
    const [orderRows] = await connection.execute(
      `SELECT o.id, o.user_id, o.total_price, o.status, o.createdAt, 
              o.payment_method, o.transaction_id, o.payment_time, o.payment_status, o.points
       FROM orders o 
       WHERE o.id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到訂單資訊",
      });
    }

    const orderInfo = orderRows[0];

    // 2. 查詢訂單配送資訊
    const [shippingRows] = await connection.execute(
      `SELECT id, order_id, recipient_name, recipient_phone, shipping_address, 
              shipping_method, store_id, store_name, store_address, createdAt
       FROM order_shipping_info
       WHERE order_id = ?`,
      [orderId]
    );

    // 3. 查詢訂單中的一般商品
    const [productItems] = await connection.execute(
      `SELECT oi.id, oi.variant_id, oi.quantity, oi.price,
              pv.product_id, p.name as product_name, c.name as color_name, 
              s.name as size_name, pi.image_url
       FROM order_items oi
       JOIN product_variant pv ON oi.variant_id = pv.id
       JOIN product p ON pv.product_id = p.id
       LEFT JOIN color c ON pv.color_id = c.id
       LEFT JOIN size s ON pv.size_id = s.id
       LEFT JOIN product_images pi ON pv.product_id = pi.product_id AND pi.is_main = 1
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // 4. 查詢訂單中的活動商品
    const [activityItems] = await connection.execute(
      `SELECT oai.id, oai.activity_project_id, oai.quantity, oai.date, oai.time, oai.total_price,
              ap.name as project_name, a.name as activity_name, ai.img_url as image_url
       FROM order_activity_items oai
       JOIN activity_project ap ON oai.activity_project_id = ap.id
       JOIN activity a ON ap.activity_id = a.id
       LEFT JOIN activity_image ai ON a.id = ai.activity_id AND ai.is_main = 1
       WHERE oai.order_id = ?`,
      [orderId]
    );

    // 5. 查詢活動商品的參與者資訊
    const activityParticipants = [];

    for (const item of activityItems) {
      const [participants] = await connection.execute(
        `SELECT id, is_representative, traveler_cn_name, traveler_en_name, 
                traveler_id_number, traveler_phone, note
         FROM order_activity_travelers
         WHERE order_activity_id = ?`,
        [item.id]
      );

      activityParticipants.push({
        activityItemId: item.id,
        participants,
      });
    }

    // 6. 查詢訂單中的租賃商品
    const [rentalItems] = await connection.execute(
      `SELECT ori.id, ori.rental_id, ori.start_date, ori.end_date, ori.quantity,
              ori.price_per_day, ori.total_price, ori.deposit,
              ri.name as rental_name, ri_img.img_url as image_url
       FROM order_rental_items ori
       JOIN rent_item ri ON ori.rental_id = ri.id
       LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
       WHERE ori.order_id = ?`,
      [orderId]
    );

    // 7. 查詢使用者資訊
    const [userRows] = await connection.execute(
      `SELECT id, name, phone, email, address
       FROM users
       WHERE id = ?`,
      [orderInfo.user_id]
    );

    // 取得訂單狀態的中文描述
    const getOrderStatusText = (status, paymentStatus) => {
      if (status === "canceled") return "已取消";

      switch (paymentStatus) {
        case "pending":
          return "待付款";
        case "paid":
          if (status === "shipped") return "已出貨";
          if (status === "delivered") return "已送達";
          return "已付款";
        case "failed":
          return "付款失敗";
        case "refunded":
          return "已退款";
        default:
          return "處理中";
      }
    };

    // 整合數據
    const orderData = {
      orderInfo: {
        orderId: orderInfo.id,
        orderNumber: `OD${String(orderInfo.id).padStart(8, "0")}`,
        orderDate: orderInfo.createdAt,
        orderStatus: orderInfo.status,
        orderStatusText: getOrderStatusText(
          orderInfo.status,
          orderInfo.payment_status
        ),
        statusCode: orderInfo.status, // 保留原始狀態碼，前端可能需要判斷
        totalAmount: orderInfo.total_price,
        rewardPoints: orderInfo.points || 0,
      },
      paymentInfo: {
        method: orderInfo.payment_method,
        methodText: (() => {
          switch (orderInfo.payment_method) {
            case "credit_card":
              return "信用卡";
            case "linepay":
              return "LINE Pay";
            case "ecpay":
              return "綠界支付";
            default:
              return orderInfo.payment_method || "未指定";
          }
        })(),
        status: orderInfo.payment_status,
        statusText: (() => {
          switch (orderInfo.payment_status) {
            case "paid":
              return "付款成功";
            case "pending":
              return "待付款";
            case "failed":
              return "付款失敗";
            case "refunded":
              return "已退款";
            default:
              return "處理中";
          }
        })(),
        transactionId: orderInfo.transaction_id,
        paymentTime: orderInfo.payment_time,
        cardLast4: orderInfo.card_last4, // 資料庫可能需要增加這個欄位
        cardBrand: orderInfo.card_brand, // 資料庫可能需要增加這個欄位
      },
      shippingInfo:
        shippingRows.length > 0
          ? {
              id: shippingRows[0].id,
              method:
                shippingRows[0].shipping_method === "home_delivery"
                  ? "宅配到府"
                  : "超商取貨",
              methodCode: shippingRows[0].shipping_method, // 原始代碼，前端可能需要判斷
              recipient: shippingRows[0].recipient_name,
              phone: shippingRows[0].recipient_phone,
              address: shippingRows[0].shipping_address,
              // 超商取貨相關資訊
              storeId: shippingRows[0].store_id,
              storeName: shippingRows[0].store_name,
              storeAddress: shippingRows[0].store_address,
              // 物流資訊
              trackingNumber: null, // 資料庫可能需要增加這個欄位
              shippingCarrier: null, // 資料庫可能需要增加這個欄位
              shippingStatus: null, // 資料庫可能需要增加這個欄位
              shippingDate: null, // 資料庫可能需要增加這個欄位
              deliveryDate: null, // 資料庫可能需要增加這個欄位
              estimatedDelivery: "2-3 個工作天",
              createdAt: shippingRows[0].createdAt,
            }
          : null,
      items: {
        products: productItems.map((item) => ({
          id: item.id,
          productId: item.product_id,
          variantId: item.variant_id,
          name: item.product_name,
          color: item.color_name,
          size: item.size_name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
          image: item.image_url,
        })),
        activities: activityItems.map((item) => {
          const participantsData = activityParticipants.find(
            (p) => p.activityItemId === item.id
          );

          return {
            id: item.id,
            activityProjectId: item.activity_project_id,
            name: item.activity_name,
            projectName: item.project_name,
            date: item.date,
            time: item.time,
            quantity: item.quantity,
            price: item.total_price,
            image: item.image_url,
            participants: participantsData
              ? participantsData.participants.map((p) => ({
                  name: p.traveler_cn_name,
                  englishName: p.traveler_en_name,
                  phone: p.traveler_phone,
                  idNumber: p.traveler_id_number,
                  isRepresentative: p.is_representative === 1,
                  note: p.note,
                }))
              : [],
          };
        }),
        rentals: rentalItems.map((item) => {
          // 計算租賃天數
          const startDate = new Date(item.start_date);
          const endDate = new Date(item.end_date);
          const rentalDays =
            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

          return {
            id: item.id,
            rentalId: item.rental_id,
            name: item.rental_name,
            startDate: item.start_date,
            endDate: item.end_date,
            rentalDays,
            pricePerDay: item.price_per_day,
            quantity: item.quantity,
            rentalFee: item.total_price,
            deposit: item.deposit,
            image: item.image_url,
          };
        }),
      },
      userInfo:
        userRows.length > 0
          ? {
              id: userRows[0].id,
              name: userRows[0].name,
              phone: userRows[0].phone,
              email: userRows[0].email,
              address: userRows[0].address,
            }
          : null,
    };

    await connection.commit();

    res.json({
      success: true,
      data: orderData,
    });
  } catch (error) {
    await connection.rollback();
    console.error("獲取訂單資訊失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取訂單資訊失敗",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

// 查詢用戶的所有訂單
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 查詢用戶所有訂單基本資訊
    const [orderRows] = await pool.execute(
      `SELECT o.id, o.total_price, o.status, o.createdAt, o.payment_method, o.payment_status
       FROM orders o 
       WHERE o.user_id = ?
       ORDER BY o.createdAt DESC`,
      [userId]
    );

    // 查詢每個訂單的商品數量
    const ordersWithItemCounts = await Promise.all(
      orderRows.map(async (order) => {
        // 一般商品數量
        const [productCount] = await pool.execute(
          "SELECT SUM(quantity) as count FROM order_items WHERE order_id = ?",
          [order.id]
        );

        // 活動商品數量
        const [activityCount] = await pool.execute(
          "SELECT SUM(quantity) as count FROM order_activity_items WHERE order_id = ?",
          [order.id]
        );

        // 租賃商品數量
        const [rentalCount] = await pool.execute(
          "SELECT SUM(quantity) as count FROM order_rental_items WHERE order_id = ?",
          [order.id]
        );

        // 訂單第一個商品資訊 (用於預覽)
        const [firstItem] = await pool.execute(
          `SELECT 'product' as type, p.name, pi.image_url
           FROM order_items oi
           JOIN product_variant pv ON oi.variant_id = pv.id
           JOIN product p ON pv.product_id = p.id
           LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_main = 1
           WHERE oi.order_id = ?
           LIMIT 1`,
          [order.id]
        );

        if (firstItem.length === 0) {
          const [firstActivity] = await pool.execute(
            `SELECT 'activity' as type, a.name, ai.img_url as image_url
             FROM order_activity_items oai
             JOIN activity_project ap ON oai.activity_project_id = ap.id
             JOIN activity a ON ap.activity_id = a.id
             LEFT JOIN activity_image ai ON a.id = ai.activity_id AND ai.is_main = 1
             WHERE oai.order_id = ?
             LIMIT 1`,
            [order.id]
          );

          if (firstActivity.length === 0) {
            const [firstRental] = await pool.execute(
              `SELECT 'rental' as type, ri.name, ri_img.img_url as image_url
               FROM order_rental_items ori
               JOIN rent_item ri ON ori.rental_id = ri.id
               LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
               WHERE ori.order_id = ?
               LIMIT 1`,
              [order.id]
            );

            return {
              ...order,
              orderNumber: `OD${String(order.id).padStart(8, "0")}`,
              totalItems:
                (productCount[0].count || 0) +
                (activityCount[0].count || 0) +
                (rentalCount[0].count || 0),
              firstItem: firstRental.length > 0 ? firstRental[0] : null,
            };
          }

          return {
            ...order,
            orderNumber: `OD${String(order.id).padStart(8, "0")}`,
            totalItems:
              (productCount[0].count || 0) +
              (activityCount[0].count || 0) +
              (rentalCount[0].count || 0),
            firstItem: firstActivity[0],
          };
        }

        return {
          ...order,
          orderNumber: `OD${String(order.id).padStart(8, "0")}`,
          totalItems:
            (productCount[0].count || 0) +
            (activityCount[0].count || 0) +
            (rentalCount[0].count || 0),
          firstItem: firstItem[0],
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItemCounts,
    });
  } catch (error) {
    console.error("獲取用戶訂單失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取用戶訂單失敗",
      error: error.message,
    });
  }
});

// 獲取訂單的物流狀態
router.get("/:orderId/shipping", async (req, res) => {
  const { orderId } = req.params;

  try {
    // 查詢訂單配送資訊
    const [shippingInfo] = await pool.execute(
      `SELECT osi.id, osi.shipping_method, osi.recipient_name, osi.recipient_phone, 
              osi.shipping_address, osi.store_id, osi.store_name, osi.store_address
       FROM order_shipping_info osi
       WHERE osi.order_id = ?`,
      [orderId]
    );

    if (shippingInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到訂單配送資訊",
      });
    }

    // 查詢訂單狀態
    const [orderStatus] = await pool.execute(
      `SELECT status, payment_status FROM orders WHERE id = ?`,
      [orderId]
    );

    // 這裡應該有更多的物流資訊查詢，例如從物流服務商API獲取最新狀態
    // 下面是模擬的物流狀態數據
    const shippingStatus = {
      currentStatus: orderStatus[0].status,
      trackingNumber:
        "SF" + Math.floor(1000000000 + Math.random() * 9000000000),
      carrier: "中華郵政",
      shippingDate:
        orderStatus[0].status === "shipped"
          ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          : null,
      estimatedDelivery:
        orderStatus[0].status === "shipped"
          ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
          : null,
      deliveryDate:
        orderStatus[0].status === "delivered"
          ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          : null,
      statusHistory: [
        {
          status: "order_created",
          statusText: "訂單已建立",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          status: "payment_received",
          statusText: "已收到付款",
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
      ],
    };

    // 根據訂單狀態添加模擬物流狀態紀錄
    if (
      orderStatus[0].status === "shipped" ||
      orderStatus[0].status === "delivered"
    ) {
      shippingStatus.statusHistory.push({
        status: "processing",
        statusText: "訂單處理中",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      });

      shippingStatus.statusHistory.push({
        status: "shipped",
        statusText: "商品已出貨",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      });
    }

    if (orderStatus[0].status === "delivered") {
      shippingStatus.statusHistory.push({
        status: "delivered",
        statusText: "商品已送達",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      });
    }

    res.json({
      success: true,
      data: {
        shippingInfo: shippingInfo[0],
        shippingStatus,
      },
    });
  } catch (error) {
    console.error("獲取訂單物流資訊失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取訂單物流資訊失敗",
      error: error.message,
    });
  }
});

export default router;
