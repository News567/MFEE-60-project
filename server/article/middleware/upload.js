import multer from "multer";
import path from "path";

// 設定上傳檔案儲存
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/public/uploads/article/");
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

