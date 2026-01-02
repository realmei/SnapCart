import { Router, type Request, type Response } from "express";
import multer from "multer";
import fs from "fs";
import { parseReceipt } from "./service.js";
import { pool } from "../config/db.js";
import { requireAuth, type AuthRequest } from "../auth/middleware.js";

const router: Router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  upload.single("receipt"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const receiptData = await parseReceipt(req.file.path);
      // delete req.file after processing if needed
      await fs.unlinkSync(req.file.path);
      console.log("Parsed receipt:", receiptData);
      res.json(receiptData);
    } catch (err) {
      res.status(500).json({ error: "Failed to parse receipt" });
    }
  }
);

router.post(
  "/save",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const { vendor, total, date, items } = req.body;
    const { userId } = req.user || {};
    try {
      const result = await pool.query(
        `INSERT INTO receipts (user_id, vendor, total, date, items)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [userId, vendor, total, date, JSON.stringify(items)]
      );

      res.json({ receipt: result.rows[0] });
    } catch (err) {
      console.error("Error saving receipt:", err);
      res.status(500).json({ error: "Failed to save receipt" });
    }
  });

router.get("/categories", async (req: Request, res: Response) => {
  try {
    const categories = [
      "Fresh Produce",
      "Dairy",
      "Meat",
      "Seafood",
      "Pantry",
      "Beverages",
      "Snacks",
      "Household Items",
      "Personal Care",
      "Other"
    ];
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
