import express, { json } from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import { checkToken } from "../../middleware/auth.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "../../config/mysql.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const whiteList = ["http://localhost:3301", "http://localhost:3000"];
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("不允許連線"));
    }
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/img/member"); // **這樣會存到伺服器內**
    
    // **確保資料夾存在**
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// **正確初始化 `multer`**
const upload = multer({ 
  storage, 
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("❌ 只允許上傳 JPEG、JPG、PNG、GIF 格式的圖片"));
    }
  }
});


const router = express.Router();
router.use(cors(corsOptions));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 測試 API
router.get("/", (req, res) => {
  res.json({ status: "success", data: null, message: "會員首頁" });
});

// 取得所有使用者
router.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM `users`");
    res.status(200).json({
      status: "success",
      data: rows,
      message: "取得資料成功",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message || "取得資料失敗",
    });
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql =
      "SELECT id, name, email, birthday, gender, phone, address, emergency_contact, emergency_phone, img, level_id FROM `users` WHERE id = ?";
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該使用者" });
    }
    const genderReverseMapping = {
      1: "male",
      2: "female",
      3: "other",
    };
    rows[0].gender = genderReverseMapping[rows[0].gender] || "";

    console.log("後端返回的 user 資料:", rows[0]);

    res.status(200).json({
      status: "success",
      data: rows[0],
      message: "成功獲取使用者資料",
    });
  } catch (err) {
    console.error("獲取使用者失敗:", err);
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});

router.put("/users/:id", checkToken, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) !== req.decoded.id) {
    return res.status(403).json({
      status: "error",
      message: "沒有修改權限",
    });
  }
  const {
    name,
    password,
    phone,
    gender,
    birthday,
    address,
    emergency_contact,
    emergency_phone,
    level_id,
  } = req.body;

  try {
    const updateFields = [];
    const values = [];
    const genderMapping = {
      male: 1,
      female: 2,
      other: 3,
    };
    const genderValue = genderMapping[gender] || 0;

    const fields = [
      { key: "name", value: name },
      { key: "password", value: password, hash: true },
      {
        key: "phone",
        value: phone,
        regex: /^09\d{8}$/,
        errorMsg: "手機號碼格式不正確",
      },
      { key: "gender", value: genderValue },
      { key: "birthday", value: birthday },
      { key: "address", value: address },
      { key: "emergency_contact", value: emergency_contact },
      {
        key: "emergency_phone",
        value: emergency_phone,
        regex: /^09\d{8}$/,
        errorMsg: "手機號碼格式不正確",
      },
      { key: "level_id", value: level_id },
    ];
    for (const field of fields) {
      if (field.value) {
        if (field.regex && !field.regex.test(field.value)) {
          return res.status(400).json({
            status: "error",
            message: field.errorMsg,
          });
        }
        updateFields.push("`" + field.key + "` = ?");
        if (field.hash) {
          const hashed = await bcrypt.hash(field.value, 10);
          values.push(hashed);
        } else {
          values.push(field.value);
        }
      }
    }
    updateFields.push("`updated_at` = NOW()");
    // 若沒有任何欄位需要更新，直接回傳
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "沒有任何欄位需要更新",
      });
    }

    // 最後將 id 加入作為條件
    values.push(id);
    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?;`;
    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("更新失敗");
    }

    res.status(200).json({
      status: "success",
      message: `更新個人資料成功`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err.message || "修改失敗",
    });
  }
});

router.post("/users/register", async (req, res) => {
  const { email, password } = req.body;
  const createAt = new Date();

  if (!email || !password) {
    return res.status(400).json({ message: "請提供Email或密碼" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "請提供有效的 Email" });
  }

  try {
    const checkSql = "SELECT * FROM `users` WHERE email = ?";
    const [existingUser] = await pool.execute(checkSql, [email]);
    console.log(existingUser);
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ status: "exists", message: "Email 已存在" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO `users` (`email`, `password`, `img`, `created_at`) VALUES (?, ?, ?, ?)";
      const imgPath = "/img/default.png";   
    const [result] = await pool.execute(sql, [
      email,
      hashedPassword,
      imgPath,
      createAt,
    ]);

    res
      .status(201)
      .json({ status: "success", message: "註冊成功", userId: result.insertId, img: imgPath });
  } catch (error) {
    console.error("註冊錯誤:", error);
    res.status(500).json({ status: "error", message: "註冊失敗" });
  }
});

router.post("/users/upload", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "❌ 請選擇一張圖片" });
    }

    const imagePath = `/img/member/${req.file.filename}`;
    console.log("📸 上傳成功，圖片路徑:", imagePath);

    const sql = "UPDATE users SET img = ? WHERE id = ?";
    await pool.execute(sql, [imagePath, req.body.userId]);

    res.json({
      status: "success",
      message: "✅ 圖片上傳成功！",
      img: imagePath,
    });
  } catch (err) {
    console.error("❌ 圖片存儲失敗:", err);
    res.status(500).json({ message: "❌ 圖片存儲失敗" });
  }
});



router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "DELETE FROM `users` WHERE id = ?";
    const [result] = await pool.execute(sql, [id]);

    if (result.affectedRows === 0) throw new Error("刪除失敗，找不到該使用者");

    res.status(200).json({
      status: "success",
      message: `成功刪除使用者 ID: ${id}`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err.message || "刪除失敗",
    });
  }
});

router.post("/users/login", upload.none(), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "請提供Email 和密碼" });
  }

  try {
    const sql = "SELECT * FROM `users` WHERE email = ?";
    const [rows] = await pool.execute(sql, [email]);

    if (rows.length == 0) throw new Error("Email 不存在");

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(password, user.password);
    // console.log("輸入密碼:", password);
    // console.log("資料庫密碼:", user.password);
    // console.log("比對結果:", isMatch);
    if (!isMatch) throw new Error("帳號或密碼錯誤");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      status: "success",
      data: { token },
      message: "登入成功",
    });
  } catch (err) {
    console.log("登入錯誤:", err); // 打印錯誤詳細信息
    res.status(400).json({
      status: "error",
      message: err.message ? err.message : "登入失敗",
    });
  }
});

router.post("/users/logout", checkToken, (req, res) => {
  try {
      res.clearCookie("token"); // 清除 token（如果存放於 cookie）
      res.json({
          status: "success",
          message: "登出成功",
      });
  } catch (error) {
      console.error("登出錯誤:", error);
      res.status(500).json({
          status: "error",
          message: "伺服器錯誤，登出失敗",
      });
  }
});


router.post("/users/status", checkToken, (req, res) => {
  const { decoded } = req;
  const token = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email, // 改成這裡
      name: decoded.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
  res.json({
    status: "success",
    data: { token },
    message: "狀態: 登入中",
  });
});

export { upload };
export { checkToken };
export default router;
