import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
  let token = req.get("Authorization");

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "無驗證資料, 請重新登入",
    });
  }

  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "驗證資料錯誤, 請重新登入",
    });
  }

  token = token.slice(7); // 去掉 "Bearer " 前綴
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "驗證資料失效, 請重新登入",
      });
    }
    req.decoded = decoded; // 使用 `req.decoded`
    next();
  });
};
