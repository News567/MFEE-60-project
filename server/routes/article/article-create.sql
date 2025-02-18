-- =========================== 1. article_category_big 表格 ===========================
CREATE TABLE article_category_big (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    name VARCHAR(255) NOT NULL -- 大分類名稱
);

-- =========================== 2. article_category_small 表格 ===========================
CREATE TABLE article_category_small (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    name VARCHAR(255) NOT NULL, -- 小分類名稱
    category_big_id INT, -- 大分類的外鍵
    FOREIGN KEY (category_big_id) REFERENCES article_category_big (id) ON DELETE CASCADE -- 外鍵: 大分類
);

-- =========================== 3. article_tag_small 表格 ===========================
CREATE TABLE article_tag_small (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    tag_name VARCHAR(255) UNIQUE NOT NULL -- 標籤名稱
);

-- =========================== 4. article 表格 ===========================
CREATE TABLE article (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    title VARCHAR(255) NOT NULL, -- 文章標題
    content TEXT NOT NULL, -- 文章內容
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新時間
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft', -- 發布狀態
    publish_at TIMESTAMP NULL, -- 發布時間 (允許為NULL)
    article_category_small_id INT, -- 文章小分類的外鍵
    view_count INT DEFAULT 0, -- 文章瀏覽量
    users_id INT UNSIGNED, -- 文章作者 (users 外鍵)
    reply_count INT DEFAULT 0, -- 留言數量
    is_deleted BOOLEAN DEFAULT FALSE, -- 軟刪除標記
    FOREIGN KEY (article_category_small_id) REFERENCES article_category_small (id), -- 外鍵: 小分類
    FOREIGN KEY (users_id) REFERENCES users (id) -- 外鍵: 使用者
);

-- =========================== 5. article_image 表格 ===========================
CREATE TABLE article_image (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    article_id INT, -- 文章ID (文章的外鍵)
    name VARCHAR(255) NOT NULL, -- 圖片名稱
    img_url VARCHAR(255) NOT NULL, -- 圖片URL
    is_main BOOLEAN DEFAULT FALSE, -- 是否為封面縮圖
    FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE -- 外鍵: 文章
);

-- =========================== 6. article_tag_big (多對多關聯表) 表格 ===========================
CREATE TABLE article_tag_big (
    article_id INT, -- 文章ID
    article_tag_small_id INT, -- 標籤ID
    PRIMARY KEY (
        article_id,
        article_tag_small_id
    ), -- 複合主鍵
    FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE, -- 外鍵: 文章
    FOREIGN KEY (article_tag_small_id) REFERENCES article_tag_small (id) ON DELETE CASCADE -- 外鍵: 標籤
);

-- =========================== 7. article_reply 表格 ===========================
CREATE TABLE article_reply (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    article_id INT, -- 文章ID (文章的外鍵)
    users_id INT UNSIGNED, -- 使用者ID (留言者的外鍵)
    content TEXT NOT NULL, -- 留言內容
    floor_number INT, -- 樓層編號
    reply_number INT DEFAULT 0, -- 根留言為0
    level ENUM('1', '2') DEFAULT '1', -- 留言層級 (只有1或2)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間
    is_deleted BOOLEAN DEFAULT FALSE, -- 軟刪除標記
    FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE, -- 外鍵: 文章
    FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE -- 外鍵: 使用者
);

-- =========================== 8. article_likes_dislikes 表格 ===========================
CREATE TABLE article_likes_dislikes (
    article_id INT, -- 文章ID (文章的外鍵)
    users_id INT UNSIGNED, -- 使用者ID (users 外鍵)
    is_like BOOLEAN, -- 按讚為 TRUE，倒讚為 FALSE
    PRIMARY KEY (article_id, users_id), -- 複合主鍵
    FOREIGN KEY (article_id) REFERENCES article (id) ON DELETE CASCADE, -- 外鍵: 文章
    FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE -- 外鍵: 使用者
);

-- =========================== 9. comment 表格 ===========================
CREATE TABLE comment (
    id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
    star TINYINT NOT NULL, -- 評分 (1-5)
    type ENUM('product', 'activity', 'rent') NOT NULL, -- 評論類型
    content TEXT NOT NULL, -- 評論內容
    users_id INT UNSIGNED, -- 使用者ID (留言者的外鍵)
    product_id INT UNSIGNED DEFAULT NULL, -- 產品ID (可為NULL)
    activity_id INT UNSIGNED DEFAULT NULL, -- 活動ID (可為NULL)
    rent_item_id INT UNSIGNED DEFAULT NULL, -- 租借ID (可為NULL)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間
    FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE, -- 外鍵: 使用者
    FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE, -- 外鍵: 產品 (可為NULL)
    FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE, -- 外鍵: 活動 (可為NULL)
    FOREIGN KEY (rent_item_id) REFERENCES rent_item (id) ON DELETE CASCADE -- 外鍵: 租借 (可為NULL)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;