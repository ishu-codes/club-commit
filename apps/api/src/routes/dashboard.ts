import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import { asyncHandler } from "../config/handler.js";
import { success } from "../config/response.js";

const router = Router();

router.use(requireAuth);

/**
 * GET /api/v1/dashboard — Aggregated user dashboard data
 *
 * Returns all data needed for the user dashboard in one call:
 *  - subscription status
 *  - latest scores + average
 *  - charity info
 *  - draw participation
 *  - winnings summary
 */
router.get(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;

        // Run all queries in parallel
        const [subscription, scores, drawEntries, winnings, upcomingDraws] = await Promise.all([
            // Active subscription
            db.subscription.findFirst({
                where: { userId, status: "ACTIVE" },
                include: { charity: true },
            }),

            // Golf scores (latest 10, active = first 5)
            db.golfScore.findMany({
                where: { userId },
                orderBy: { playedAt: "desc" },
                take: 10,
            }),

            // Draw entries with draw info
            db.drawEntry.findMany({
                where: { userId },
                include: {
                    draw: {
                        select: {
                            id: true,
                            month: true,
                            year: true,
                            status: true,
                            prizePool: true,
                            drawnAt: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            }),

            // Winnings
            db.winner.findMany({
                where: { userId },
                include: {
                    draw: { select: { month: true, year: true } },
                },
                orderBy: { createdAt: "desc" },
            }),

            // Upcoming / open draws
            db.draw.findMany({
                where: { status: { in: ["OPEN", "PENDING"] } },
                orderBy: [{ year: "asc" }, { month: "asc" }],
                include: {
                    _count: { select: { entries: true } },
                },
            }),
        ]);

        // Calculate score stats
        const activeScores = scores.slice(0, 5);
        const average =
            activeScores.length > 0
                ? Math.round(
                    (activeScores.reduce((sum, s) => sum + s.score, 0) / activeScores.length) * 100
                ) / 100
                : 0;

        const totalWon = winnings.reduce((sum, w) => sum + w.prizeAmount, 0);

        return success(res, 200, {
            subscription,
            scores: {
                active: activeScores,
                recent: scores,
                average,
                total: scores.length,
            },
            draws: {
                entries: drawEntries,
                upcoming: upcomingDraws,
                totalEntered: drawEntries.length,
            },
            winnings: {
                list: winnings,
                totalWon: Math.round(totalWon * 100) / 100,
                pendingPayments: winnings.filter((w) => !w.paidAt).length,
            },
        });
    })
);

export default router;
