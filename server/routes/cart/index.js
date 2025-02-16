import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// **加入購物車**
router.post("/add", async (req, res) => {
  const { userId, varientId, quantity } = req.body;

  try {
    // 1️. 檢查 `varient_id` 是否有效
    const [varientCheck] = await pool.execute(
      "SELECT * FROM product_variant WHERE id = ?",
      [varientId]
    );

    if (varientCheck.length === 0) {
      return res.status(400).json({ success: false, message: "變體 ID 無效" });
    }

    // 2️. 確保購物車存在
    let [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    let cartId = cart.length > 0 ? cart[0].id : null;

    if (!cartId) {
      const [result] = await pool.execute(
        "INSERT INTO carts (user_id, status) VALUES (?, 'active')",
        [userId]
      );
      cartId = result.insertId;
    }

    // 3️. 檢查購物車內是否已有該商品
    const [existingItem] = await pool.execute(
      "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND varient_id = ?",
      [cartId, varientId]
    );

    if (existingItem.length > 0) {
      // 更新數量
      const updateResult = await pool.execute(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity, existingItem[0].id]
      );
      console.log("🔵 更新商品數量:", updateResult);
    } else {
      // 插入新商品
      const insertResult = await pool.execute(
        "INSERT INTO cart_items (cart_id, varient_id, quantity) VALUES (?, ?, ?)",
        [cartId, varientId, quantity]
      );
      console.log("🟢 插入商品結果:", insertResult);
    }

    // 4️. 重新查詢購物車內容
    const [cartItems] = await pool.execute(
      `SELECT ci.id, ci.quantity, pv.price, p.name AS product_name
       FROM cart_items ci
       JOIN product_variant pv ON ci.varient_id = pv.id
       JOIN product p ON pv.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    console.log("🛒 購物車內容:", cartItems);
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error("❌ 加入購物車失敗:", error);
    res.status(500).json({ success: false, message: "加入購物車失敗" });
  }
});

// **取得購物車內容**
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1️⃣ 取得用戶的 `active` 購物車
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (cart.length === 0) {
      return res.json({ success: true, cartItems: [] }); // 🛑 沒有購物車時回傳空
    }

    const cartId = cart[0].id;

    // 2️⃣ 取得購物車內的商品
    const [cartItems] = await pool.execute(
      `SELECT ci.id, ci.quantity, pv.price AS varient_price, p.name AS product_name,
              (ci.quantity * pv.price) AS total_price
       FROM cart_items ci
       JOIN product_variant pv ON ci.varient_id = pv.id
       JOIN product p ON pv.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    console.log("🛒 購物車內容:", cartItems); // ✅ 確保 SQL 有查到東西

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error("❌ 獲取購物車內容失敗:", error);
    res.status(500).json({ success: false, message: "獲取購物車內容失敗" });
  }
});


// **更新購物車商品**
router.put("/update", async (req, res) => {
  const { cartItemId, quantity } = req.body;

  try {
    // 檢查 cartItemId 是否存在
    const [existingItem] = await pool.execute(
      "SELECT id FROM cart_items WHERE id = ?",
      [cartItemId]
    );

    if (existingItem.length === 0) {
      return res.status(400).json({ success: false, message: "購物車商品不存在" });
    }

    // 更新購物車數量
    await pool.execute(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [quantity, cartItemId]
    );

    res.status(200).json({ success: true, message: "購物車商品已更新" });
  } catch (error) {
    console.error("❌ 更新購物車商品失敗:", error);
    res.status(500).json({ success: false, message: "更新購物車商品失敗" });
  }
});


// **刪除購物車商品**
router.delete("/remove", async (req, res) => {
  const { userId, cartItemId } = req.body;

  try {
    const [result] = await pool.execute(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [cartItemId, userId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(403)
        .json({ success: false, message: "無權刪除此商品" });
    }

    // 檢查購物車是否為空
    const [ifItems] = await pool.execute(
      "SELECT COUNT(*) AS count FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ? AND status = 'active')",
      [userId]
    );

    if (ifItems[0].count === 0) {
      await pool.execute(
        "DELETE FROM carts WHERE user_id = ? AND status = 'active'",
        [userId]
      );
    }

    res.status(200).json({ success: true, message: "商品已從購物車移除" });
  } catch (error) {
    console.error("移除購物車商品失敗:", error);
    res.status(500).json({ success: false, message: "移除購物車商品失敗" });
  }
});

// **購物車結帳**
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (cart.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "沒有可結帳的購物車" });
    }

    const cartId = cart[0].id;

    // 建立訂單
    const [orderResult] = await pool.execute(
      "INSERT INTO orders (user_id, total_price, status) VALUES (?, 0, 'pending')",
      [userId]
    );
    const orderId = orderResult.insertId;

    // 將購物車內容轉為訂單項目
    await pool.execute(
      `INSERT INTO order_items (order_id, varient_id, quantity, price, createdAt)
       SELECT ?, varient_id, quantity, pv.price, NOW()
       FROM cart_items ci
       JOIN product_variant pv ON ci.varient_id = pv.id
       WHERE ci.cart_id = ?`,
      [orderId, cartId]
    );

    // 計算總價並更新訂單
    await pool.execute(
      "UPDATE orders SET total_price = (SELECT SUM(quantity * price) FROM order_items WHERE order_id = ?) WHERE id = ?",
      [orderId, orderId]
    );

    // 清空購物車
    await pool.execute("DELETE FROM carts WHERE id = ?", [cartId]);

    res.status(200).json({ success: true, message: "結帳成功" });
  } catch (error) {
    console.error("結帳失敗:", error);
    res.status(500).json({ success: false, message: "結帳失敗" });
  }
});

export default router;
