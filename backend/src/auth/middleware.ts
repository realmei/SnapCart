import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "./token.js";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
  };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.id };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
}
