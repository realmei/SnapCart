import jwt, { type Secret } from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../config/db";

export function signAccessToken(userId: number) {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET as Secret, {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXP)
  });
}

export function signRefreshToken(userId: number) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXP)
  });
}

export async function saveRefreshToken(userId: number, token: string) {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, created_at)
     VALUES ($1, $2, now())`,
    [userId, hash]
  );
}

export async function deleteRefreshTokenByHash(hash: string) {
  await pool.query(`DELETE FROM refresh_tokens WHERE token_hash=$1`, [hash]);
}
