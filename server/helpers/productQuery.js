export function parseProductColors(products) {
  return products.map((product) => ({
    ...product,
    color: product.color ? JSON.parse(product.color) : [], // 確保 `color` 是 JSON 陣列
  }));
}

export function buildProductQuery({
  brandId,
  categoryId,
  bigCategoryId,
  colorIds,
  minPrice,
  maxPrice,
  sort,
  offset,
  limit,
}) {
  let whereClause = "WHERE 1=1";
  const queryParams = [];

  // 品牌篩選
  if (brandId) {
    whereClause += " AND p.brand_id = ?";
    queryParams.push(brandId);
  }

  // 小分類篩選
  if (categoryId) {
    whereClause += " AND p.category_id = ?";
    queryParams.push(categoryId);
  }

  // 大分類篩選
  if (bigCategoryId) {
    whereClause += ` AND p.category_id IN (
            SELECT id FROM category_small WHERE category_big_id = ?
          )`;
    queryParams.push(bigCategoryId);
  }

  // ✅ `color_id` 篩選（影響 WHERE 過濾）
  if (colorIds && colorIds.length > 0) {
    whereClause += ` AND p.id IN (
          SELECT pv.product_id FROM product_variant pv 
          WHERE pv.color_id IN (${colorIds.map(() => "?").join(",")})
          AND pv.isDeleted = 0
        )`;
    queryParams.push(...colorIds);
  }

  // 添加價格篩選
  if (minPrice !== undefined) {
    whereClause += ` AND EXISTS (
      SELECT 1 FROM product_variant pv2 
      WHERE pv2.product_id = p.id 
      AND pv2.price >= ?
      AND pv2.isDeleted = 0
    )`;
    queryParams.push(minPrice);
  }

  if (maxPrice !== undefined) {
    whereClause += ` AND EXISTS (
      SELECT 1 FROM product_variant pv3 
      WHERE pv3.product_id = p.id 
      AND pv3.price <= ?
      AND pv3.isDeleted = 0
    )`;
    queryParams.push(maxPrice);
  }

  // 排序條件
  const orderMap = {
    1: "p.createdAt DESC",
    2: "p.createdAt ASC",
    3: "MIN(pv.price) ASC",
    4: "MIN(pv.price) DESC",
  };
  let orderBy = orderMap[sort] || "p.createdAt DESC";

  // ✅ **保持 GROUP_CONCAT()，但讓後端解析 JSON**
  const sql = `
    SELECT DISTINCT 
      p.*, 
      b.name AS brand_name,
      MIN(pv.price) AS price,
      (
        SELECT pi.image_url 
        FROM product_images pi 
        WHERE pi.product_id = p.id 
        AND pi.is_main = 1 
        ORDER BY pi.sort_order ASC 
        LIMIT 1
      ) AS main_image,
      GROUP_CONCAT(pi.image_url ORDER BY pi.sort_order ASC) AS images, 
      IFNULL(
        CONCAT('[', GROUP_CONCAT(DISTINCT 
          JSON_OBJECT(
            "color_id", c.id,
            "color_name", c.name,
            "color_code", c.color_code
          )
        ), ']'), '[]'
      ) AS color
    FROM product p
    LEFT JOIN brand b ON p.brand_id = b.id
    LEFT JOIN product_variant pv ON p.id = pv.product_id AND pv.isDeleted = 0
    LEFT JOIN color c ON pv.color_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    ${whereClause}
    GROUP BY p.id, b.name
    ORDER BY ${orderBy}
    LIMIT ${limit} OFFSET ${offset};
  `;


  return { sql, queryParams, whereClause };
}
