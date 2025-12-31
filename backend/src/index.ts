import "./config/env.js";
import express, { type Express } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import authRoutes from "./auth/route.js";
import receiptRoutes from "./receipt/route.js";

const app: Express = express();
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
}));
app.use(express.json());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/receipt", receiptRoutes);

const port = process.env.PORT;
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${port}`);
});
