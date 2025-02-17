import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; //Bearer token

  if (!token) {
    return res.status(401).json({ success: false, message: "未授權，請登入" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 把解析出的 `userId` 存到 `req.user` 後續可以從req.user.id拿到
    // 因為decoded是這個middleware的參數 為了讓外部使用 這樣 req.user 變成 req 物件的一部分
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "無效的 Token" });
  }
};
