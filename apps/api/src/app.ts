import express from "express";
import type { Request, Response, NextFunction } from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

import authConfig from "./auth.js";
import { failure } from "./config/response.js";

// Route imports
import subscriptionRouter from "./routes/subscriptions.js";
import scoreRouter from "./routes/scores.js";
import charityRouter from "./routes/charities.js";
import drawRouter from "./routes/draws.js";
import winnerRouter from "./routes/winners.js";
import adminRouter from "./routes/admin.js";
import dashboardRouter from "./routes/dashboard.js";

const app = express();

// CORS setup
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : undefined;
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!corsOrigins || !origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json({ limit: "5mb" }));

// Auth handler (better-auth)
app.all("/api/auth/*splat", toNodeHandler(authConfig));

// Health check
app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ───────────────────────────────────────────────────────────
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/scores", scoreRouter);
app.use("/api/v1/charities", charityRouter);
app.use("/api/v1/draws", drawRouter);
app.use("/api/v1/winners", winnerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Root
app.get("/", (_: Request, res: Response) => {
  res.json({
    name: "ClubCommit API",
    version: "1.0.0",
    github: "https://github.com/ishu-codes/club-commit",
    author: "Ishu",
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  return failure(res, 500, `Internal Server Error: ${err.message || err}`);
});

export default app;
