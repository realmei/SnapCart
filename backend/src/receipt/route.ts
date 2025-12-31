import { Router, type Request, type Response } from "express";
import multer from "multer";
import { parseReceipt } from "./service.js";
import { pool } from "../config/db.js";

const router: Router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/upload",
  upload.single("receipt"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const data = await parseReceipt(req.file.path);
      const receipt = JSON.parse(data);
      const result = {
        vendor: receipt.vendor,
        total: receipt.total,
        date: receipt.date,
        items: JSON.stringify(receipt.items)
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to parse receipt" });
    }
  }
);

router.post("/save", async (req: Request, res: Response) => {
  const { userId, vendor, total, date, items } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO receipts (user_id, vendor, total, date, items)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [userId, vendor, total, date, JSON.stringify(items)]
    );

    res.json({ receipt: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to save receipt" });
  }
});

export default router;
