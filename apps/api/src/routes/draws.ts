import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import { asyncHandler } from "../config/handler.js";
import { success, failure } from "../config/response.js";
import { selectWinner, calculateAverageScore } from "../services/drawEngine.js";

const router = Router();

/**
 * GET /api/v1/draws — List draws (public for completed, all for admin)
 */
router.get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
        const { status } = req.query;

        const where: any = {};
        if (status) where.status = status;

        const draws = await db.draw.findMany({
            where,
            orderBy: [{ year: "desc" }, { month: "desc" }],
            include: {
                _count: { select: { entries: true } },
                winner: { include: { user: { select: { id: true, name: true, email: true } } } },
            },
        });

        return success(res, 200, draws);
    })
);

/**
 * GET /api/v1/draws/:id — Get draw details
 */
router.get(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const draw = await db.draw.findUnique({
            where: { id: req.params.id },
            include: {
                entries: {
                    include: { user: { select: { id: true, name: true, email: true } } },
                    orderBy: { averageScore: "desc" },
                },
                winner: { include: { user: { select: { id: true, name: true, email: true } } } },
            },
        });

        if (!draw) return failure(res, 404, "Draw not found.");
        return success(res, 200, draw);
    })
);

/**
 * POST /api/v1/draws/:id/enter — Enter a draw (requires active subscription + scores)
 */
router.post(
    "/:id/enter",
    requireAuth,
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { id } = req.params;

        // Check draw exists and is OPEN
        const draw = await db.draw.findUnique({ where: { id } });
        if (!draw) return failure(res, 404, "Draw not found.");
        if (draw.status !== "OPEN") return failure(res, 400, "This draw is not accepting entries.");

        // Must have active subscription
        const activeSub = await db.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
        });
        if (!activeSub) return failure(res, 403, "Active subscription required to enter draws.");

        // Check already entered
        const existingEntry = await db.drawEntry.findUnique({
            where: { drawId_userId: { drawId: id, userId } },
        });
        if (existingEntry) return failure(res, 409, "You have already entered this draw.");

        // Need at least 1 score
        const scores = await db.golfScore.findMany({
            where: { userId },
            orderBy: { playedAt: "desc" },
            take: 5,
        });
        if (scores.length === 0) {
            return failure(res, 400, "You need at least one golf score to enter a draw.");
        }

        const averageScore = calculateAverageScore(scores.map((s) => s.score));

        const entry = await db.drawEntry.create({
            data: { drawId: id, userId, averageScore },
        });

        return success(res, 201, entry);
    })
);

// ── Admin routes ─────────────────────────────────────────────────────────

/**
 * POST /api/v1/draws — Create a new draw (admin)
 */
router.post(
    "/",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { month, year, drawType } = req.body;

        const m = Number(month);
        const y = Number(year);
        if (!m || !y || m < 1 || m > 12) {
            return failure(res, 400, "Valid month (1–12) and year are required.");
        }

        // Check uniqueness
        const existing = await db.draw.findUnique({
            where: { month_year: { month: m, year: y } },
        });
        if (existing) return failure(res, 409, "A draw for this month/year already exists.");

        const draw = await db.draw.create({
            data: {
                month: m,
                year: y,
                drawType: drawType === "ALGORITHM" ? "ALGORITHM" : "RANDOM",
                status: "OPEN",
            },
        });

        return success(res, 201, draw);
    })
);

/**
 * POST /api/v1/draws/:id/run — Execute the draw (admin)
 */
router.post(
    "/:id/run",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const draw = await db.draw.findUnique({
            where: { id },
            include: { entries: true },
        });
        if (!draw) return failure(res, 404, "Draw not found.");
        if (draw.status === "COMPLETED") return failure(res, 400, "Draw already completed.");
        if (draw.entries.length === 0) return failure(res, 400, "No entries in this draw.");

        // Calculate prize pool from active subscriptions
        const activeSubscriptions = await db.subscription.findMany({
            where: { status: "ACTIVE" },
            select: { price: true, contributionPercent: true },
        });

        const totalPool =
            activeSubscriptions.reduce((sum, s) => {
                const afterCharity = s.price * (1 - s.contributionPercent / 100);
                return sum + afterCharity * 0.9; // 10% platform fee
            }, 0);

        const prizePool = Math.round(totalPool * 100) / 100;

        // Select winner
        const winnerEntry = selectWinner(draw.entries, draw.drawType);
        if (!winnerEntry) return failure(res, 500, "Failed to select a winner.");

        // Update draw and create winner record in a transaction
        const [updatedDraw, winner] = await db.$transaction([
            db.draw.update({
                where: { id },
                data: {
                    status: "COMPLETED",
                    prizePool,
                    drawnAt: new Date(),
                },
            }),
            db.winner.create({
                data: {
                    drawId: id,
                    userId: winnerEntry.userId,
                    prizeAmount: prizePool,
                },
            }),
        ]);

        // Update charity totals for active subscriptions
        const subsWithCharity = await db.subscription.findMany({
            where: { status: "ACTIVE", charityId: { not: null } },
            select: { charityId: true, price: true, contributionPercent: true },
        });

        for (const sub of subsWithCharity) {
            if (sub.charityId) {
                const contribution = sub.price * (sub.contributionPercent / 100);
                await db.charity.update({
                    where: { id: sub.charityId },
                    data: { totalReceived: { increment: contribution } },
                });
            }
        }

        return success(res, 200, {
            draw: updatedDraw,
            winner: {
                ...winner,
                entry: winnerEntry,
            },
        });
    })
);

/**
 * PATCH /api/v1/draws/:id — Update draw status (admin)
 */
router.patch(
    "/:id",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, drawType } = req.body;

        const draw = await db.draw.findUnique({ where: { id } });
        if (!draw) return failure(res, 404, "Draw not found.");

        const updated = await db.draw.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(drawType && { drawType }),
            },
        });

        return success(res, 200, updated);
    })
);

export default router;
