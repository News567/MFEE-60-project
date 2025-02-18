import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  const {
    userId,
    type,
    variantId,
    projectId,
    rentalId,
    quantity,
    startDate,
    endDate,
    date,
    time,
  } = req.body;

  try {
    // 1. 基本驗證
    if (!["product", "activity", "rental"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "無效的商品類型" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "數量必須大於0" });
    }

    // 2. 檢查購物車是否存在
    let [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    let cartId = cart.length > 0 ? cart[0].id : null;

    // 如果購物車不存在，創建新的
    if (!cartId) {
      const [result] = await pool.execute(
        "INSERT INTO carts (user_id, status) VALUES (?, 'active')",
        [userId]
      );
      cartId = result.insertId;
    }

    // 3. 根據類型處理不同商品
    switch (type) {
      case "product": {
        // 檢查商品變體是否存在
        const [variant] = await pool.execute(
          "SELECT * FROM product_variant WHERE id = ? AND isDeleted = 0",
          [variantId]
        );

        // 沒有回傳 [] 所以不能用 !variant
        if (variant.length === 0) {
          return res.status(400).json({
            success: false,
            message: "找不到指定商品",
          });
        }

        // 檢查是否已在購物車中
        const [existingItem] = await pool.execute(
          "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?",
          [cartId, variantId]
        );

        //existingItem = [{ id:1,quantity:1}]

        //代表購物車有這個variant_id
        if (existingItem.length > 0) {
          // 直接更新為新數量
          await pool.execute(
            "UPDATE cart_items SET quantity = ? WHERE id = ?",
            [quantity, existingItem[0].id]
          );
        } else {
          // 新增項目
          await pool.execute(
            "INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)",
            [cartId, variantId, quantity]
          );
        }
        break;
      }

      case "activity": {
        if (!date || !time) {
          return res.status(400).json({
            success: false,
            message: "活動必須包含日期和時間",
          });
        }
        // 驗證時間和日期格式 到時候統一

        // 檢查活動專案是否存在與有效
        const [project] = await pool.execute(
          `SELECT ap.*, a.name, a.type
           FROM activity_project ap
           JOIN activity a ON ap.activity_id = a.id
           WHERE ap.id = ?`,
          [projectId]
        );
        // console.log("查看活動", project);

        if (project.length === 0) {
          return res.status(400).json({
            success: false,
            message: "找不到指定活動",
          });
        }

        // 驗證日期範圍 建構子new Date()會比較好去比較
        const selectedDate = new Date(date);
        const earliestDate = new Date(project[0].earliestDate);
        const projectDate = new Date(project[0].date);
        console.log("selectedDate", selectedDate);
        console.log("earliestDate", earliestDate);
        console.log("projectDate", projectDate);

        if (selectedDate < earliestDate || selectedDate > projectDate) {
          return res.status(400).json({
            success: false,
            message: `活動「${project[0].name}」只能在 ${project[0].earliestDate} 到 ${project[0].date} 之間預訂`,
          });
        }

        // 檢查是否已在購物車中（相同使用者、活動、日期和時間）
        //相同使用者 = 同一台購物車
        const [existingItem] = await pool.execute(
          `SELECT cai.id, cai.quantity
           FROM cart_activity_items cai
           JOIN carts c ON cai.cart_id = c.id
           WHERE cai.cart_id = ?
           AND cai.activity_project_id = ?
           AND cai.date = ?
           AND cai.time = ?`,
          [cartId, projectId, date, time]
        );

        //TODO -  檢查該時段所有預訂數量（不包含當前項目）該改成order_activity_items
        // const [bookings] = await pool.execute(
        //   `SELECT COALESCE(SUM(cai.quantity), 0) as booked_quantity
        //    FROM cart_activity_items cai
        //    JOIN carts c ON cai.cart_id = c.id
        //    WHERE cai.activity_project_id = ? 
        //    AND cai.date = ? 
        //    AND cai.time = ?
        //    AND cai.id != ?
        //    AND c.status = 'active'`,
        //   [
        //     projectId,
        //     date,
        //     time,
        //     existingItem.length > 0 ? existingItem[0].id : 0,
        //   ]
        // );

        // // 總預訂數量等於當前預訂量加上新數量
        // const totalBookings =
        //   parseInt(bookings[0].booked_quantity) + parseInt(quantity);

        if (existingItem.length > 0) {
          // 更新數量
          await pool.execute(
            "UPDATE cart_activity_items SET quantity = ? WHERE id = ?",
            [quantity, existingItem[0].id]
          );
        } else {
          // 新增項目
          await pool.execute(
            `INSERT INTO cart_activity_items 
             (cart_id, activity_project_id, quantity, date, time) 
             VALUES (?, ?, ?, ?, ?)`,
            [cartId, projectId, quantity, date, time]
          );
        }
        break;
      }

      case "rental": {
        if (!startDate || !endDate) {
          return res.status(400).json({
            success: false,
            message: "租賃商品需要起始和結束日期",
          });
        }

        // 檢查日期有效性
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
          return res.status(400).json({
            success: false,
            message: "起始日期不能早於今天",
          });
        }

        if (end <= start) {
          return res.status(400).json({
            success: false,
            message: "結束日期必須晚於起始日期",
          });
        }

        // 檢查租賃商品是否存在及其庫存
        const [rental] = await pool.execute(
          "SELECT * FROM rent_item WHERE id = ? AND is_deleted = 0",
          [rentalId]
        );

        if (rental.length === 0) {
          return res.status(400).json({
            success: false,
            message: "找不到指定租賃商品",
          });
        }

        if (rental[0].stock === null || rental[0].stock === 0) {
          return res.status(400).json({
            success: false,
            message: "此商品目前無庫存",
          });
        }

        // 檢查期間的租賃狀況
        const [rentals] = await pool.execute(
          `SELECT DATE(d.date) as check_date, 
            COALESCE(SUM(cri.quantity), 0) as rented_quantity
     FROM (
       SELECT DATE_ADD(?, INTERVAL nums.n DAY) as date
       FROM (
         SELECT 0 as n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 
         UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
         UNION SELECT 8 UNION SELECT 9
       ) as nums
       WHERE DATE_ADD(?, INTERVAL nums.n DAY) <= ?
     ) as d
     LEFT JOIN cart_rental_items cri ON DATE(d.date) BETWEEN cri.start_date AND cri.end_date
     LEFT JOIN carts c ON cri.cart_id = c.id
     WHERE c.status = 'active' AND cri.rental_id = ?
     GROUP BY DATE(d.date)
     HAVING rented_quantity + ? > ?`,
          [startDate, startDate, endDate, rentalId, quantity, rental[0].stock]
        );

        if (rentals.length > 0) {
          return res.status(400).json({
            success: false,
            message: "所選時段的商品庫存不足",
          });
        }

        // 檢查使用者購物車中是否已有相同商品和日期
        const [existingItem] = await pool.execute(
          `SELECT id, quantity 
           FROM cart_rental_items 
           WHERE cart_id = ? 
           AND rental_id = ? 
           AND start_date = ? 
           AND end_date = ?`,
          [cartId, rentalId, startDate, endDate]
        );

        if (existingItem.length > 0) {
          // 直接更新為新數量
          await pool.execute(
            "UPDATE cart_rental_items SET quantity = ? WHERE id = ?",
            [quantity, existingItem[0].id]
          );
        } else {
          // 新增項目
          await pool.execute(
            `INSERT INTO cart_rental_items 
             (cart_id, rental_id, start_date, end_date, quantity) 
             VALUES (?, ?, ?, ?, ?)`,
            [cartId, rentalId, startDate, endDate, quantity]
          );
        }
        break;
      }
    }

    res.status(200).json({
      success: true,
      message: "商品已加入購物車",
    });
  } catch (error) {
    console.error("加入購物車失敗:", error);
    res.status(500).json({ success: false, message: "加入購物車失敗" });
  }
});

export default router;
