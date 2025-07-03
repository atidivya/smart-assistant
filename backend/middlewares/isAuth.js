import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    console.log("🚨=================isAuth Logs======================🚨");
    console.log("🧪 Token from cookie:", token);

    if (!token || typeof token !== "string")
      return res.status(400).json({ message: "token not found" });

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verifyToken.userId;

    next();
  } catch (e) {
    console.error("❌ isAuth error:", e.message);
    return res
      .status(500)
      .json({ message: "isAuth Middleware Authentication error" });
  }
};

export default isAuth;
