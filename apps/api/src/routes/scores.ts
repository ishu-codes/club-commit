import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import { asyncHandler } from "../config/handler.js";
import { success, failure } from "../config/response.js";

const router = Router();

router.use(requireAuth);

/**
 * POST /api/v1/scores — Submit a new golf score
 */
router.post(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { score, courseName, playedAt } = req.body;

        // Validate Stableford score (0–50 reasonable range)
        const numScore = Number(score);
        if (isNaN(numScore) || numScore < 0 || numScore > 50) {
            return failure(res, 400, "Invalid score. Stableford scores must be between 0 and 50.");
        }

        // Must have active subscription
        const activeSub = await db.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
        });
        if (!activeSub) {
            return failure(res, 403, "Active subscription required to submit scores.");
        }

        const newScore = await db.golfScore.create({
            data: {
                userId,
                score: numScore,
                courseName: courseName || null,
                playedAt: playedAt ? new Date(playedAt) : new Date(),
            },
        });

        return success(res, 201, newScore);
    })
);

/**
 * GET /api/v1/scores/me — Get user's scores (latest 5 active + full history)
 */
router.get(
    "/me",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;

        const allScores = await db.golfScore.findMany({
            where: { userId },
            orderBy: { playedAt: "desc" },
        });

        const activeScores = allScores.slice(0, 5);
        const average =
            activeScores.length > 0
                ? Math.round(
                    (activeScores.reduce((sum, s) => sum + s.score, 0) / activeScores.length) * 100
                ) / 100
                : 0;

        return success(res, 200, {
            activeScores,
            allScores,
            average,
            totalScores: allScores.length,
        });
    })
);

/**
 * PATCH /api/v1/scores/:id — Edit a score
 */
router.patch(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { score, courseName, playedAt } = req.body;

        const existing = await db.golfScore.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return failure(res, 404, "Score not found.");
        }

        const numScore = score !== undefined ? Number(score) : undefined;
        if (numScore !== undefined && (isNaN(numScore) || numScore < 0 || numScore > 50)) {
            return failure(res, 400, "Invalid score. Must be between 0 and 50.");
        }

        const updated = await db.golfScore.update({
            where: { id },
            data: {
                ...(numScore !== undefined && { score: numScore }),
                ...(courseName !== undefined && { courseName }),
                ...(playedAt && { playedAt: new Date(playedAt) }),
            },
        });

        return success(res, 200, updated);
    })
);

/**
 * DELETE /api/v1/scores/:id — Delete a score
 */
router.delete(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { id } = req.params;

        const existing = await db.golfScore.findFirst({
            where: { id, userId },
        });
        if (!existing) {
            return failure(res, 404, "Score not found.");
        }

        await db.golfScore.delete({ where: { id } });

        return success(res, 200, { message: "Score deleted." });
    })
);

export default router;
