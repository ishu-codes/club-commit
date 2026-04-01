import type { Request, Response, NextFunction } from "express";
import authConfig from "../auth";
// import { db } from "../../database";

export default async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await authConfig.api.getSession({ headers: req.headers });

    // Attach to request object for later use
    (req as any).user = session?.user || null;
    (req as any).session = session?.session || null;
    (req as any).userId = session?.user?.id || "";

    if (!session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
