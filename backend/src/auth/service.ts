import bcrypt from "bcryptjs";
import crypto from "crypto";
import { pool } from "../config/db.js";
import {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  deleteRefreshTokenByHash,
  verifyAccessToken,
  verifyRefreshToken,
} from "./token.js";

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
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new Error("Invalid credentials");
    }
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
    const payload = verifyRefreshToken(oldToken);
    const hash = crypto.createHash("sha256").update(oldToken).digest("hex");
    const lookup = await pool.query(
      `SELECT user_id FROM refresh_tokens WHERE token_hash=$1`,
      [hash]
    );
    if (lookup.rowCount === 0) {
      throw new Error("Not found");
    }
    // Validate that DB says this token belongs to this user
    const dbUserId = lookup.rows[0].user_id;
    const tokenUserId = payload?.id;
    if (dbUserId !== tokenUserId) {
      await pool.query(
        `DELETE FROM refresh_tokens WHERE user_id = $1`,
        [dbUserId]
      );
      throw new Error("Refresh token reuse detected");
    }
    // delete the old refresh token row
    await deleteRefreshTokenByHash(hash);
    // generate new tokens
    const newRefresh = signRefreshToken(dbUserId);
    const newAccess  = signAccessToken(dbUserId);
    await saveRefreshToken(dbUserId, newRefresh);
    const userRes = await pool.query(
      `SELECT id, email, name FROM users WHERE id=$1`,
      [dbUserId]
    );
    return {
      user: userRes.rows[0],
      accessToken: newAccess,
      refreshToken: newRefresh,
    };
  }

  static async checkSession(token: string) {
    const payload = verifyAccessToken(token);
    const userResult = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [payload.id]);
    const user = userResult.rows[0];
    return user;
  }

  static async logout(token: string) {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    await deleteRefreshTokenByHash(hash);
  }
}
