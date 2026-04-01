import express from "express";
import type { Request, Response, NextFunction } from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

import authConfig from "./auth.js";
import { failure, success } from "./config/response.js";

// import feedRouter from "./feed";

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
        // allow all origins if not specified
        // allow requests like direct browser visits (no Origin header)
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return failure(res, 500, `Internal Server Error: ${err}`);
});

// Middlewares
// app.use(requireAuth);
app.all("/api/auth/*splat", toNodeHandler(authConfig));

// Routes
app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});
// app.use("/api/v1/feed", feedRouter);

export default app;
