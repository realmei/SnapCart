import { Router } from "express";
import { AuthService } from "./auth.service";

const router: Router = Router();

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/"
};

router.post("/register", async(req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await AuthService.register(email, password, name);
    res.status(201).json({ user });
  } catch (err: any) {
    if (err.code === "23505")
      return res.status(409).json({ error: "Email already in use" });
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } =
      await AuthService.login(email, password);

    res.cookie("accessToken", accessToken, {
      ...cookieBase,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieBase,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const oldToken = req.cookies.refreshToken;
    const { user, access, refresh } =
      await AuthService.refresh(oldToken);

    res.cookie("accessToken", access, {
      ...cookieBase,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refresh, {
      ...cookieBase,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ user });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

// router.get("/me", authenticate, async (req, res)=> {
//   const user = await AuthService.me(req.userId!);
//   res.json({ user });
// });

router.post("/logout", async(req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await AuthService.logout(token);

  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });

  res.json({ ok: true });
});

export default router;