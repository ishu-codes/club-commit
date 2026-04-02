import type { Request, Response, NextFunction } from "express";

/**
 * Middleware that checks if the authenticated user has the "admin" role.
 * Must be used AFTER requireAuth middleware.
 */
export default function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Forbidden: admin access required" });
  }

  next();
}
