
-- =========================== 1. article_category_big 表格 ===========================
CREATE TABLE `article_category_big` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `article_category_big` (`id`, `name`) VALUES
(1, '課程與體驗'),
(2, '交流'),
(3, '知識與技術'),
(4, '新聞與活動');


-- =========================== 2. article_category_small 表格 ===========================
CREATE TABLE `article_category_small` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category_big_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `article_category_small` (`id`, `name`, `category_big_id`) VALUES
(1, '體驗潛水', 1),
(2, '潛水課程', 1),
(3, '旅遊潛水', 1),
(4, '相片分享', 2),
(5, '設備討論', 2),
(6, '規劃行程', 2),
(7, '海洋生物', 3),
(8, '潛水技巧', 3),
(9, '海洋環境', 3),
(10, '潛水新聞', 4),
(11, '潛水活動', 4),
(12, '潛水人物', 4);

-- =========================== 3. article_tag_small 表格 ===========================
-- 文章標籤 (小標籤) 表: article_tag_small
CREATE TABLE `article_tag_small` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 插入標籤資料
INSERT INTO `article_tag_small` (`id`, `tag_name`) VALUES
(1, '初學者'),
(2, '裝備推薦'),
(3, '熱門潛點'),
(4, '安全第一'),
(5, '海洋生物'),
(6, '攝影技巧'),
(7, '旅遊攻略'),
(8, '活動分享');

-- =========================== 4. article 表格 ===========================
CREATE TABLE `article` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` ENUM('draft','published') NOT NULL DEFAULT 'draft',
  `publish_at` TIMESTAMP NULL DEFAULT NULL,  -- 設為可空
  `article_category_small_id` INT UNSIGNED DEFAULT NULL,
  `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `users_id` INT UNSIGNED DEFAULT NULL, 
  `reply_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `article` (`id`, `title`, `content`, `created_at`, `updated_at`, `status`, `publish_at`, `article_category_small_id`, `view_count`, `users_id`, `reply_count`, `is_deleted`) VALUES
(1, '第一次潛水的奇妙體驗', '第一次潛水是一種難以形容的體驗，當你慢慢沉入水中，周圍的世界變得安靜而神秘。水下的光線透過水面灑下來，形成一道道美麗的光束。魚群在你身邊游來游去，彷彿進入了另一個世界。這種感覺讓人上癮，也讓我決定要繼續學習潛水。', '2025-02-16 10:19:58', '2025-02-16 10:33:16', 'published', '2025-02-15 11:37:49', 1, 150, 1, 5, 0),
(2, '如何選擇適合的體驗潛水地點', '選擇體驗潛水地點時，需要考慮水質、能見度、海洋生物種類以及教練的專業程度。例如，東南亞的潛點以珊瑚礁和豐富的海洋生物聞名，而地中海則以清澈的水質和歷史沉船吸引潛水愛好者。', '2025-02-16 10:19:58', '2025-02-16 10:33:35', 'published', '2025-02-14 10:37:49', 1, 200, 2, 8, 0),
(3, '體驗潛水前的準備工作', '在進行體驗潛水之前，需要做好充分的準備工作。首先，確保身體健康，沒有感冒或耳部問題。其次，學習基本的潛水知識和手勢，以便與教練溝通。最後，準備好適合的泳衣和毛巾，確保潛水後的舒適。', '2025-02-16 10:19:58', '2025-02-16 10:33:43', 'published', '2025-02-13 09:37:49', 1, 180, 3, 6, 0),
(4, '體驗潛水的常見問題解答', '許多人在第一次體驗潛水時會有各種疑問，例如「我會不會呼吸困難？」或「水下會不會很冷？」其實，潛水裝備可以確保你正常呼吸，而潛水服則能保持體溫。只要放鬆心情，享受水下世界即可。', '2025-02-16 10:19:58', '2025-02-16 10:33:49', 'published', '2025-02-12 08:37:49', 1, 220, 4, 10, 0),
(5, '體驗潛水 vs 正式潛水課程', '體驗潛水適合想要嘗試潛水的人，而正式潛水課程則適合想要深入學習並獲得潛水證書的人。體驗潛水通常由教練全程陪同，而正式課程則需要學習更多的理論知識和技巧。', '2025-02-16 10:19:58', '2025-02-16 10:33:55', 'published', '2025-02-11 07:37:49', 1, 170, 5, 7, 0),
(6, '體驗潛水的安全注意事項', '體驗潛水雖然有趣，但安全永遠是第一位的。確保聽從教練的指示，不要單獨行動，並隨時注意自己的呼吸和身體狀況。如果感到不適，應立即告知教練。', '2025-02-16 10:19:58', '2025-02-16 10:34:00', 'published', '2025-02-10 06:37:49', 1, 190, 6, 9, 0),
(7, '體驗潛水的最佳季節', '不同地區的潛水季節有所不同。例如，馬爾代夫的最佳潛水季節是11月至4月，而泰國則是12月至3月。選擇合適的季節可以確保良好的能見度和豐富的海洋生物。', '2025-02-16 10:19:58', '2025-02-16 10:34:06', 'published', '2025-02-09 05:37:49', 1, 210, 7, 12, 0),
(8, '體驗潛水的裝備介紹', '體驗潛水通常會提供全套裝備，包括潛水鏡、呼吸管、潛水服和氣瓶。這些裝備可以確保你在水下的安全和舒適。如果有特殊需求，也可以自備裝備。', '2025-02-16 10:19:58', '2025-02-16 10:34:12', 'published', '2025-02-08 04:37:49', 1, 160, 8, 5, 0),
(9, '體驗潛水的費用解析', '體驗潛水的費用因地區和服務內容而異。一般來說，費用包括裝備租借、教練指導和潛水保險。建議提前查詢並比較不同潛水中心的價格和評價。', '2025-02-16 10:19:58', '2025-02-16 10:34:18', 'published', '2025-02-07 03:37:49', 1, 230, 9, 15, 0),
(10, '體驗潛水的未來趨勢', '隨著潛水運動的普及，體驗潛水的服務也越來越多元化。未來可能會出現更多結合虛擬實境（VR）技術的潛水體驗，讓更多人能夠感受到水下世界的魅力。', '2025-02-16 10:19:58', '2025-02-16 10:34:26', 'published', '2025-02-06 02:37:49', 1, 240, 10, 18, 0),
(11, '如何選擇適合的潛水課程', '選擇潛水課程時，需要考慮課程內容、教練資質、潛水地點和費用。建議選擇有國際認證的潛水中心，並查看其他學員的評價。', '2025-02-16 10:19:58', '2025-02-16 10:34:40', 'published', '2025-02-05 01:37:49', 2, 250, 11, 20, 0),
(12, '開放水域潛水課程介紹', '開放水域潛水課程是潛水初學者的必修課程，內容包括理論知識、平靜水域練習和開放水域實習。完成課程後，可以獲得開放水域潛水員證書。', '2025-02-16 10:19:58', '2025-02-16 10:34:54', 'published', '2025-02-04 00:37:49', 2, 260, 12, 22, 0),
(13, '進階潛水課程的必要性', '進階潛水課程可以幫助你提升潛水技巧，學習更深層次的知識，例如夜潛、沉船潛水和水下導航。這些技能可以讓你的潛水體驗更加豐富。', '2025-02-16 10:19:58', '2025-02-16 10:35:00', 'published', '2025-02-02 23:37:49', 2, 270, 13, 25, 0),
(14, '潛水課程的費用比較', '潛水課程的費用因地區和課程內容而異。一般來說，開放水域課程的費用在300至500美元之間，而進階課程則需要額外支付200至300美元。', '2025-02-16 10:19:58', '2025-02-16 10:35:07', 'published', '2025-02-01 22:37:49', 2, 280, 14, 30, 0),
(15, '潛水課程的學習心得分享', '參加潛水課程是一次非常有意義的經歷。不僅學到了許多潛水知識，還結識了一群志同道合的朋友。最重要的是，獲得了探索水下世界的資格。', '2025-02-16 10:19:58', '2025-02-16 10:35:14', 'published', '2025-01-31 21:37:49', 2, 290, 15, 35, 0),
(16, '潛水課程的教練選擇指南', '選擇一位經驗豐富的潛水教練非常重要。可以通過查看教練的資質證書、教學經驗和學員評價來做出決定。', '2025-02-16 10:19:58', '2025-02-16 10:35:19', 'published', '2025-01-30 20:37:49', 2, 300, 16, 40, 0),
(17, '潛水課程的常見問題', '許多人在參加潛水課程時會有疑問，例如「課程難不難？」或「需要多長時間？」其實，只要認真學習並按照教練的指示操作，大多數人都能順利完成課程。', '2025-02-16 10:19:58', '2025-02-16 10:35:25', 'published', '2025-01-29 19:37:49', 2, 310, 17, 45, 0),
(18, '潛水課程的未來發展', '隨著潛水運動的普及，潛水課程的內容和形式也在不斷創新。未來可能會出現更多線上課程和虛擬實境教學，讓學習更加便捷。', '2025-02-16 10:19:58', '2025-02-16 10:35:31', 'published', '2025-01-28 18:37:49', 2, 320, 18, 50, 0),
(19, '潛水課程的國際認證', '國際潛水組織如PADI、SSI和NAUI提供全球認可的潛水課程和證書。選擇有國際認證的課程可以確保你的潛水資格被廣泛接受。', '2025-02-16 10:19:58', '2025-02-16 10:35:37', 'published', '2025-01-27 17:37:49', 2, 330, 19, 55, 0),
(20, '潛水課程的線上學習資源', '許多潛水中心提供線上學習資源，例如理論課程影片和模擬測驗。這些資源可以幫助你在正式上課前做好準備，提升學習效率。', '2025-02-16 10:19:58', '2025-02-16 10:35:42', 'published', '2025-01-26 16:37:49', 2, 340, 20, 60, 0);

-- =========================== 5. article_image 表格 ===========================
CREATE TABLE `article_image` (
  `article_id` INT(11) NOT NULL,
  `img_url` VARCHAR(255) NOT NULL,
  `is_main` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `article_image` (`article_id`, `img_url`, `is_main`) VALUES
(1, '/uploads/article/001.jpg', 1),
(2, '/uploads/article/002.jpg', 1),
(3, '/uploads/article/003.jpg', 1),
(4, '/uploads/article/004.jpg', 1),
(5, '/uploads/article/005.jpg', 1),
(6, '/uploads/article/006.jpg', 1),
(7, '/uploads/article/007.jpg', 1),
(8, '/uploads/article/008.jpg', 1),
(9, '/uploads/article/009.jpg', 1),
(10, '/uploads/article/010.jpg', 1);


-- =========================== 6. article_tag_big (多對多關聯表) 表格 ===========================
CREATE TABLE `article_tag_big` (
  `article_id` int(11) NOT NULL,
  `article_tag_small_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`, `article_tag_small_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 插入文章與標籤關聯數據
INSERT INTO `article_tag_big` (`article_id`, `article_tag_small_id`) VALUES
(1, 1),
(1, 5),
(1, 8),
(2, 3),
(2, 7),
(2, 8);

-- =========================== 7. article_reply 表格 ===========================
CREATE TABLE `article_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_id` int(11) DEFAULT NULL,
  `users_id` INT UNSIGNED DEFAULT NULL, 
  `content` text NOT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `reply_number` int(11) DEFAULT 0,
  `level` enum('1','2') DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 插入資料
INSERT INTO `article_reply` (`article_id`, `users_id`, `content`, `floor_number`, `reply_number`, `level`, `created_at`, `is_deleted`) VALUES
(1, 1, '這篇文章寫得真好，讓我對潛水有了更深的認識！', 1, 0, '1', '2025-02-16 00:37:49', 0),
(1, 2, '我也好想去潛水，請問初學者該如何開始？', 2, 0, '1', '2025-02-16 01:26:49', 0),
(1, 3, '回覆2樓：建議先找專業教練學習基礎技巧哦！', 2, 1, '2', '2025-02-16 02:15:49', 0),
(1, 3, '潛水真的是一種很棒的體驗，推薦大家試試！', 3, 0, '1', '2025-02-16 03:04:49', 0),
(1, 2, '請問潛水裝備大概需要多少預算？', 4, 0, '1', '2025-02-16 03:53:49', 0),
(1, 1, '回覆5樓：初學者建議先租裝備，等熟悉後再考慮購買。', 4, 1, '2', '2025-02-16 04:42:49', 0),
(1, 1, '潛水時遇到鯊魚怎麼辦？有點害怕...', 5, 0, '1', '2025-02-16 05:31:49', 0),
(1, 2, '回覆7樓：鯊魚其實並不可怕，保持冷靜就好！', 5, 1, '2', '2025-02-16 06:20:49', 0),
(1, 3, '潛水後耳朵會痛，這是正常的嗎？', 6, 0, '1', '2025-02-16 07:09:49', 0),
(1, 2, '回覆9樓：可能是耳壓平衡沒做好，建議多練習耳壓平衡技巧。', 6, 1, '2', '2025-02-16 07:58:49', 0);


-- =========================== 8. article_likes_dislikes 表格 ===========================
CREATE TABLE `article_likes_dislikes` (
  `article_id` int(11) NOT NULL,  
  `users_id` INT UNSIGNED DEFAULT NULL, 
  `is_like` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`article_id`, `users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 插入資料
INSERT INTO `article_likes_dislikes` (`article_id`, `users_id`, `is_like`) VALUES
(1, 1, 1),
(1, 2, 0),
(1, 3, 1),
(1, 4, 0),
(1, 5, 0),
(2, 1, 1),
(2, 2, 0),
(2, 3, 1),
(2, 4, 0),
(2, 5, 1);


-- =========================== 9. comment 表格 ===========================
-- CREATE TABLE comment (
--     id INT AUTO_INCREMENT PRIMARY KEY, -- 主鍵
--     star TINYINT NOT NULL, -- 評分 (1-5)
--     type ENUM('product', 'activity', 'rent') NOT NULL, -- 評論類型
--     content TEXT NOT NULL, -- 評論內容
--     users_id INT UNSIGNED, -- 使用者ID (留言者的外鍵)
--     product_id INT UNSIGNED DEFAULT NULL, -- 產品ID (可為NULL)
--     activity_id INT UNSIGNED DEFAULT NULL, -- 活動ID (可為NULL)
--     rent_item_id INT UNSIGNED DEFAULT NULL, -- 租借ID (可為NULL)
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 創建時間
--     FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE, -- 外鍵: 使用者
--     FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE, -- 外鍵: 產品 (可為NULL)
--     FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE, -- 外鍵: 活動 (可為NULL)
--     FOREIGN KEY (rent_item_id) REFERENCES rent_item (id) ON DELETE CASCADE -- 外鍵: 租借 (可為NULL)
-- ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;