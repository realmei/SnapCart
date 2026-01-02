import jwt, { type Secret } from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../config/db.js";

export function signAccessToken(userId: number) {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXP),
  });
}

export function signRefreshToken(userId: number) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: Number(process.env.REFRESH_TOKEN_EXP),
  });
}

export async function saveRefreshToken(userId: number, token: string) {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, now() + interval '7 days')`,
    [userId, hash]
  );
}

export async function deleteRefreshTokenByHash(hash: string) {
  await pool.query(`DELETE FROM refresh_tokens WHERE token_hash=$1`, [hash]);
}

export interface JwtPayload {
  id: number;
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as Secret
  ) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as Secret
  ) as JwtPayload;
}
