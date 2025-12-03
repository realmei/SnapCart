import { Router } from "express";
import { AuthService } from "./auth.service.js";
// import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const router: Router = Router();

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: Number(process.env.ACCESS_TOKEN_EXP),
};

router.post("/register", async(req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await AuthService.register(email, password, name);
    res.status(201).json({ user });
  } catch (err: any) {
    console.error(err.toString());
    if (err.code === "23505") {
      return res.status(409).json({ msg: "Email already in use" });
    }
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);

    res.cookie("accessToken", accessToken, cookieBase);
    res.cookie("refreshToken", refreshToken, {
      ...cookieBase,
      maxAge: Number(process.env.REFRESH_TOKEN_EXP),
    });

    res.json({ user });
  } catch (err: any) {
    console.error(err.toString());
    res.status(401).json({ msg: "Invalid credentials" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    const { user, accessToken, refreshToken } = await AuthService.refresh(oldToken);

    res.cookie("accessToken", accessToken, cookieBase);
    res.cookie("refreshToken", refreshToken, {
      ...cookieBase,
      maxAge: Number(process.env.REFRESH_TOKEN_EXP),
    });

    res.json({ user });
  } catch (err: any) {
    console.error(err.toString());
    res.status(401).json({ msg: "Invalid token" });
  }
});

router.get("/session", async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ msg: "No token"});
  }
  try {
    const user = await AuthService.checkSession(token);
    if (!user) {
      throw new Error("User not found");
    }
    res.json({ user });
  } catch (err: any) {
    console.error(err.toString());
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ msg: "Expired token", expired: true });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ msg: "Invalid token", expired: true });
    }
    res.status(500).json({ msg: "Server error"});
  }
});

router.post("/logout", async(req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await AuthService.logout(token);

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  res.json({ msg: "logout successfully" });
});

export default router;