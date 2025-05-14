import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export const jwtAuthMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.name, error.message);

    let message = "Invalid token";

    if (error.name === "TokenExpiredError") {
      message = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token signature";
    } else if (error.name === "NotBeforeError") {
      message = "Token is not active yet";
    }

    res.status(403).json({ status: false, message });
  }
};
