-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2025 年 02 月 18 日 03:46
-- 伺服器版本： 10.4.28-MariaDB
-- PHP 版本： 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `divin`
--

-- --------------------------------------------------------

--
-- 資料表結構 `activity`
--

CREATE TABLE `activity` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `activityCity_id` int(10) UNSIGNED DEFAULT NULL,
  `introduction` text NOT NULL,
  `description` text NOT NULL,
  `journey` text DEFAULT NULL,
  `meetingPoint` text DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `type` int(11) NOT NULL COMMENT '1.浮潛\r\n2.水肺潛水\r\n3.自由潛水\r\n4.其他',
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `activity`
--

INSERT INTO `activity` (`id`, `name`, `activityCity_id`, `introduction`, `description`, `journey`, `meetingPoint`, `duration`, `language`, `type`, `price`) VALUES
(1, '小琉球體驗潛水', 5, '', '你是否怕水，卻又想一窺蔚藍的海底世界呢？ 你是否猶豫，到底要不要考一張潛水證照呢？ 體驗潛水，是你最好的選擇！ 專業教練耐心為你講解小學生都可以聽懂的課程， 用簡單又幽默的方式一對一帶你認識裝備、適應呼吸、水下手勢溝通，  即使不會游泳，也能嘗試潛入深海與海龜共游 10歲到70歲都可以嘗試的小琉球必玩水上活動。', NULL, NULL, NULL, NULL, 0, 2500),
(2, '小琉球岸潛活動', 5, '', '', NULL, NULL, NULL, NULL, 0, 1000),
(3, '水肺潛水體驗課程(泳池)', 1, '', '', NULL, NULL, NULL, NULL, 0, 1500),
(4, '美人魚 體驗潛水', 3, '', '', NULL, NULL, NULL, NULL, 0, 3000),
(5, 'Level 1自由潛水認證課程', 2, '', '多種潛水系統DIWA, PADI, SSI, AIDA…任您挑選\r\n扎實訓練課程讓您安心考取國際證照\r\n專業教練小班制教學且彈性上課時間\r\n趕緊報名一起解鎖水下新技能吧！', NULL, NULL, NULL, NULL, 0, 1500),
(13, '小琉球船潛方案', 5, '', '【一趟兩潛】：＄2800/人\n費用包含： 一位船上前導、一位潛雪後導、兩支氣瓶、水面休息餐、保險、水下攝影/錄影\n＊單人報名船潛需補500元\n＊船潛前需要安排一支岸潛測潛\n＊小琉球船潛第一潛都會去大深度，第二潛才去較淺的地方，所以沒辦法在船潛時測潛', NULL, NULL, NULL, NULL, 0, 600),
(14, ' PADI 進階開放水域潛水員課程', 8, '', 'PADI 進階開放水域潛水員課程\nAdvanced Open water Course\n想出國/離島旅遊，卻擔心無法參加深潛夜潛，錯過美麗的潛點？那麼應該在台灣完成進階潛水的訓練，而不是到國外才摸索適應喔。\n\n進階潛水課程會更加扎實的訓練水底導航能力、如何用電腦錶瞭解潛水計劃，以及深潛、夜潛、船潛等多項潛水專長。用最有效率的方式訓練潛水技巧，省去自己摸索的時間，加深對潛水活動的認知。\n\n課程特色\n進階船潛班，出國船潛更熟練 !（3支岸潛+2支船潛）\n\n可再加購船潛一次 1000元 (原價', NULL, NULL, NULL, NULL, 0, 300),
(15, '海洋陪玩', 5, '', '「海洋陪玩」 設計給給3歲到6歲的小孩。\r\n讓小孩子在最安全的環境下接觸大海，家長也可以無後顧之憂在旁陪伴。\r\n費用含小朋友浮潛裝備、活動保險、教練陪玩\r\n活動時間\r\n總時間約2小時 （水下時間約40-50分鐘）\r\n\r\n活動特色\r\n注意事項\r\n教練與小朋友比例最多 1:2\r\n\r\n含FISH ID講解，更加認識水中生物!\r\n\r\n淺水慢慢玩， 依據小朋友狀況調整水域\r\n\r\n提供小孩專用救生衣，套鞋，蛙鏡，防曬衣\r\n\r\n可加購水下拍攝服務，留下美美的紀念照 ​', NULL, NULL, NULL, NULL, 0, 3000),
(16, 'PADI 浮潛', 5, '', '害怕深水挑戰嗎?\n​你可以先嘗試水面浮潛的活動，看看美麗的海底世界!\n活動特色\n教練與學生比例最多 1:6，安全有保障\n含FISH ID講解，更加認識水中生物!\n淺水慢慢玩， 依據狀況調整水域\n可加購水下拍攝服務，留下美美的紀念照 ​\n費用含浮潛裝備、活動保險、教練導潛\n活動時間\n總時間約2小時 （水下時間約40-50分鐘）\n注意事項\n​浮潛年齡需滿6歲以上， 3-6歲請參考 海洋陪玩\n記得帶泳衣或泳褲、毛巾\n我們期許時時都有好天氣，但若海況或氣候不適', NULL, NULL, NULL, NULL, 0, 600),
(17, '泡泡小勇士', 5, '', '在水中向兒童介紹潛水，幫孩子舉辦一場難忘又精彩的泡泡小勇士派對，邀請親朋好友來慶祝，好玩、簡單又安全。\r\n\r\n課程特色\r\n​適合8-10歲的小朋友體驗親海的樂趣\r\n\r\n孩子可以和家人一同享受水肺潛水的樂趣。\r\n\r\n兒童潛水的最大深度僅限於 2 公尺 / 6 英呎。\r\n\r\n課程為時大約2.5小時（包括報到，著裝，玩耍）\r\n\r\n也可以是開放水域的體驗課程（最大深度 2公尺 / 6 英呎）\r\n\r\n你會學到什麼？ 孩子有機會：\r\n在 PADI 教練的照顧和督導下，體驗水肺潛水。\r\n\r\n經歷生平第一次的水底呼吸。\r', NULL, NULL, NULL, NULL, 0, 600),
(18, '海洋大使', 5, '', '海洋大使設計給沒有證照，又想深度認識海洋生態知識的朋友，年滿6歲都能參加唷 !\r\n與大海近距離接觸，是否對海中的生物充滿好奇，很想知道牠們叫什麼名字、有什麼樣的習性、該如何與這片豐富多彩的海洋當朋友呢 ?\r\n這堂「海洋大使」課程，會有詳細的生態解說。\r\n包括墾丁海域常見的珊瑚與魚類介紹，讓你一下水就認出 : 「這是鸚哥魚、那是雀鯛魚，這是雀屏珊瑚、那是玫瑰珊瑚...」\r\n並探討珊瑚白化、過度捕撈、海洋垃圾等海洋困境，思考如何用行動守護海洋。\r\nBring Ocean Into Your Life.\r\n我們', NULL, NULL, NULL, NULL, 0, 600),
(19, 'PADI 開放水域潛水員課程 岸潛班', 2, '', '潛水入門中最受歡迎的證照，全球已有數百萬人取得PADI開放水域潛水員證照。\r\n完成開放水域潛水員訓練，代表俱備基本的潛水知識與技巧，可憑證照至世界各地租借裝備、氣瓶或聘請潛導，進行潛水觀光。\r\n訓練期間，最大潛水深度為18公尺，取得證照之後建議不要超過休閒潛水的極限40公尺，也建議經常練習累積潛水經驗，或參與進階課程增加技巧熟練度。\r\n\r\n課程特色\r\n小班制教學，慢慢學沒壓力。 教練:學生 1:3\r\n課程期間全程提供電腦錶使用！(Suunto ZOOP 電腦錶)\r\n使用浮力袋，潛水旅遊更上手(開放水域2)', NULL, NULL, NULL, NULL, 0, 1500),
(20, 'PADI 開放水域潛水員課程 船潛班', 1, '', '潛水入門中最受歡迎的證照，全球已有數百萬人取得PADI開放水域潛水員證照。\r\n完成開放水域潛水員訓練，代表俱備基本的潛水知識與技巧，可憑證照至世界各地租借裝備、氣瓶或聘請潛導，進行潛水觀光。\r\n訓練期間，最大潛水深度為18公尺，取得證照之後建議不要超過休閒潛水的極限40公尺，也建議經常練習累積潛水經驗，或參與進階課程增加技巧熟練度。', NULL, NULL, NULL, NULL, 0, 2000),
(21, 'PADI 水肺潛水員課程', 1, '', '這是一張有限制的潛水證照，適合不足時間完成開放水域潛水員課程的人。\r\n完成訓練後，可用證照至世界各地進行潛水旅遊。但必須在合格的潛水長或教練的督導下潛水。深度限制在12公尺內。可經由轉學程序，取得開放水域潛水員證照。\r\n報名須知\r\n年齡需滿10歲以上，健康狀況良好 ＊健康聲明書在此請點擊\r\n若你有任何身體狀況，請先通過醫師的批准後，再進行潛水課程。\r\n需自備泳衣、毛巾、個人照片（電子檔亦可）、個人需要物品。\r\n報名費用\r\n9,900元 （岸潛）\r\n費用含全套潛水裝備、證照申請費、氣瓶費、活動保險及訓練費。', NULL, NULL, NULL, NULL, 0, 3000),
(22, 'PADI 救援潛水員課程', 4, '', '急救與水域救援的觀念，人人都應該俱備。除了能協助潛伴解除問題，自救更是救援潛水員十分重要的觀念。\r\n完整的救援潛水訓練及透過模擬情節練習，讓你在遇到危急狀況時，能冷靜應對並作出正確判斷。\r\n這門課程是建立在你已經學過的潛水技巧之上，以學會如何避免問題發生與問題發生後如何處理為基礎，做進一步的延伸。\r\n課程特色\r\n課程增加技術潛水中性浮力概念。\r\n加贈20項水肺技巧研討會，為潛水長課程做好準備。\r\n含中餐2餐，吃飽再潛，活力滿點。', NULL, NULL, NULL, NULL, 0, 5000),
(23, 'PADI 水肺複習課程', 1, '', '上完初階課程對於潛水還是不太熟悉嗎？拿到證照後卻不敢潛入水中？ 或是已經超過六個月以上沒有潛水，對於潛水感到生疏甚至忘光了？ 沒關係！水肺複習課程重新喚醒你體內的潛水魂與潛水技巧， 你可以選擇用半天或一天的時間來加強技巧以及旅遊潛水，找回悠游在大海裡的感覺，或者做一次完整複習課程，把潛水記憶全部都找回來。', NULL, NULL, NULL, NULL, 0, 1500),
(24, 'PADI 自由潛水員課程', 2, '', 'PADI自由潛水課程，是針對休閒自由潛水設計的。培養基本的靜態閉氣、動態平潛、攀繩下潛以及恆重下潛知識與技巧，包含基本入水姿勢、基本技巧、潛水安全和潛伴制度。\r\n自由潛水會涉及較深的閉氣潛水，讓初學者能運用裝備和生理、心理技巧，在安全範圍內潛水。', NULL, NULL, NULL, NULL, 0, 1500),
(25, '旅遊潛水（岸潛）', 7, '', '', NULL, NULL, NULL, NULL, 0, 600),
(26, '旅遊潛水（船潛）', 7, '', '', NULL, NULL, NULL, NULL, 0, 600),
(27, '旅遊潛水（夜潛）', 7, '', '', NULL, NULL, NULL, NULL, 0, 600),
(29, '小琉球熊潛水浮潛體驗｜花瓶岩＆龍蝦洞＆美人洞（三擇一）海龜共游', 7, '全程由專業的教練帶領，不會游泳也可以下水與魚兒同樂，無須擔心\n老幼皆宜的浮潛體驗，可以帶着年長者和小朋友同樂\n悠遊的欣賞海底美麗生態，幸運的話還有機會與海龜共游\n提供水中拍照服務，且不限張數，通通可以讓您帶回家', '小琉球擁有得天獨厚的自然景觀、清澈海水、豐富海洋生態為唯一鄰近台灣的藍色珊瑚礁島，認識小琉球海洋最好的方式就是透過浮潛，近距離地觀看魚群、海龜等海洋生物。\n於集合地點報到，更換浮潛的服裝及裝備 ( 水母衣、防滑鞋、面鏡、呼吸管、救生衣 )\n換裝後，騎車到活動的海域，於岸邊先做說明和動作講解\n講解結束，將進行浮潛活動與海洋生物近距離接觸\n浮潛完，回岸邊休息拍照\n回潛水店沖洗並換裝', '第1天\n 當天餐點： 早餐\n填寫浮潛報名表\n\n填寫切結書\n\n實際下水體驗浮潛之樂趣\n\n與花瓶岩合影\n\n老少咸宜的體驗活動\n\n面鏡及呼吸管如何使用之教學\n\n繽紛的海底世界\n\n最期待的就是目睹這一瞬間\n\n小朋友也可以玩得很開心\n\n海龜看飽看滿\n\n大圈小圈畫個圓\n\n遇見海龜\n\n留下浮潛美好的回憶\n', NULL, '2小時', 'English/中文', 1, 330),
(30, '菲律賓長灘島｜水肺潛水入門課程', 13, '客製化的小團學習潛水課程，讓您輕鬆學會水肺潛水的基礎\r\n和專業的水肺潛水指導員一同探索海底世界\r\n贈送錄影服務，為你的潛水經驗留下特別的紀念', '透過多次得獎的觀光業者的規劃，您便可以在長灘島參與水肺潛水的體驗！在小班學習水肺潛水的基礎知識，並藉由好玩又豐富的水中活動探索長灘島的各種海洋生物。\n讓您的專業潛水教練捕捉您水肺潛水之旅的每一刻，讓您可以透過照片和影片重溫您的體驗。最重要的是，在長灘島享受潛水，價格實惠又親民！', '第1天\r\n09:00\r\n在集合地點展開長灘島的水肺潛水冒險！\r\n10:00\r\n聆聽安全須知，由專業教練指導如何使用設備\r\n在長灘島與魚群共泳\r\n在水肺潛水體驗中探索豐富的海洋生物\r\n與親朋好友一起潛水，讓您的假期更值得紀念\r\n10:30\r\n下潛深度加深，練習您的水肺潛水技巧\r\n11:30\r\n返回潛水中心', NULL, '3 小時', 'English/中文/ 한국어/廣東話', 2, 1416);

-- --------------------------------------------------------

--
-- 資料表結構 `activity_city`
--

CREATE TABLE `activity_city` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `activityCountry_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `activity_city`
--

INSERT INTO `activity_city` (`id`, `name`, `description`, `activityCountry_id`) VALUES
(1, '屏東', NULL, 1),
(2, '台東', NULL, 1),
(3, '澎湖', NULL, 1),
(4, '綠島', NULL, 1),
(5, '蘭嶼', NULL, 1),
(7, '小琉球', NULL, 1),
(8, '其他', NULL, 1),
(10, '沖繩', NULL, 2),
(11, '石垣島', NULL, 2),
(12, '其他', NULL, 2),
(13, '長灘島', NULL, 3),
(14, '宿霧', NULL, 3),
(15, '薄荷島', NULL, 3),
(16, '其他', NULL, 3),
(17, '其他', NULL, 4);

-- --------------------------------------------------------

--
-- 資料表結構 `activity_country`
--

CREATE TABLE `activity_country` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `activity_country`
--

INSERT INTO `activity_country` (`id`, `name`) VALUES
(1, '台灣'),
(2, '日本'),
(3, '菲律賓'),
(4, '其他');

-- --------------------------------------------------------

--
-- 資料表結構 `activity_image`
--

CREATE TABLE `activity_image` (
  `id` int(10) UNSIGNED NOT NULL,
  `activity_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `imgUrl` varchar(255) DEFAULT NULL,
  `isMain` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 非主圖, 1: 是主圖'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `activity_image`
--

INSERT INTO `activity_image` (`id`, `activity_id`, `name`, `imgUrl`, `isMain`) VALUES
(1, 1, '小琉球潛水體驗活動主圖', 'P3140183-1-1024x768.jpg', 1),
(2, 2, '小琉球岸潛活動主圖', 'SNOW0161-1-1024x768.jpg', 1),
(3, 2, '小琉球岸潛附圖', 'S__150020104-1024x768.jpg', 0),
(4, 3, '水肺潛水體驗課程（泳池）主圖', 'discovery01.jpg', 1),
(5, 4, '美人魚體驗潛水課程主圖', 'MnXqmRCE9bWO9rTMTkL5rgIJfTtvfhsSQF1fcJGu.jpg', 1),
(6, 5, 'Level 1自由潛水認證課程（主圖）', '1732686903.jpg', 1),
(14, 13, '小琉球船潛方案（主圖）', '1733139860.jpg', 1),
(15, 14, ' PADI 進階開放水域潛水員課程（主圖）', '1733141918.avif', 1),
(16, 15, '海洋陪玩（主圖）', '1733142480.webp', 1),
(17, 16, 'PADI 浮潛（主圖）', '1733151358.webp', 1),
(18, 17, '泡泡小勇士（主圖）', '1733155171.avif', 1),
(19, 18, '海洋大使（主圖）', '1733155343.avif', 1),
(20, 19, 'PADI 開放水域潛水員課程 岸潛班（主圖）', '1733155699.avif', 1),
(21, 20, 'PADI 開放水域潛水員課程 船潛班（主圖）', '1733156287.avif', 1),
(22, 21, 'PADI 水肺潛水員課程（主圖）', '1733157883.jpg', 1),
(23, 22, 'PADI 救援潛水員課程（主圖）', '1733158177.avif', 1),
(24, 23, 'PADI 水肺複習課程（主圖）', '1733158298.jpg', 1),
(25, 24, 'PADI 自由潛水員課程（主圖）', '1733158416.avif', 1),
(26, 25, '旅遊潛水（岸潛）（主圖）', '1733158588.avif', 1),
(27, 26, '旅遊潛水（船潛）（主圖）', '1733158672.avif', 1),
(28, 27, '旅遊潛水（夜潛）（主圖）', '1733158747.avif', 1),
(30, 29, '小琉球熊潛水浮潛體驗｜花瓶岩＆龍蝦洞＆美人洞（三擇一）海龜共游', 'jpg (3).webp', 1),
(31, 29, '小琉球熊潛水浮潛體驗｜花瓶岩＆龍蝦洞＆美人洞（三擇一）海龜共游 (非主圖)', 'jpg.jpg', 0),
(32, 29, '小琉球熊潛水浮潛體驗｜花瓶岩＆龍蝦洞＆美人洞（三擇一）海龜共游 (非主圖)', 'jpg.webp', 0),
(33, 29, '小琉球熊潛水浮潛體驗｜花瓶岩＆龍蝦洞＆美人洞（三擇一）海龜共游 (非主圖)', 'jpg (1).webp', 0),
(34, 29, '小琉球熊潛水浮潛體驗｜花瓶岩＆龍蝦洞＆美人洞（三擇一）海龜共游 (非主圖)', 'jpg (2).webp', 0);

-- --------------------------------------------------------

--
-- 資料表結構 `activity_project`
--

CREATE TABLE `activity_project` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `earliestDate` date NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `s​pecification` varchar(255) NOT NULL,
  `originalPrice` varchar(50) NOT NULL,
  `price` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `activity_project`
--

INSERT INTO `activity_project` (`id`, `name`, `activity_id`, `earliestDate`, `date`, `time`, `s​pecification`, `originalPrice`, `price`) VALUES
(1, '', 1, '2025-02-12', '2025-02-20', '10', '', '5000', '3000');

-- --------------------------------------------------------

--
-- 資料表結構 `brand`
--

CREATE TABLE `brand` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `brand`
--

INSERT INTO `brand` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Scubapro', '專業潛水設備品牌', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, 'Mares', '來自義大利的高品質潛水裝備', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(3, 'Aqualung', '全球知名的潛水裝備品牌', '2025-02-14 15:23:58', '2025-02-14 15:23:58');

-- --------------------------------------------------------

--
-- 資料表結構 `carts`
--

CREATE TABLE `carts` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `status` enum('active','checked_out','abandoned') NOT NULL DEFAULT 'active',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `status`, `createdAt`, `updatedAt`) VALUES
(3, 1, 'active', '2025-02-16 20:03:18', '2025-02-16 20:03:18'),
(10, 2, 'active', '2025-02-16 20:43:15', '2025-02-16 20:43:15');

-- --------------------------------------------------------

--
-- 資料表結構 `cart_activity_items`
--

CREATE TABLE `cart_activity_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `cart_id` int(10) UNSIGNED NOT NULL,
  `activity_project_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `cart_activity_items`
--

INSERT INTO `cart_activity_items` (`id`, `cart_id`, `activity_project_id`, `quantity`, `date`, `time`, `createdAt`, `updatedAt`) VALUES
(1, 3, 1, 3, '0000-00-00', '00:00:00', '2025-02-18 10:13:01', '2025-02-18 10:42:56');

-- --------------------------------------------------------

--
-- 資料表結構 `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `cart_id` int(10) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bundle_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `variant_id`, `quantity`, `createdAt`, `updatedAt`, `bundle_id`) VALUES
(4, 3, 3, 3, '2025-02-16 20:12:40', '2025-02-17 19:39:02', NULL),
(10, 10, 3, 1, '2025-02-16 20:43:15', '2025-02-16 20:43:15', NULL),
(11, 3, 4, 5, '2025-02-17 13:42:14', '2025-02-17 20:33:58', NULL),
(12, 3, 2, 9, '2025-02-17 13:42:32', '2025-02-17 19:32:16', NULL),
(22, 3, 1, 34, '2025-02-18 09:36:00', '2025-02-18 10:25:45', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `cart_rental_items`
--

CREATE TABLE `cart_rental_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `cart_id` int(10) UNSIGNED NOT NULL,
  `rental_id` int(10) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `cart_rental_items`
--

INSERT INTO `cart_rental_items` (`id`, `cart_id`, `rental_id`, `start_date`, `end_date`, `quantity`, `createdAt`) VALUES
(1, 3, 1, '2025-02-20', '2025-02-25', 1, '2025-02-18 10:26:49');

-- --------------------------------------------------------

--
-- 資料表結構 `category_big`
--

CREATE TABLE `category_big` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `category_big`
--

INSERT INTO `category_big` (`id`, `name`) VALUES
(1, '潛水裝備'),
(2, '配件');

-- --------------------------------------------------------

--
-- 資料表結構 `category_small`
--

CREATE TABLE `category_small` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_big_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `category_small`
--

INSERT INTO `category_small` (`id`, `name`, `category_big_id`) VALUES
(1, '面鏡', 1),
(2, '防寒衣', 1),
(3, '調節器', 1),
(4, '潛水燈', 2);

-- --------------------------------------------------------

--
-- 資料表結構 `color`
--

CREATE TABLE `color` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `color_code` varchar(7) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `color`
--

INSERT INTO `color` (`id`, `name`, `color_code`, `createdAt`, `updatedAt`) VALUES
(1, '黑色', '#000000', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, '藍色', '#0000FF', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(3, '紅色', '#FF0000', '2025-02-14 15:23:58', '2025-02-14 15:23:58');

-- --------------------------------------------------------

--
-- 資料表結構 `favorites`
--

CREATE TABLE `favorites` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(2, 2, 1, '2025-02-14 07:26:33');

-- --------------------------------------------------------

--
-- 資料表結構 `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `member_id` int(11) NOT NULL COMMENT 'organizer',
  `type` int(11) NOT NULL COMMENT '1:浮潛、2:自由潛水、3:水肺潛水、4:其他',
  `gender` int(11) NOT NULL COMMENT '1、不限性別，2、限男性，3、限女性',
  `groups_city_id` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `signEndDate` datetime NOT NULL,
  `maxNumber` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0 COMMENT '0:揪團中、1:已成團、2:已取消'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `groups`
--

INSERT INTO `groups` (`id`, `name`, `member_id`, `type`, `gender`, `groups_city_id`, `description`, `created_at`, `signEndDate`, `maxNumber`, `date`, `time`, `status`) VALUES
(1, '墾丁浮潛', 3, 1, 1, 1, '嗨，我是小豪，一個超愛潛水但這次缺旅伴的海洋迷！計劃這個月底去墾丁潛水，一起享受陽光、海風，還有那片五彩繽紛的海底世界～\n行程簡單介紹：\n日期： 1/31，成團後也可以再商量！\n地點： 墾丁熱門潛點（像是砂島、龍磐）\n人數： 需要 4 人才能湊團，目前只有我自己（哈哈！）\n期待的旅伴：\n新手或有經驗都沒問題！只要熱愛大海，想探索海底就好～\n性格隨和，喜歡交朋友，行程不會太趕，輕鬆玩！\n我的想法：\n可一起找教練（安全為主！）或自備裝備去輕裝潛。\n行程中還可以順便去墾丁大街吃美食、看日落拍照！\n預算大概每人 NT$ 2,500 左右（包含潛水費用）。\n如果你也有興趣，歡迎加入！', '2025-02-16 14:51:08', '2025-03-31 00:00:00', 3, '2025-04-12', '08:00:00', 0),
(5, '綠島自由潛水探險', 7, 2, 2, 5, '嗨，我想要找幾個朋友一起來挑戰深度並探索綠島海底世界。\n不知道你會不會有興趣？有興趣就快按下加入吧！', '2025-02-19 14:51:08', '2025-04-10 00:00:00', 6, '2025-04-18', '07:30:00', 0),
(6, '北海岸浮潛之旅', 5, 1, 1, 3, '一起來探索北海岸的壯麗海景與繽紛珊瑚礁吧！\n我們將揪團前往這片美麗的海域，體驗浮潛或潛水，近距離欣賞色彩斑斕的珊瑚和悠游的熱帶魚。\n如果你喜歡拍美照，這裡的海岸線、奇岩怪石和無敵海景絕對讓你收穫滿滿！\n不論你是新手還是老手，都能在專業教練的帶領下安心享受海洋的魅力。快來加入我們，一起感受陽光、海風，留下美好回憶吧！', '2025-02-02 08:36:24', '2025-03-15 00:00:00', 10, '2025-03-20', '08:00:00', 0);

-- --------------------------------------------------------

--
-- 資料表結構 `groups_image`
--

CREATE TABLE `groups_image` (
  `id` int(11) NOT NULL,
  `groups_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imgURL` varchar(20) NOT NULL,
  `isMain` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `groups_image`
--

INSERT INTO `groups_image` (`id`, `groups_id`, `name`, `imgURL`, `isMain`) VALUES
(1, 1, '墾丁浮潛', '墾丁浮潛推薦.jpg', 1),
(2, 5, '綠島自由潛水探險', '下載.jpg', 1),
(3, 6, '北海岸浮潛之旅', 'images.jpg', 1);

-- --------------------------------------------------------

--
-- 資料表結構 `groups_​​participants`
--

CREATE TABLE `groups_​​participants` (
  `id` int(11) NOT NULL,
  `groups_id` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','shipped','delivered','canceled') NOT NULL DEFAULT 'pending',
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_price`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 6300.00, 'paid', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, 2, 7500.00, 'pending', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(3, 2, 7500.00, 'pending', '2025-02-16 18:11:43', '2025-02-16 18:11:43');

-- --------------------------------------------------------

--
-- 資料表結構 `order_activity_items`
--

CREATE TABLE `order_activity_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `activity_project_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `order_activity_travelers`
--

CREATE TABLE `order_activity_travelers` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_activity_id` int(10) UNSIGNED NOT NULL,
  `is_representative` tinyint(1) NOT NULL DEFAULT 0,
  `traveler_cn_name` varchar(255) NOT NULL,
  `traveler_en_name` varchar(255) NOT NULL,
  `traveler_id_number` varchar(50) NOT NULL,
  `traveler_phone` varchar(50) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `bundle_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `variant_id`, `quantity`, `price`, `createdAt`, `bundle_id`) VALUES
(1, 1, 1, 1, 4500.00, '2025-02-14 15:23:58', NULL),
(2, 1, 2, 1, 1800.00, '2025-02-14 15:23:58', NULL),
(3, 2, 3, 1, 7500.00, '2025-02-14 15:23:58', NULL),
(4, 3, 3, 1, 7500.00, '2025-02-16 18:11:43', NULL);

-- --------------------------------------------------------

--
-- 資料表結構 `order_rental_items`
--

CREATE TABLE `order_rental_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `rental_id` int(10) UNSIGNED NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price_per_day` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `deposit` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `brand_id` int(10) UNSIGNED DEFAULT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `brand_id`, `category_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Scubapro 防寒衣', '高品質潛水防寒衣', 1, 2, '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, 'Mares 面鏡', '寬視角高透光潛水面鏡', 2, 1, '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(3, 'Aqualung 調節器', '可靠的潛水調節器', 3, 3, '2025-02-14 15:23:58', '2025-02-14 15:23:58');

-- --------------------------------------------------------

--
-- 資料表結構 `product_accessories`
--

CREATE TABLE `product_accessories` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `accessory_product_id` int(10) UNSIGNED NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_bundle`
--

CREATE TABLE `product_bundle` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_bundle_items`
--

CREATE TABLE `product_bundle_items` (
  `id` int(10) UNSIGNED NOT NULL,
  `bundle_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `variant_required` tinyint(1) DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_details`
--

CREATE TABLE `product_details` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `sort_order` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `product_images`
--

CREATE TABLE `product_images` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `variant_id` int(10) UNSIGNED DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `image_type` enum('main','detail') NOT NULL DEFAULT 'main',
  `description` text DEFAULT NULL,
  `is_main` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `variant_id`, `image_url`, `image_type`, `description`, `is_main`, `sort_order`, `createdAt`, `updatedAt`) VALUES
(1, 2, 2, 'product_23_1732963039_0.jpg', 'main', NULL, 1, 0, '2025-02-16 14:39:30', '2025-02-16 15:01:59'),
(2, 2, 4, 'product_26_1733125376_1.jpg', 'main', NULL, 0, 0, '2025-02-16 14:58:34', '2025-02-16 15:19:12');

-- --------------------------------------------------------

--
-- 資料表結構 `product_variant`
--

CREATE TABLE `product_variant` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `color_id` int(10) UNSIGNED NOT NULL,
  `size_id` int(10) UNSIGNED NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `original_price` decimal(10,2) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  `deletedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `product_variant`
--

INSERT INTO `product_variant` (`id`, `product_id`, `color_id`, `size_id`, `stock`, `original_price`, `price`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 3, 10, 5000.00, 4500.00, 0, NULL, '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, 2, 2, 1, 15, 2000.00, 1800.00, 0, NULL, '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(3, 3, 3, 2, 8, 8000.00, 7500.00, 0, NULL, '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(4, 2, 2, 2, 100, 5000.00, 3000.00, 0, NULL, '2025-02-14 15:44:11', '2025-02-14 15:44:11');

-- --------------------------------------------------------

--
-- 資料表結構 `rent_brand`
--

CREATE TABLE `rent_brand` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `imgUrl` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `rent_category_big`
--

CREATE TABLE `rent_category_big` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `rent_category_small`
--

CREATE TABLE `rent_category_small` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `rent_category_big_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `rent_color`
--

CREATE TABLE `rent_color` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rgb` varchar(20) NOT NULL COMMENT '色碼'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `rent_color`
--

INSERT INTO `rent_color` (`id`, `name`, `rgb`) VALUES
(1, NULL, '#000000');

-- --------------------------------------------------------

--
-- 資料表結構 `rent_image`
--

CREATE TABLE `rent_image` (
  `id` int(10) UNSIGNED NOT NULL,
  `rent_item_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `img_url` varchar(255) NOT NULL,
  `is_main` tinyint(1) NOT NULL COMMENT '是否為主要展示圖片',
  `is_deleted` tinyint(1) NOT NULL COMMENT '0: 未刪除, 1: 已刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `rent_item`
--

CREATE TABLE `rent_item` (
  `id` int(10) UNSIGNED NOT NULL,
  `rent_category_small_id` int(11) NOT NULL COMMENT '關聯小分類表',
  `name` varchar(255) NOT NULL COMMENT '產品名稱',
  `price` decimal(10,0) NOT NULL COMMENT '原價',
  `price2` decimal(10,0) DEFAULT NULL COMMENT '特價',
  `description` varchar(255) DEFAULT NULL COMMENT '上方簡單描述',
  `description2` varchar(255) DEFAULT NULL COMMENT '下方詳細描述',
  `stock` int(10) UNSIGNED DEFAULT NULL COMMENT '庫存量',
  `created_at` datetime NOT NULL COMMENT '創建時間',
  `update_at` datetime DEFAULT NULL COMMENT '最後更新時間',
  `deposit` decimal(10,0) DEFAULT NULL COMMENT '押金',
  `is_like` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0:未收藏;1:已收藏',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: 未刪除, 1: 已刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `rent_item`
--

INSERT INTO `rent_item` (`id`, `rent_category_small_id`, `name`, `price`, `price2`, `description`, `description2`, `stock`, `created_at`, `update_at`, `deposit`, `is_like`, `is_deleted`) VALUES
(1, 1, '購物車測試', 3000, 5000, NULL, NULL, NULL, '2025-02-18 03:13:53', NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- 資料表結構 `rent_material`
--

CREATE TABLE `rent_material` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `rent_size`
--

CREATE TABLE `rent_size` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `rent_specification`
--

CREATE TABLE `rent_specification` (
  `id` int(11) NOT NULL,
  `rent_item_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `color_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `thickness_id` int(11) DEFAULT NULL,
  `material_id` int(11) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0:未刪除;1:已刪除'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `product_id` int(10) UNSIGNED NOT NULL,
  `order_id` int(10) UNSIGNED NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `product_id`, `order_id`, `rating`, `comment`, `createdAt`) VALUES
(1, 1, 1, 1, 5, '這件防寒衣超棒！很保暖也很舒適！', '2025-02-14 15:29:20');

-- --------------------------------------------------------

--
-- 資料表結構 `size`
--

CREATE TABLE `size` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `size`
--

INSERT INTO `size` (`id`, `name`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL');

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `createdAt`, `updatedAt`) VALUES
(1, 'Jimmy', 'jimmy@example.com', 'hashed_password_123', '2025-02-14 15:23:58', '2025-02-14 15:23:58'),
(2, 'Alice', 'alice@example.com', 'hashed_password_456', '2025-02-14 15:23:58', '2025-02-14 15:23:58');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `activity_city`
--
ALTER TABLE `activity_city`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `activity_country`
--
ALTER TABLE `activity_country`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `activity_image`
--
ALTER TABLE `activity_image`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `activity_project`
--
ALTER TABLE `activity_project`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `cart_activity_items`
--
ALTER TABLE `cart_activity_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`);

--
-- 資料表索引 `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `varient_id` (`variant_id`),
  ADD KEY `fk_cart_items_bundle` (`bundle_id`);

--
-- 資料表索引 `cart_rental_items`
--
ALTER TABLE `cart_rental_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`);

--
-- 資料表索引 `category_big`
--
ALTER TABLE `category_big`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `category_small`
--
ALTER TABLE `category_small`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_big_id` (`category_big_id`);

--
-- 資料表索引 `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `groups_image`
--
ALTER TABLE `groups_image`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `groups_​​participants`
--
ALTER TABLE `groups_​​participants`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `order_activity_items`
--
ALTER TABLE `order_activity_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- 資料表索引 `order_activity_travelers`
--
ALTER TABLE `order_activity_travelers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_activity_id` (`order_activity_id`);

--
-- 資料表索引 `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `varient_id` (`variant_id`),
  ADD KEY `fk_order_items_bundle` (`bundle_id`);

--
-- 資料表索引 `order_rental_items`
--
ALTER TABLE `order_rental_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `category_id` (`category_id`);

--
-- 資料表索引 `product_accessories`
--
ALTER TABLE `product_accessories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `accessory_product_id` (`accessory_product_id`);

--
-- 資料表索引 `product_bundle`
--
ALTER TABLE `product_bundle`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `product_bundle_items`
--
ALTER TABLE `product_bundle_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bundle_id` (`bundle_id`),
  ADD KEY `product_id` (`product_id`);

--
-- 資料表索引 `product_details`
--
ALTER TABLE `product_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- 資料表索引 `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `varient_id` (`variant_id`);

--
-- 資料表索引 `product_variant`
--
ALTER TABLE `product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `size_id` (`size_id`);

--
-- 資料表索引 `rent_color`
--
ALTER TABLE `rent_color`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`user_id`,`product_id`,`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- 資料表索引 `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `activity_city`
--
ALTER TABLE `activity_city`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `activity_country`
--
ALTER TABLE `activity_country`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `activity_image`
--
ALTER TABLE `activity_image`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `activity_project`
--
ALTER TABLE `activity_project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cart_activity_items`
--
ALTER TABLE `cart_activity_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cart_rental_items`
--
ALTER TABLE `cart_rental_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `category_big`
--
ALTER TABLE `category_big`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `category_small`
--
ALTER TABLE `category_small`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `color`
--
ALTER TABLE `color`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `groups_image`
--
ALTER TABLE `groups_image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `groups_​​participants`
--
ALTER TABLE `groups_​​participants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_activity_items`
--
ALTER TABLE `order_activity_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_activity_travelers`
--
ALTER TABLE `order_activity_travelers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_rental_items`
--
ALTER TABLE `order_rental_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_accessories`
--
ALTER TABLE `product_accessories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_bundle`
--
ALTER TABLE `product_bundle`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_bundle_items`
--
ALTER TABLE `product_bundle_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_details`
--
ALTER TABLE `product_details`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product_variant`
--
ALTER TABLE `product_variant`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `rent_color`
--
ALTER TABLE `rent_color`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `size`
--
ALTER TABLE `size`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `cart_activity_items`
--
ALTER TABLE `cart_activity_items`
  ADD CONSTRAINT `cart_activity_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variant` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_items_bundle` FOREIGN KEY (`bundle_id`) REFERENCES `product_bundle` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `cart_rental_items`
--
ALTER TABLE `cart_rental_items`
  ADD CONSTRAINT `cart_rental_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `category_small`
--
ALTER TABLE `category_small`
  ADD CONSTRAINT `category_small_ibfk_1` FOREIGN KEY (`category_big_id`) REFERENCES `category_big` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `order_activity_items`
--
ALTER TABLE `order_activity_items`
  ADD CONSTRAINT `order_activity_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `order_activity_travelers`
--
ALTER TABLE `order_activity_travelers`
  ADD CONSTRAINT `order_activity_travelers_ibfk_1` FOREIGN KEY (`order_activity_id`) REFERENCES `order_activity_items` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_bundle` FOREIGN KEY (`bundle_id`) REFERENCES `product_bundle` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variant` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `order_rental_items`
--
ALTER TABLE `order_rental_items`
  ADD CONSTRAINT `order_rental_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category_small` (`id`) ON DELETE SET NULL;

--
-- 資料表的限制式 `product_accessories`
--
ALTER TABLE `product_accessories`
  ADD CONSTRAINT `product_accessories_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_accessories_ibfk_2` FOREIGN KEY (`accessory_product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `product_bundle_items`
--
ALTER TABLE `product_bundle_items`
  ADD CONSTRAINT `product_bundle_items_ibfk_1` FOREIGN KEY (`bundle_id`) REFERENCES `product_bundle` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_bundle_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `product_details`
--
ALTER TABLE `product_details`
  ADD CONSTRAINT `product_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variant` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `product_variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_variant_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_variant_ibfk_3` FOREIGN KEY (`size_id`) REFERENCES `size` (`id`) ON DELETE CASCADE;

--
-- 資料表的限制式 `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
