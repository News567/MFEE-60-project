import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

// **加入購物車**
router.post("/add", async (req, res) => {
  const {
    userId,
    productId,
    rentalId,
    activityId,
    quantity,
    rentalPeriod,
    participants,
  } = req.body;

  try {
    // 確保active的 `cart_id`
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

    // 插入購物車
    await pool.execute(
      "INSERT INTO cart_items (cart_id, product_id, rental_id, activity_id, quantity, rental_period, participants) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        cartId,
        productId,
        rentalId,
        activityId,
        quantity,
        rentalPeriod,
        participants,
      ]
    );

    res.status(200).json({ success: true, message: "加入購物車成功" });
  } catch (error) {
    console.error("加入購物車失敗:", error);
    res.status(500).json({ success: false, message: "加入購物車失敗" });
  }
});

// **取得購物車內容**
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (cart.length === 0) {
      return res.json({ success: true, cartItems: [] });
    }

    const cartId = cart[0].id;

    // 查詢購物車內容，包含商品、租賃、活動的當前價格
    const [cartItems] = await pool.execute(
      `SELECT ci.id, ci.quantity, ci.rental_period, ci.participants,
              p.name AS product_name, p.price AS product_price,
              r.name AS rental_name, r.price AS rental_price,
              a.name AS activity_name, a.price AS activity_price
       FROM cart_items ci
       LEFT JOIN product p ON ci.product_id = p.id
       LEFT JOIN rent_item r ON ci.rental_id = r.id
       LEFT JOIN activity a ON ci.activity_id = a.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.error("獲取購物車內容失敗:", error);
    res.status(500).json({ success: false, message: "獲取購物車內容失敗" });
  }
});

// **更新購物車商品**
router.put("/update", async (req, res) => {
  const { cartItemId, quantity, rentalPeriod, participants } = req.body;

  try {
    await pool.execute(
      "UPDATE cart_items SET quantity = ?, rental_period = ?, participants = ? WHERE id = ?",
      [quantity, rentalPeriod, participants, cartItemId]
    );

    res.status(200).json({ success: true, message: "購物車商品已更新" });
  } catch (error) {
    console.error("更新購物車商品失敗:", error);
    res.status(500).json({ success: false, message: "更新購物車商品失敗" });
  }
});

// 刪除特定商品
router.delete("/remove", async (req, res) => {
  const { userId, cartItemId } = req.body;

  try {
    // 直接刪除並確認影響的行數
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

    // 檢查購物車是否已空
    // 先內層查詢 在外層查詢
    const [ifItems] = await pool.execute(
      "SELECT COUNT(*) AS count FROM cart_items WHERE cart_id = (SELECT carts.id FROM carts WHERE user_id = ? AND status = 'active')",
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

    // 更新購物車狀態為 "checked_out"
    await pool.execute("UPDATE carts SET status = 'checked_out' WHERE id = ?", [
      cartId,
    ]);

    res.status(200).json({ success: true, message: "結帳成功" });
  } catch (error) {
    console.error("結帳失敗:", error);
    res.status(500).json({ success: false, message: "結帳失敗" });
  }
});

export default router;

// 新增購物車
// {
//     "userId": 1,
//     "productId": 32,
//     "rentalId": null,
//     "activityId": null,
//     "quantity": 2,
//     "rentalPeriod": null,
//     "participants": null
//   }
