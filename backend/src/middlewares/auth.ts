import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export default async function auth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // ✅ Attach user info safely
    (req as any).user = user;
    (req as any).userId = user._id;
    (req as any).role = user.role;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
