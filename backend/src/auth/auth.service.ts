import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../config/db";
import {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  deleteRefreshTokenByHash,
} from "./token";

export class AuthService {
  static async register(email: string, password: string, name: string) {
    const pwHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, created_at)
       VALUES ($1,$2,$3,now())
       RETURNING id,email,name`,
      [email, pwHash, name]
    );

    return result.rows[0];
  }

  static async login(email: string, password: string) {
    const userRes = await pool.query(
      `SELECT id, email, password_hash, name FROM users WHERE email=$1`,
      [email]
    );
    const user = userRes.rows[0];
    if (!user) throw new Error("INVALID");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error("INVALID");

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await saveRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async refresh(oldToken: string) {
    const payload = jwt.verify(oldToken, process.env.JWT_REFRESH_SECRET!) as any;

    const hash = crypto.createHash("sha256").update(oldToken).digest("hex");
    const lookup = await pool.query(
      `SELECT user_id FROM refresh_tokens WHERE token_hash=$1`,
      [hash]
    );

    if (lookup.rowCount === 0) throw new Error("NOT_FOUND");

    const userId = payload.id;

    await deleteRefreshTokenByHash(hash);

    const newRefresh = signRefreshToken(userId);
    const newAccess = signAccessToken(userId);

    await saveRefreshToken(userId, newRefresh);

    const userRes = await pool.query(
      `SELECT id, email, name FROM users WHERE id=$1`,
      [userId]
    );

    return {
      user: userRes.rows[0],
      access: newAccess,
      refresh: newRefresh,
    };
  }

  static async me(userId: number) {
    const userRes = await pool.query(
      `SELECT id, email, name FROM users WHERE id=$1`,
      [userId]
    );

    return userRes.rows[0];
  }

  static async logout(token: string) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await deleteRefreshTokenByHash(hash);
  }
}
