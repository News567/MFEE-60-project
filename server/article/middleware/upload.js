import multer from "multer";
import path from "path";

// 設定上傳檔案儲存
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/article/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 限制文件格式
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("不支援的檔案類型"), false);
  }
};

export const upload = multer({ storage, fileFilter });

// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // 確保 uploads 目錄存在
// const uploadDir = "server/public/uploads/article/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // 設定 Multer 存儲方式
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir); // 圖片存放位置
//   },
//   filename: (req, file, cb) => {
//     // 取得檔案副檔名
//     const ext = path.extname(file.originalname).toLowerCase();
//     // 生成唯一檔名 (時間戳 + 隨機字串)
//     const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
//     cb(null, uniqueName);
//   },
// });

// // 限制文件類型
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("只允許上傳 JPG、JPEG、PNG、WEBP 格式的圖片"));
//   }
// };

// // 設定 Multer
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 限制 5MB
// });

// // 圖片上傳中間件
// export const uploadArticleImage = upload.single("coverImage");
