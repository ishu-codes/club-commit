import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import { asyncHandler } from "../config/handler.js";
import { success, failure } from "../config/response.js";

const router = Router();

/**
 * GET /api/v1/winners — List all winners
 */
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response) => {
    const winners = await db.winner.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, profileImage: true } },
        draw: { select: { id: true, month: true, year: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return success(res, 200, { winners });
  }),
);

/**
 * GET /api/v1/winners/me — Get current user's winnings
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;

    const winnings = await db.winner.findMany({
      where: { userId },
      include: {
        draw: { select: { id: true, month: true, year: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalWon = winnings.reduce((sum, w) => sum + w.prizeAmount, 0);
    const pendingPayments = winnings.filter((w) => !w.paidAt).length;

    return success(res, 200, {
      list: winnings,
      totalWon: Math.round(totalWon * 100) / 100,
      pendingPayments,
    });
  }),
);

/**
 * POST /api/v1/winners/:id/proof — Upload proof screenshot URL (winner)
 */
router.post(
  "/:id/proof",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { proofUrl } = req.body;

    if (!proofUrl) return failure(res, 400, "Proof URL is required.");

    const winner = await db.winner.findFirst({
      where: { id, userId },
    });
    if (!winner) return failure(res, 404, "Winner record not found.");

    const updated = await db.winner.update({
      where: { id },
      data: { proofUrl },
    });

    return success(res, 200, updated);
  }),
);

// ── Admin routes ─────────────────────────────────────────────────────────

/**
 * PATCH /api/v1/winners/:id/verify — Approve or reject (admin)
 */
router.patch(
  "/:id/verify",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body; // "APPROVED" or "REJECTED"

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return failure(res, 400, "Status must be APPROVED or REJECTED.");
    }

    const winner = await db.winner.findUnique({ where: { id } });
    if (!winner) return failure(res, 404, "Winner not found.");

    const updated = await db.winner.update({
      where: { id },
      data: { verificationStatus: status },
    });

    return success(res, 200, updated);
  }),
);

/**
 * PATCH /api/v1/winners/:id/pay — Mark as paid (admin)
 */
router.patch(
  "/:id/pay",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const winner = await db.winner.findUnique({ where: { id } });
    if (!winner) return failure(res, 404, "Winner not found.");

    if (winner.verificationStatus !== "APPROVED") {
      return failure(res, 400, "Winner must be approved before marking as paid.");
    }

    const updated = await db.winner.update({
      where: { id },
      data: { paidAt: new Date() },
    });

    return success(res, 200, updated);
  }),
);

export default router;
