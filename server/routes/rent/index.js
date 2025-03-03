import express from "express";
import { pool } from "../../config/mysql.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // 當前頁數，默認為第 1 頁
  const limit = parseInt(req.query.limit) || 16; // 每頁顯示的商品數量，默認為 16

  const sort = req.query.sort; // 排序方式
  const category_big_id = req.query.category_big_id || null;
  const category_small_id = req.query.category_small_id || null;
  const letter = req.query.letter || null; // 字母分類
  const brand_id = req.query.brand_id || null;
  const minPrice = parseFloat(req.query.minPrice); // 最低價格
  const maxPrice = parseFloat(req.query.maxPrice); // 最高價格
  const color_id = req.query.color_id || null;

  const offset = (page - 1) * limit; // 計算偏移量

  // 設置默認排序條件
  let orderBy = "ORDER BY ri.created_at DESC";
  if (sort === "price_desc") {
    orderBy = "ORDER BY COALESCE(ri.price2, ri.price) DESC";
  } else if (sort === "price_asc") {
    orderBy = "ORDER BY COALESCE(ri.price2, ri.price) ASC";
  } else if (sort === "newest") {
    orderBy = "ORDER BY ri.created_at DESC";
  } else if (sort === "oldest") {
    orderBy = "ORDER BY ri.created_at ASC";
  }

  try {
    console.log("查詢條件:", {
      category_big_id,
      category_small_id,
      brand_id,
      letter,
      minPrice,
      maxPrice,
      color_id,
      limit,
      offset,
    });

    const params = [];

    // 處理 letter 參數
    let letterCondition = "";
    if (letter) {
      const letters = letter.split("、"); // 將 "B、C、D" 拆分為 ["B", "C", "D"]
      if (letters.length > 1) {
        letterCondition = `AND SUBSTRING(rb.name, 1, 1) IN (${letters
          .map((l) => `'${l}'`)
          .join(", ")})`;
      } else {
        letterCondition = `AND SUBSTRING(rb.name, 1, 1) = '${letters[0]}'`;
      }
    }

    // 處理價格區間
    let priceCondition = "";
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      priceCondition = `AND COALESCE(ri.price2, ri.price) BETWEEN ${minPrice} AND ${maxPrice}`;
    } else if (!isNaN(minPrice)) {
      priceCondition = `AND COALESCE(ri.price2, ri.price) >= ${minPrice}`;
    } else if (!isNaN(maxPrice)) {
      priceCondition = `AND COALESCE(ri.price2, ri.price) <= ${maxPrice}`;
    }

    // 處理顏色過濾（基於 color_id）
    let colorCondition = "";
    if (color_id) {
      const colorIds = color_id.split(",").map((id) => parseInt(id.trim())); // 拆分並轉換為數字
      if (colorIds.length > 0) {
        if (colorIds.length === 1) {
          // 只有一個顏色 ID
          colorCondition = " AND rc.id = ?";
          params.push(colorIds[0]);
        } else {
          // 多個顏色 ID
          colorCondition = ` AND rc.id IN (${colorIds
            .map(() => "?")
            .join(", ")})`;
          params.push(...colorIds);
        }
      }
    }

    // 獲取商品資料
    const query = `
        SELECT
        ri.id, ri.name, ri.price, ri.price2, ri.description, ri.description2,
        ri.stock, ri.created_at, ri.update_at, ri.deposit, ri.is_like,
        rcs.id AS category_small_id,
        rcs.name AS category_small_name,
        rcb.id AS category_big_id,
        rcb.name AS category_big_name,
        ri_img.img_url AS img_url,
        rb.id AS brand_id,
        rb.name AS brand_name,
        GROUP_CONCAT(DISTINCT rc.id ORDER BY rc.id ASC) AS color_id,
        GROUP_CONCAT(DISTINCT rc.name ORDER BY rc.id ASC) AS color_name,
        GROUP_CONCAT(DISTINCT rc.rgb ORDER BY rc.id ASC) AS color_rgb
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN rent_image ri_img ON ri.id = ri_img.rent_item_id AND ri_img.is_main = 1
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      LEFT JOIN rent_color rc ON rs.color_id = rc.id
      WHERE ri.is_deleted = FALSE
      ${category_big_id ? "AND rcb.id = ?" : ""}
      ${category_small_id ? "AND rcs.id = ?" : ""}
      ${letterCondition} /* 使用 letterCondition 過濾字母分類 */
      ${brand_id ? "AND rb.id = ?" : ""} /* 使用 brand_id 過濾品牌 */
      ${priceCondition} /* 使用 priceCondition 過濾價格區間 */
      ${colorCondition} /* 使用 colorCondition 過濾顏色 */
      GROUP BY ri.id
      ${orderBy} /* 確保 orderBy 不為空 */
      LIMIT ${limit} OFFSET ${offset};
    `;

    if (category_big_id) params.push(category_big_id);
    if (category_small_id) params.push(category_small_id);
    if (brand_id) params.push(brand_id);

    const [rows] = await pool.query(query, params);

      // 處理 color_id、color_name 和 color_rgb
      const formattedRows = rows.map((row) => {
        const colorIds = row.color_id ? row.color_id.split(",") : [];
        const colorNames = row.color_name ? row.color_name.split(",") : [];
        const colorRgbs = row.color_rgb ? row.color_rgb.split(",") : [];
  
        const colors = colorIds.map((id, index) => ({
          id: parseInt(id), // 將 color_id 轉為數字
          name: colorNames[index],
          rgb: colorRgbs[index],
        }));
  
        return {
          ...row,
          colors, // 將顏色資料整理為陣列
        };
      });


    // 獲取總商品數量
    const [totalRows] = await pool.query(
      `
     SELECT COUNT(DISTINCT ri.id) AS total
      FROM rent_item ri
      JOIN rent_category_small rcs ON ri.rent_category_small_id = rcs.id
      JOIN rent_category_big rcb ON rcs.rent_category_big_id = rcb.id
      LEFT JOIN rent_specification rs ON ri.id = rs.rent_item_id AND rs.is_deleted = FALSE
      LEFT JOIN rent_brand rb ON rs.brand_id = rb.id
      LEFT JOIN rent_color rc ON rs.color_id = rc.id
      WHERE ri.is_deleted = FALSE
      ${category_big_id ? "AND rcb.id = ?" : ""}
      ${category_small_id ? "AND rcs.id = ?" : ""}
      ${letterCondition} /* 使用 letterCondition 過濾字母分類 */
      ${brand_id ? "AND rb.id = ?" : ""} /* 使用 brand_id 過濾品牌 */
      ${priceCondition} /* 使用 priceCondition 過濾價格區間 */
      ${colorCondition} /* 使用 colorCondition 過濾顏色 */
      `,
      params
    );

    const total = totalRows[0]?.total || 0;

    // 返回結果
    res.json({
      data: formattedRows, // rows
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("SQL 錯誤:", err);
    res.status(500).send({ error: "Server error", message: err.message });
  }
});

export default router;