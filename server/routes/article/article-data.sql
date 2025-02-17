-- 插入資料到 article_category_big 表格
INSERT INTO article_category_big (name) VALUES
('課程與體驗'),
('交流'),
('知識與技術'),
('新聞與活動');

-- 插入資料到 article_category_small 表格
INSERT INTO article_category_small (name, category_big_id) VALUES
-- 課程與體驗
('體驗潛水', 1),
('潛水課程', 1),
('旅遊潛水', 1),
-- 交流
('相片分享', 2),
('設備討論', 2),
('規劃行程', 2),
-- 知識與技術
('海洋生物', 3),
('潛水技巧', 3),
('海洋環境', 3),
-- 新聞與活動
('潛水新聞', 4),
('潛水活動', 4),
('潛水人物', 4);

-- 插入資料到 article_tag_small 表格
INSERT INTO article_tag_small (tag_name) VALUES
('初學者'),
('裝備推薦'),
('熱門潛點'),
('安全第一'),
('海洋生物'),
('攝影技巧'),
('旅遊攻略'),
('活動分享');

-- 插入資料到 article 表格

INSERT INTO article (title, content, status, publish_at, article_category_small_id, users_id, view_count, reply_count, is_deleted) VALUES
-- 體驗潛水 (小分類 ID: 1)
('第一次潛水的奇妙體驗', '第一次潛水是一種難以形容的體驗，當你慢慢沉入水中，周圍的世界變得安靜而神秘。水下的光線透過水面灑下來，形成一道道美麗的光束。魚群在你身邊游來游去，彷彿進入了另一個世界。這種感覺讓人上癮，也讓我決定要繼續學習潛水。', 'published', '2025-02-16 03:37:49', 1, 1, 150, 5, FALSE),
('如何選擇適合的體驗潛水地點', '選擇體驗潛水地點時，需要考慮水質、能見度、海洋生物種類以及教練的專業程度。例如，東南亞的潛點以珊瑚礁和豐富的海洋生物聞名，而地中海則以清澈的水質和歷史沉船吸引潛水愛好者。', 'published', '2025-02-15 02:37:49', 1, 2, 200, 8, FALSE),
('體驗潛水前的準備工作', '在進行體驗潛水之前，需要做好充分的準備工作。首先，確保身體健康，沒有感冒或耳部問題。其次，學習基本的潛水知識和手勢，以便與教練溝通。最後，準備好適合的泳衣和毛巾，確保潛水後的舒適。', 'published', '2025-02-14 01:37:49', 1, 3, 180, 6, FALSE),
('體驗潛水的常見問題解答', '許多人在第一次體驗潛水時會有各種疑問，例如「我會不會呼吸困難？」或「水下會不會很冷？」其實，潛水裝備可以確保你正常呼吸，而潛水服則能保持體溫。只要放鬆心情，享受水下世界即可。', 'published', '2025-02-13 00:37:49', 1, 4, 220, 10, FALSE),
('體驗潛水 vs 正式潛水課程', '體驗潛水適合想要嘗試潛水的人，而正式潛水課程則適合想要深入學習並獲得潛水證書的人。體驗潛水通常由教練全程陪同，而正式課程則需要學習更多的理論知識和技巧。', 'published', '2025-02-11 23:37:49', 1, 5, 170, 7, FALSE),
('體驗潛水的安全注意事項', '體驗潛水雖然有趣，但安全永遠是第一位的。確保聽從教練的指示，不要單獨行動，並隨時注意自己的呼吸和身體狀況。如果感到不適，應立即告知教練。', 'published', '2025-02-10 22:37:49', 1, 6, 190, 9, FALSE),
('體驗潛水的最佳季節', '不同地區的潛水季節有所不同。例如，馬爾代夫的最佳潛水季節是11月至4月，而泰國則是12月至3月。選擇合適的季節可以確保良好的能見度和豐富的海洋生物。', 'published', '2025-02-09 21:37:49', 1, 7, 210, 12, FALSE),
('體驗潛水的裝備介紹', '體驗潛水通常會提供全套裝備，包括潛水鏡、呼吸管、潛水服和氣瓶。這些裝備可以確保你在水下的安全和舒適。如果有特殊需求，也可以自備裝備。', 'published', '2025-02-08 20:37:49', 1, 8, 160, 5, FALSE),
('體驗潛水的費用解析', '體驗潛水的費用因地區和服務內容而異。一般來說，費用包括裝備租借、教練指導和潛水保險。建議提前查詢並比較不同潛水中心的價格和評價。', 'published', '2025-02-07 19:37:49', 1, 9, 230, 15, FALSE),
('體驗潛水的未來趨勢', '隨著潛水運動的普及，體驗潛水的服務也越來越多元化。未來可能會出現更多結合虛擬實境（VR）技術的潛水體驗，讓更多人能夠感受到水下世界的魅力。', 'published', '2025-02-06 18:37:49', 1, 10, 240, 18, FALSE),

-- 潛水課程 (小分類 ID: 2)
('如何選擇適合的潛水課程', '選擇潛水課程時，需要考慮課程內容、教練資質、潛水地點和費用。建議選擇有國際認證的潛水中心，並查看其他學員的評價。', 'published', '2025-02-05 17:37:49', 2, 11, 250, 20, FALSE),
('開放水域潛水課程介紹', '開放水域潛水課程是潛水初學者的必修課程，內容包括理論知識、平靜水域練習和開放水域實習。完成課程後，可以獲得開放水域潛水員證書。', 'published', '2025-02-04 16:37:49', 2, 12, 260, 22, FALSE),
('進階潛水課程的必要性', '進階潛水課程可以幫助你提升潛水技巧，學習更深層次的知識，例如夜潛、沉船潛水和水下導航。這些技能可以讓你的潛水體驗更加豐富。', 'published', '2025-02-03 15:37:49', 2, 13, 270, 25, FALSE),
('潛水課程的費用比較', '潛水課程的費用因地區和課程內容而異。一般來說，開放水域課程的費用在300至500美元之間，而進階課程則需要額外支付200至300美元。', 'published', '2025-02-02 14:37:49', 2, 14, 280, 30, FALSE),
('潛水課程的學習心得分享', '參加潛水課程是一次非常有意義的經歷。不僅學到了許多潛水知識，還結識了一群志同道合的朋友。最重要的是，獲得了探索水下世界的資格。', 'published', '2025-02-01 13:37:49', 2, 15, 290, 35, FALSE),
('潛水課程的教練選擇指南', '選擇一位經驗豐富的潛水教練非常重要。可以通過查看教練的資質證書、教學經驗和學員評價來做出決定。', 'published', '2025-01-31 12:37:49', 2, 16, 300, 40, FALSE),
('潛水課程的常見問題', '許多人在參加潛水課程時會有疑問，例如「課程難不難？」或「需要多長時間？」其實，只要認真學習並按照教練的指示操作，大多數人都能順利完成課程。', 'published', '2025-01-30 11:37:49', 2, 17, 310, 45, FALSE),
('潛水課程的未來發展', '隨著潛水運動的普及，潛水課程的內容和形式也在不斷創新。未來可能會出現更多線上課程和虛擬實境教學，讓學習更加便捷。', 'published', '2025-01-29 10:37:49', 2, 18, 320, 50, FALSE),
('潛水課程的國際認證', '國際潛水組織如PADI、SSI和NAUI提供全球認可的潛水課程和證書。選擇有國際認證的課程可以確保你的潛水資格被廣泛接受。', 'published', '2025-01-28 09:37:49', 2, 19, 330, 55, FALSE),
('潛水課程的線上學習資源', '許多潛水中心提供線上學習資源，例如理論課程影片和模擬測驗。這些資源可以幫助你在正式上課前做好準備，提升學習效率。', 'published', '2025-01-27 08:37:49', 2, 20, 340, 60, FALSE),

-- 旅遊潛水 (小分類 ID: 3)
('全球十大潛水勝地推薦', '全球有許多著名的潛水勝地，例如大堡礁、馬爾代夫和紅海。這些地方以清澈的水質、豐富的海洋生物和獨特的水下景觀吸引著潛水愛好者。', 'published', '2025-01-26 07:37:49', 3, 21, 350, 65, FALSE),
('如何規劃一次完美的潛水旅行', '規劃潛水旅行時，需要考慮潛水地點、季節、預算和裝備。建議提前預訂潛水中心和住宿，並查詢當地的潛水條件和注意事項。', 'published', '2025-01-25 06:37:49', 3, 22, 360, 70, FALSE),
('潛水旅行的預算規劃', '潛水旅行的費用包括機票、住宿、潛水費用和裝備租借。一般來說，東南亞的潛水旅行費用較低，而馬爾代夫和大堡礁則較高。', 'published', '2025-01-24 05:37:49', 3, 23, 370, 75, FALSE),
('潛水旅行的裝備清單', '進行潛水旅行時，需要準備潛水鏡、呼吸管、潛水服、腳蹼和潛水日誌等裝備。如果有特殊需求，也可以自備調節器和氣瓶。', 'published', '2025-01-23 04:37:49', 3, 24, 380, 80, FALSE),
('潛水旅行的安全注意事項', '潛水旅行時，安全永遠是第一位的。確保聽從潛水導遊的指示，不要單獨行動，並隨時注意自己的呼吸和身體狀況。', 'published', '2025-01-22 03:37:49', 3, 25, 390, 85, FALSE),
('潛水旅行的最佳季節', '不同地區的潛水季節有所不同。例如，馬爾代夫的最佳潛水季節是11月至4月，而泰國則是12月至3月。選擇合適的季節可以確保良好的能見度和豐富的海洋生物。', 'published', '2025-01-21 02:37:49', 3, 26, 400, 90, FALSE),
('潛水旅行的保險指南', '進行潛水旅行時，建議購買專門的潛水保險。這種保險通常包括潛水事故醫療費用、裝備損失和旅行取消等保障。', 'published', '2025-01-20 01:37:49', 3, 27, 410, 95, FALSE),
('潛水旅行的環保建議', '潛水旅行時，應遵守環保原則，例如不觸碰珊瑚、不餵食魚類和不亂丟垃圾。保護海洋環境是每位潛水愛好者的責任。', 'published', '2025-01-19 00:37:49', 3, 28, 420, 100, FALSE),
('潛水旅行的文化體驗', '潛水旅行不僅可以探索水下世界，還可以體驗當地的文化和美食。例如，在印尼潛水時，可以品嚐當地的海鮮和參觀傳統村落。', 'published', '2025-01-17 23:37:49', 3, 29, 430, 105, FALSE),
('潛水旅行的未來趨勢', '隨著潛水運動的普及，潛水旅行的形式也在不斷創新。未來可能會出現更多結合生態旅遊和文化體驗的潛水行程。', 'published', '2025-01-16 22:37:49', 3, 30, 440, 110, FALSE),

-- 相片分享 (小分類 ID: 4)
('水下攝影技巧分享', '水下攝影是一門藝術，需要掌握光線、構圖和相機設置等技巧。建議使用廣角鏡頭拍攝大場景，並利用自然光線創造美麗的效果。', 'published', '2025-01-15 21:37:49', 4, 31, 450, 115, FALSE),
('如何拍攝清晰的水下照片', '拍攝清晰的水下照片需要穩定的手勢和正確的相機設置。建議使用較快的快門速度和較小的光圈，以確保照片的清晰度。', 'published', '2025-01-14 20:37:49', 4, 32, 460, 120, FALSE),
('水下攝影裝備推薦', '水下攝影需要專用的防水相機或防水殼。推薦的品牌包括Canon、Nikon和Sony，這些品牌提供高質量的水下攝影裝備。', 'published', '2025-01-13 19:37:49', 4, 33, 470, 125, FALSE),
('水下攝影的後期處理技巧', '水下照片的後期處理可以提升色彩和對比度。建議使用Photoshop或Lightroom等軟件進行調整，並注意保持照片的自然感。', 'published', '2025-01-12 18:37:49', 4, 34, 480, 130, FALSE),
('水下攝影的構圖技巧', '水下攝影的構圖非常重要，可以利用魚群、珊瑚和海草等元素創造有趣的畫面。建議多嘗試不同的角度和視角。', 'published', '2025-01-11 17:37:49', 4, 35, 490, 135, FALSE),
('水下攝影的光線運用', '水下光線隨著深度變化，可以利用自然光線創造美麗的效果。建議在淺水區拍攝，並避免使用閃光燈以免嚇跑魚群。', 'published', '2025-01-10 16:37:49', 4, 36, 500, 140, FALSE),
('水下攝影的常見問題', '許多人在進行水下攝影時會遇到問題，例如照片模糊或色彩失真。這些問題可以通過調整相機設置和後期處理來解決。', 'published', '2025-01-09 15:37:49', 4, 37, 510, 145, FALSE),
('水下攝影的未來發展', '隨著科技的進步，水下攝影裝備和技術也在不斷創新。未來可能會出現更多智能化的水下攝影設備，讓拍攝更加便捷。', 'published', '2025-01-08 14:37:49', 4, 38, 520, 150, FALSE),
('水下攝影的比賽資訊', '全球有許多水下攝影比賽，例如Ocean Art和Underwater Photographer of the Year。這些比賽為攝影愛好者提供了展示作品的平台。', 'published', '2025-01-07 13:37:49', 4, 39, 530, 155, FALSE),
('水下攝影的社群分享', '水下攝影愛好者可以通過社交媒體和線上論壇分享作品和交流經驗。這些平台為攝影愛好者提供了學習和成長的機會。', 'published', '2025-01-06 12:37:49', 4, 40, 540, 160, FALSE),

-- 設備討論 (小分類 ID: 5)
('潛水裝備選購指南', '選擇潛水裝備時，需要考慮質量、價格和適用性。建議選擇有國際認證的品牌，並根據自己的需求選擇合適的裝備。', 'published', '2025-01-05 11:37:49', 5, 41, 550, 165, FALSE),
('如何保養潛水裝備', '潛水裝備需要定期保養，以確保其性能和壽命。建議每次潛水後用淡水清洗裝備，並定期檢查氣瓶和調節器。', 'published', '2025-01-04 10:37:49', 5, 42, 560, 170, FALSE),
('潛水裝備的品牌比較', '市面上有許多潛水裝備品牌，例如Scubapro、Aqualung和Cressi。這些品牌提供高質量的裝備，適合不同需求的潛水愛好者。', 'published', '2025-01-03 09:37:49', 5, 43, 570, 175, FALSE),
('潛水裝備的租借 vs 購買', '對於初學者來說，租借裝備是一個經濟實惠的選擇。而對於經常潛水的人來說，購買自己的裝備可以確保舒適和衛生。', 'published', '2025-01-02 08:37:49', 5, 44, 580, 180, FALSE),
('潛水裝備的未來趨勢', '隨著科技的進步，潛水裝備也在不斷創新。未來可能會出現更多智能化的裝備，例如帶有導航功能的潛水電腦和自動調節的呼吸器。', 'published', '2025-01-01 07:37:49', 5, 45, 590, 185, FALSE),
('潛水裝備的安全檢查', '每次潛水前，都需要對裝備進行安全檢查，確保氣瓶壓力正常、調節器運作良好，並檢查潛水服的完整性。', 'published', '2024-12-31 06:37:49', 5, 46, 600, 190, FALSE),
('潛水裝備的二手市場', '二手潛水裝備市場提供了許多經濟實惠的選擇。購買二手裝備時，需要仔細檢查其狀況，並確保其符合安全標準。', 'published', '2024-12-30 05:37:49', 5, 47, 610, 195, FALSE),
('潛水裝備的創新科技', '近年來，潛水裝備的科技不斷進步，例如輕量化的氣瓶和智能潛水電腦。這些創新讓潛水更加安全和便捷。', 'published', '2024-12-29 04:37:49', 5, 48, 620, 200, FALSE),
('潛水裝備的環保設計', '許多潛水裝備品牌開始採用環保材料，例如可回收的橡膠和無毒塗層。這些設計有助於減少對海洋環境的影響。', 'published', '2024-12-28 03:37:49', 5, 49, 630, 205, FALSE),
('潛水裝備的用戶評價', '在購買潛水裝備前，可以查看其他用戶的評價和建議。這些評價可以幫助你選擇適合自己的裝備。', 'published', '2024-12-27 02:37:49', 5, 50, 640, 210, FALSE),

-- 規劃行程 (小分類 ID: 6)
('如何規劃一次完美的潛水行程', '規劃潛水行程時，需要考慮潛水地點、季節、預算和裝備。建議提前預訂潛水中心和住宿，並查詢當地的潛水條件和注意事項。', 'published', '2024-12-26 01:37:49', 6, 51, 650, 215, FALSE),
('潛水行程的預算規劃', '潛水行程的費用包括機票、住宿、潛水費用和裝備租借。一般來說，東南亞的潛水旅行費用較低，而馬爾代夫和大堡礁則較高。', 'published', '2024-12-25 00:37:49', 6, 52, 660, 220, FALSE),
('潛水行程的裝備清單', '進行潛水行程時，需要準備潛水鏡、呼吸管、潛水服、腳蹼和潛水日誌等裝備。如果有特殊需求，也可以自備調節器和氣瓶。', 'published', '2024-12-23 23:37:49', 6, 53, 670, 225, FALSE),
('潛水行程的安全注意事項', '潛水行程時，安全永遠是第一位的。確保聽從潛水導遊的指示，不要單獨行動，並隨時注意自己的呼吸和身體狀況。', 'published', '2024-12-22 22:37:49', 6, 54, 680, 230, FALSE),
('潛水行程的最佳季節', '不同地區的潛水季節有所不同。例如，馬爾代夫的最佳潛水季節是11月至4月，而泰國則是12月至3月。選擇合適的季節可以確保良好的能見度和豐富的海洋生物。', 'published', '2024-12-21 21:37:49', 6, 55, 690, 235, FALSE),
('潛水行程的保險指南', '進行潛水行程時，建議購買專門的潛水保險。這種保險通常包括潛水事故醫療費用、裝備損失和旅行取消等保障。', 'published', '2024-12-20 20:37:49', 6, 56, 700, 240, FALSE),
('潛水行程的環保建議', '潛水行程時，應遵守環保原則，例如不觸碰珊瑚、不餵食魚類和不亂丟垃圾。保護海洋環境是每位潛水愛好者的責任。', 'published', '2024-12-19 19:37:49', 6, 57, 710, 245, FALSE),
('潛水行程的文化體驗', '潛水行程不僅可以探索水下世界，還可以體驗當地的文化和美食。例如，在印尼潛水時，可以品嚐當地的海鮮和參觀傳統村落。', 'published', '2024-12-18 18:37:49', 6, 58, 720, 250, FALSE),
('潛水行程的未來趨勢', '隨著潛水運動的普及，潛水行程的形式也在不斷創新。未來可能會出現更多結合生態旅遊和文化體驗的潛水行程。', 'published', '2024-12-17 17:37:49', 6, 59, 730, 255, FALSE),
('潛水行程的用戶評價', '在選擇潛水行程時，可以查看其他用戶的評價和建議。這些評價可以幫助你選擇適合自己的行程。', 'published', '2024-12-16 16:37:49', 6, 60, 740, 260, FALSE),

-- 海洋生物 (小分類 ID: 7)
('珊瑚礁生態系統介紹', '珊瑚礁是海洋中最重要的生態系統之一，為許多海洋生物提供棲息地。珊瑚礁的健康與海洋環境的保護息息相關。', 'published', '2024-12-15 15:37:49', 7, 61, 750, 265, FALSE),
('如何辨識常見的海洋生物', '水下世界充滿了各種各樣的海洋生物，例如熱帶魚、海龜和鯊魚。學習辨識這些生物可以讓你的潛水體驗更加有趣。', 'published', '2024-12-14 14:37:49', 7, 62, 760, 270, FALSE),
('海洋生物的保護措施', '保護海洋生物是每位潛水愛好者的責任。可以通過減少塑料使用、支持海洋保護組織和參與淨灘活動來貢獻自己的力量。', 'published', '2024-12-13 13:37:49', 7, 63, 770, 275, FALSE),
('海洋生物的攝影技巧', '拍攝海洋生物需要耐心和技巧。建議使用長焦鏡頭拍攝遠距離的生物，並利用自然光線創造美麗的效果。', 'published', '2024-12-12 12:37:49', 7, 64, 780, 280, FALSE),
('海洋生物的未來趨勢', '隨著海洋環境的變化，許多海洋生物的生存面臨威脅。未來可能會出現更多保護海洋生物的措施和技術。', 'published', '2024-12-11 11:37:49', 7, 65, 790, 285, FALSE),
('海洋生物的常見問題', '許多人在潛水時會遇到海洋生物相關的問題，例如「如何避免被水母螫傷？」或「如何與鯊魚和平共處？」這些問題可以通過學習和經驗來解決。', 'published', '2024-12-10 10:37:49', 7, 66, 800, 290, FALSE),
('海洋生物的創新研究', '近年來，科學家對海洋生物的研究不斷深入，例如珊瑚的再生技術和海洋生物的遷徙模式。這些研究有助於保護海洋生態系統。', 'published', '2024-12-09 09:37:49', 7, 67, 810, 295, FALSE),
('海洋生物的社群分享', '海洋生物愛好者可以通過社交媒體和線上論壇分享照片和經驗。這些平台為愛好者提供了學習和交流的機會。', 'published', '2024-12-08 08:37:49', 7, 68, 820, 300, FALSE),
('海洋生物的比賽資訊', '全球有許多海洋生物攝影比賽，例如Ocean Art和Underwater Photographer of the Year。這些比賽為攝影愛好者提供了展示作品的平台。', 'published', '2024-12-07 07:37:49', 7, 69, 830, 305, FALSE),
('海洋生物的用戶評價', '在選擇海洋生物相關的產品或服務時，可以查看其他用戶的評價和建議。這些評價可以幫助你做出更好的選擇。', 'published', '2024-12-06 06:37:49', 7, 70, 840, 310, FALSE),

-- 潛水技巧 (小分類 ID: 8)
('如何提升中性浮力', '中性浮力是潛水的重要技巧，可以通過調整呼吸和配重來控制。建議多練習並聽從教練的指導，以提升自己的中性浮力。', 'published', '2024-12-05 05:37:49', 8, 71, 850, 315, FALSE),
('潛水手勢的完整指南', '潛水手勢是潛水員之間溝通的重要工具。學習常用的手勢，例如「OK」、「上升」和「下降」，可以讓潛水更加安全和順利。', 'published', '2024-12-04 04:37:49', 8, 72, 860, 320, FALSE),
('潛水技巧的常見問題', '許多人在學習潛水技巧時會遇到問題，例如「如何避免耳壓不平衡？」或「如何控制呼吸？」這些問題可以通過練習和經驗來解決。', 'published', '2024-12-03 03:37:49', 8, 73, 870, 325, FALSE),
('潛水技巧的未來趨勢', '隨著潛水運動的普及，潛水技巧的教學方式也在不斷創新。未來可能會出現更多虛擬實境教學和智能化的訓練設備。', 'published', '2024-12-02 02:37:49', 8, 74, 880, 330, FALSE),
('潛水技巧的創新研究', '近年來，科學家對潛水技巧的研究不斷深入，例如如何減少氮醉風險和提升水下導航精度。這些研究有助於提升潛水的安全性。', 'published', '2024-12-01 01:37:49', 8, 75, 890, 335, FALSE),
('潛水技巧的社群分享', '潛水技巧愛好者可以通過社交媒體和線上論壇分享經驗和技巧。這些平台為愛好者提供了學習和交流的機會。', 'published', '2024-11-30 00:37:49', 8, 76, 900, 340, FALSE),
('潛水技巧的比賽資訊', '全球有許多潛水技巧比賽，例如水下導航和中性浮力挑戰賽。這些比賽為潛水愛好者提供了展示技巧的平台。', 'published', '2024-11-28 23:37:49', 8, 77, 910, 345, FALSE),
('潛水技巧的用戶評價', '在選擇潛水技巧相關的產品或服務時，可以查看其他用戶的評價和建議。這些評價可以幫助你做出更好的選擇。', 'published', '2024-11-27 22:37:49', 8, 78, 920, 350, FALSE),
('潛水技巧的線上學習資源', '許多潛水中心提供線上學習資源，例如理論課程影片和模擬測驗。這些資源可以幫助你在正式上課前做好準備，提升學習效率。', 'published', '2024-11-26 21:37:49', 8, 79, 930, 355, FALSE),
('潛水技巧的未來發展', '隨著科技的進步，潛水技巧的教學和訓練方式也在不斷創新。未來可能會出現更多智能化的訓練設備和虛擬實境教學。', 'published', '2024-11-25 20:37:49', 8, 80, 940, 360, FALSE),

-- 海洋環境 (小分類 ID: 9)
('海洋污染的現狀與影響', '海洋污染是當前全球面臨的重大問題，塑料垃圾、油污和化學廢料對海洋生態系統造成了嚴重破壞。保護海洋環境是每個人的責任。', 'published', '2024-11-24 19:37:49', 9, 81, 950, 365, FALSE),
('如何保護海洋環境', '保護海洋環境可以從日常生活中的小事做起，例如減少塑料使用、參與淨灘活動和支持環保組織。每個人的努力都能為海洋環境帶來改變。', 'published', '2024-11-23 18:37:49', 9, 82, 960, 370, FALSE),
('海洋環境的未來趨勢', '隨著環保意識的提升，未來可能會出現更多保護海洋環境的措施和技術，例如海洋垃圾清理機器人和可降解塑料的研發。', 'published', '2024-11-22 17:37:49', 9, 83, 970, 375, FALSE),
('海洋環境的創新研究', '近年來，科學家對海洋環境的研究不斷深入，例如海洋酸化對珊瑚礁的影響和海洋生態系統的恢復技術。這些研究有助於保護海洋環境。', 'published', '2024-11-21 16:37:49', 9, 84, 980, 380, FALSE),
('海洋環境的社群分享', '海洋環境愛好者可以通過社交媒體和線上論壇分享環保經驗和建議。這些平台為愛好者提供了學習和交流的機會。', 'published', '2024-11-20 15:37:49', 9, 85, 990, 385, FALSE),
('海洋環境的比賽資訊', '全球有許多海洋環境保護比賽，例如海洋垃圾清理挑戰賽和環保創意大賽。這些比賽為環保愛好者提供了展示創意的平台。', 'published', '2024-11-19 14:37:49', 9, 86, 1000, 390, FALSE),
('海洋環境的用戶評價', '在選擇海洋環境相關的產品或服務時，可以查看其他用戶的評價和建議。這些評價可以幫助你做出更好的選擇。', 'published', '2024-11-18 13:37:49', 9, 87, 1010, 395, FALSE),
('海洋環境的線上學習資源', '許多環保組織提供線上學習資源，例如海洋環境保護的課程和講座。這些資源可以幫助你更深入地了解海洋環境問題。', 'published', '2024-11-17 12:37:49', 9, 88, 1020, 400, FALSE),
('海洋環境的未來發展', '隨著科技的進步，海洋環境保護的方式也在不斷創新。未來可能會出現更多智能化的環保設備和技術，例如海洋垃圾清理機器人。', 'published', '2024-11-16 11:37:49', 9, 89, 1030, 405, FALSE),
('海洋環境的常見問題', '許多人在關注海洋環境時會有疑問，例如「如何減少塑料使用？」或「如何參與海洋保護活動？」這些問題可以通過學習和行動來解決。', 'published', '2024-11-15 10:37:49', 9, 90, 1040, 410, FALSE),

-- 潛水新聞 (小分類 ID: 10)
('全球潛水新聞速報', '全球潛水界的最新動態，包括新潛點的發現、潛水賽事的報導和潛水技術的創新。這些新聞為潛水愛好者提供了最新的資訊。', 'published', '2024-11-14 09:37:49', 10, 91, 1050, 415, FALSE),
('潛水賽事的最新動態', '全球有許多潛水賽事，例如自由潛水比賽和水下攝影大賽。這些賽事為潛水愛好者提供了展示技巧和創意的平台。', 'published', '2024-11-13 08:37:49', 10, 92, 1060, 420, FALSE),
('潛水界的重要人物專訪', '潛水界有許多重要人物，例如潛水教練、海洋生物學家和環保人士。這些專訪為潛水愛好者提供了寶貴的經驗和建議。', 'published', '2024-11-12 07:37:49', 10, 93, 1070, 425, FALSE),
('潛水新聞的未來趨勢', '隨著潛水運動的普及，潛水新聞的報導方式也在不斷創新。未來可能會出現更多結合虛擬實境技術的新聞報導。', 'published', '2024-11-11 06:37:49', 10, 94, 1080, 430, FALSE),
('潛水新聞的創新研究', '近年來，科學家對潛水新聞的研究不斷深入，例如如何提升水下攝影技術和如何保護潛水環境。這些研究有助於推動潛水運動的發展。', 'published', '2024-11-10 05:37:49', 10, 95, 1090, 435, FALSE),
('潛水新聞的社群分享', '潛水新聞愛好者可以通過社交媒體和線上論壇分享最新動態和評論。這些平台為愛好者提供了交流的機會。', 'published', '2024-11-09 04:37:49', 10, 96, 1100, 440, FALSE),
('潛水新聞的比賽資訊', '全球有許多潛水新聞比賽，例如最佳潛水報導獎和最佳水下攝影獎。這些比賽為新聞工作者提供了展示作品的平台。', 'published', '2024-11-08 03:37:49', 10, 97, 1110, 445, FALSE),
('潛水新聞的用戶評價', '在選擇潛水新聞相關的產品或服務時，可以查看其他用戶的評價和建議。這些評價可以幫助你做出更好的選擇。', 'published', '2024-11-07 02:37:49', 10, 98, 1120, 450, FALSE),
('潛水新聞的線上學習資源', '許多新聞機構提供線上學習資源，例如潛水新聞的課程和講座。這些資源可以幫助你更深入地了解潛水新聞的製作過程。', 'published', '2024-11-06 01:37:49', 10, 99, 1130, 455, FALSE),
('潛水新聞的未來發展', '隨著科技的進步，潛水新聞的報導方式也在不斷創新。未來可能會出現更多結合虛擬實境技術的新聞報導。', 'published', '2024-11-05 00:37:49', 10, 100, 1140, 460, FALSE),

-- 潛水活動 (小分類 ID: 11)
('全球潛水活動推薦', '全球有許多著名的潛水活動，例如馬爾代夫的夜潛和紅海的沉船潛水。這些活動為潛水愛好者提供了獨特的體驗。', 'published', '2024-11-03 23:37:49', 11, 101, 1150, 465, FALSE),
('如何參與潛水活動', '參與潛水活動需要提前報名並準備好相關裝備。建議選擇有國際認證的潛水中心，並查看其他參與者的評價。', 'published', '2024-11-02 22:37:49', 11, 102, 1160, 470, FALSE),





-- 插入資料到 article_image 表格
INSERT INTO article_image (article_id, name, img_url, is_main) VALUES
(1, '1', '/img/article/001.jpg', TRUE),
(2, '2', '/img/article/002.jpg', TRUE),
(3, '3', '/img/article/003.jpg', TRUE),
(4, '4', '/img/article/004.jpg', TRUE),
(5, '5', '/img/article/005.jpg', TRUE),
(6, '6', '/img/article/006.jpg', TRUE),
(7, '7', '/img/article/007.jpg', TRUE),
(8, '8', '/img/article/008.jpg', TRUE),
(9, '9', '/img/article/009.jpg', TRUE),
(10, '10', '/img/article/010.jpg', TRUE),
(11, '11', '/img/article/011.jpg', TRUE),
(12, '12', '/img/article/012.jpg', TRUE),
(13, '13', '/img/article/013.jpg', TRUE),
(14, '14', '/img/article/014.jpg', TRUE),
(15, '15', '/img/article/015.jpg', TRUE),
(16, '16', '/img/article/016.jpg', TRUE),
(17, '17', '/img/article/017.jpg', TRUE),
(18, '18', '/img/article/018.jpg', TRUE),
(19, '19', '/img/article/019.jpg', TRUE),
(20, '20', '/img/article/020.jpg', TRUE);


-- 插入資料到 article_tag_big 表格
INSERT INTO article_tag_big (article_id, article_tag_small_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

-- 插入資料到 article_reply 表格
INSERT INTO article_reply (article_id, users_id, content, floor_number, reply_number, level, created_at) VALUES
(1, 1, '這篇文章寫得真好，讓我對潛水有了更深的認識！', 1, 0, '1', '2025-02-17 08:37:49'),
(1, 2, '我也好想去潛水，請問初學者該如何開始？', 2, 0, '1', '2025-02-17 09:26:49'),
(1, 3, '回覆2樓：建議先找專業教練學習基礎技巧哦！', 2, 2, '2', '2025-02-17 10:15:49'),
(1, 3, '潛水真的是一種很棒的體驗，推薦大家試試！', 3, 0, '1', '2025-02-17 11:04:49'),
(1, 2, '請問潛水裝備大概需要多少預算？', 4, 0, '1', '2025-02-17 11:53:49'),
(1, 1, '回覆5樓：初學者建議先租裝備，等熟悉後再考慮購買。', 4, 5, '2', '2025-02-17 12:42:49'),
(1, 1, '潛水時遇到鯊魚怎麼辦？有點害怕...', 5, 0, '1', '2025-02-17 13:31:49'),
(1, 2, '回覆7樓：鯊魚其實並不可怕，保持冷靜就好！', 5, 7, '2', '2025-02-17 14:20:49'),
(1, 3, '潛水後耳朵會痛，這是正常的嗎？', 6, 0, '1', '2025-02-17 15:09:49'),
(1, 2, '回覆9樓：可能是耳壓平衡沒做好，建議多練習耳壓平衡技巧。', 6, 9, '2', '2025-02-17 15:58:49');


-- 插入資料到 article_likes_dislikes 表格
INSERT INTO article_likes_dislikes (article_id, users_id, is_like) VALUES
(1, 1, TRUE),
(1, 2, false),
(1, 3, TRUE),
(1, 4, false),
(1, 5, false),
(2, 1, TRUE),
(2, 2, false),
(2, 3, TRUE),
(2, 4, false),
(2, 5, TRUE);