import express from "express";
import { pool } from "../../config/mysql.js";
import multer from "multer";

const router = express.Router();

// 設定 multer
const upload = multer();

// 1. 添加一個新的endpoint來處理多步驟結帳
router.post("/initialize", async (req, res) => {
  const { userId } = req.body;

  try {
    // 檢查購物車是否存在
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (cart.length === 0) {
      return res.status(404).json({
        success: false,
        message: "購物車不存在",
      });
    }

    const cartId = cart[0].id;

    // 檢查購物車內容並確定結帳流程
    const [hasProducts] = await pool.execute(
      "SELECT COUNT(*) as count FROM cart_items WHERE cart_id = ?",
      [cartId]
    );

    const [hasActivities] = await pool.execute(
      "SELECT COUNT(*) as count FROM cart_activity_items WHERE cart_id = ?",
      [cartId]
    );

    const [hasRentals] = await pool.execute(
      "SELECT COUNT(*) as count FROM cart_rental_items WHERE cart_id = ?",
      [cartId]
    );

    // 創建結帳流程並返回
    return res.json({
      success: true,
      data: {
        cartId,
        checkoutSteps: {
          needsActivityForm: hasActivities[0].count > 0,
          needsShippingInfo:
            hasProducts[0].count > 0 || hasRentals[0].count > 0,
        },
      },
    });
  } catch (error) {
    console.error("初始化結帳失敗:", error);
    return res.status(500).json({
      success: false,
      message: "初始化結帳失敗",
    });
  }
});

//為何我不能跟其他路由一樣都使用pool就好
/* 這是因為在處理訂單時需要確保所有操作都是作為一個完整的事務(Transaction)來執行。事務的特性是:

原子性 (Atomicity) - 所有操作要麼全部成功,要麼全部失敗
一致性 (Consistency) - 事務完成後,資料庫必須保持一致狀態

比如結帳流程中:

創建訂單
儲存訂單項目
更新購物車狀態
扣除商品庫存
儲存旅客資料

這些操作必須全部成功或全部失敗,不能出現訂單建立了但購物車狀態沒更新等情況。 */

// 3. 處理最終結帳的endpoint
// 3. 處理最終結帳的endpoint
// 3. 處理最終結帳的endpoint
router.post("/complete", async (req, res) => {
  const { userId, shippingInfo, paymentMethod, activityTravelers, couponCode } =
    req.body;

  // 驗證並轉換配送方式
  if (shippingInfo) {
    const methodMap = {
      homeDelivery: "home_delivery",
      storePickup: "convenience_store",
    };
    shippingInfo.method = methodMap[shippingInfo.method] || shippingInfo.method;

    // 驗證配送方式是否有效
    if (!["home_delivery", "convenience_store"].includes(shippingInfo.method)) {
      return res.status(400).json({
        success: false,
        message: "無效的配送方式",
      });
    }
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. 檢查購物車
    const [cart] = await connection.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (cart.length === 0) {
      throw new Error("找不到有效的購物車");
    }

    const cartId = cart[0].id;

    // 2. 檢查是否有活動商品
    const [activities] = await connection.execute(
      "SELECT COUNT(*) as count FROM cart_activity_items WHERE cart_id = ?",
      [cartId]
    );

    const hasActivities = activities[0].count > 0;

    // 如果有活動商品，檢查是否有參與者資料
    if (
      hasActivities &&
      (!activityTravelers || !Array.isArray(activityTravelers))
    ) {
      throw new Error("缺少活動參加者資料");
    }

    // 3. 計算訂單金額
    const [cartTotals] = await connection.execute(
      `
      SELECT 
        CAST(COALESCE(SUM(ci.quantity * pv.price), 0) AS DECIMAL(10,2)) as product_total,
        CAST(COALESCE(SUM(cai.quantity * ap.price), 0) AS DECIMAL(10,2)) as activity_total,
        CAST(COALESCE(SUM(
          cri.quantity * 
          COALESCE(ri.price2, ri.price) * 
          (DATEDIFF(cri.end_date, cri.start_date) + 1)
        ), 0) AS DECIMAL(10,2)) as rental_total,
        CAST(COALESCE(SUM(cri.quantity * ri.deposit), 0) AS DECIMAL(10,2)) as deposit_total
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN product_variant pv ON ci.variant_id = pv.id
      LEFT JOIN cart_activity_items cai ON c.id = cai.cart_id
      LEFT JOIN activity_project ap ON cai.activity_project_id = ap.id
      LEFT JOIN cart_rental_items cri ON c.id = cri.cart_id
      LEFT JOIN rent_item ri ON cri.rental_id = ri.id
      WHERE c.id = ?
      `,
      [cartId]
    );

    const totalAmount =
      Number(cartTotals[0].product_total) +
      Number(cartTotals[0].activity_total) +
      Number(cartTotals[0].rental_total) +
      Number(cartTotals[0].deposit_total);

    // 計算該筆訂單可獲得的點數
    const orderPoints = Math.floor(totalAmount * 0.01);

    // 4. 創建訂單
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, total_price, status, payment_method, points) VALUES (?, ?, 'pending', ?, ?)",
      [userId, totalAmount || 0, paymentMethod, orderPoints]
    );

    const orderId = orderResult.insertId;

    // 5. 保存配送資訊(如果有)
    if (shippingInfo) {
      // 判斷配送方式
      const isHomeDelivery = shippingInfo.method === "home_delivery";

      // 宅配與超商取貨的地址處理方式不同
      let shippingAddress;
      if (isHomeDelivery) {
        shippingAddress = `${shippingInfo.city}${shippingInfo.address}`;
      } else {
        shippingAddress = shippingInfo.storeAddress || "";
      }

      // 準備插入資料庫的欄位和值
      let insertQuery = `
    INSERT INTO order_shipping_info 
    (order_id, recipient_name, recipient_phone, shipping_address, shipping_method
  `;

      let insertValues = [
        orderId,
        shippingInfo.name,
        shippingInfo.phone,
        shippingAddress,
        shippingInfo.method,
      ];

      // 如果是便利商店取貨，加入商店相關欄位
      if (!isHomeDelivery) {
        insertQuery += `, store_id, store_name, store_address`;
        insertValues.push(
          shippingInfo.storeId || "",
          shippingInfo.storeName || "",
          shippingInfo.storeAddress || ""
        );
      }

      // 完成 SQL 語句
      insertQuery += `) VALUES (${insertValues.map(() => "?").join(", ")})`;

      // 執行插入
      await connection.execute(insertQuery, insertValues);

      console.log("已保存配送資訊:", {
        orderId,
        shippingMethod: shippingInfo.method,
        isHomeDelivery,
      });
    } else {
      console.log("無需保存配送資訊");
    }

    // 6. 移動購物車商品到訂單
    // 6.1 一般商品
    const [products] = await connection.execute(
      `SELECT ci.variant_id, ci.quantity, pv.price
       FROM cart_items ci
       JOIN product_variant pv ON ci.variant_id = pv.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    for (const item of products) {
      await connection.execute(
        "INSERT INTO order_items (order_id, variant_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.variant_id, item.quantity, item.price]
      );

      // 更新商品庫存
      await connection.execute(
        "UPDATE product_variant SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.variant_id]
      );
    }

    // 6.2 活動商品
    const [activityItems] = await connection.execute(
      `SELECT cai.activity_project_id, cai.quantity, cai.date, cai.time, ap.price
       FROM cart_activity_items cai
       JOIN activity_project ap ON cai.activity_project_id = ap.id
       WHERE cai.cart_id = ?`,
      [cartId]
    );

    for (const item of activityItems) {
      const [activityResult] = await connection.execute(
        `INSERT INTO order_activity_items 
         (order_id, activity_project_id, quantity, date, time, total_price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.activity_project_id,
          item.quantity,
          item.date,
          item.time,
          item.price * item.quantity,
        ]
      );

      // 如果有 traveler 資料，保存到 order_activity_travelers
      if (activityTravelers && activityTravelers.length > 0) {
        for (const traveler of activityTravelers) {
          await connection.execute(
            `INSERT INTO order_activity_travelers
             (order_activity_id, is_representative, traveler_cn_name, 
              traveler_en_name, traveler_id_number, traveler_phone, note)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              activityResult.insertId,
              traveler.isRepresentative ? 1 : 0,
              traveler.chineseName,
              traveler.englishName || null,
              traveler.idNumber,
              traveler.phone || null,
              traveler.note || null,
            ]
          );
        }
      }
    }

    // 6.3 租賃商品
    const [rentalItems] = await connection.execute(
      `SELECT cri.rental_id, cri.quantity, cri.start_date, cri.end_date,
              ri.price, ri.price2, ri.deposit
       FROM cart_rental_items cri
       JOIN rent_item ri ON cri.rental_id = ri.id
       WHERE cri.cart_id = ?`,
      [cartId]
    );

    for (const item of rentalItems) {
      const rentalDays =
        Math.ceil(
          (new Date(item.end_date) - new Date(item.start_date)) /
            (1000 * 60 * 60 * 24)
        ) + 1;

      const pricePerDay = item.price2 || item.price;
      await connection.execute(
        `INSERT INTO order_rental_items 
         (order_id, rental_id, start_date, end_date, quantity,
          price_per_day, total_price, deposit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.rental_id,
          item.start_date,
          item.end_date,
          item.quantity,
          pricePerDay,
          pricePerDay * rentalDays * item.quantity,
          item.deposit * item.quantity,
        ]
      );

      // 更新租賃商品庫存
      await connection.execute(
        "UPDATE rent_item SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.rental_id]
      );
    }

    // 7. 更新購物車狀態
    await connection.execute(
      "UPDATE carts SET status = 'checked_out' WHERE id = ?",
      [cartId]
    );

    // 8. 如果有使用優惠券，更新優惠券使用狀態
    if (couponCode) {
      await connection.execute(
        `UPDATE coupon_usage 
         SET status = '已使用', used_at = NOW() 
         WHERE coupon_id = (SELECT id FROM coupon WHERE code = ?) 
         AND users_id = ?`,
        [couponCode, userId]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      data: {
        orderId,
        totalAmount,
        cartTotals: cartTotals[0],
        points: orderPoints,
      },
      message: "訂單建立成功",
    });
  } catch (error) {
    await connection.rollback();
    console.error("結帳失敗:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      debug: {
        code: error.code,
        sqlMessage: error.sqlMessage,
      },
    });
  } finally {
    connection.release();
  }
});
export default router;
