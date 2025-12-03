import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  // 🔥 LOG HERE — always runs
  console.log("AUTH HEADER RECEIVED:", req.headers.authorization);

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ No token found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;

    console.log("✅ Token decoded:", decoded);

    next();
  } catch (error) {
    console.log("❌ Invalid token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};
