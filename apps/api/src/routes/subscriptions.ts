import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import { asyncHandler } from "../config/handler.js";
import { success, failure } from "../config/response.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

/**
 * POST /api/v1/subscriptions — Create a new subscription (mock payment)
 */
router.post(
    "/",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { plan, charityId, contributionPercent } = req.body;

        if (!plan || !["MONTHLY", "YEARLY"].includes(plan)) {
            return failure(res, 400, "Invalid plan. Must be MONTHLY or YEARLY.");
        }

        // Check for existing active subscription
        const existing = await db.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
        });
        if (existing) {
            return failure(res, 409, "You already have an active subscription.");
        }

        // Validate charity if provided
        if (charityId) {
            const charity = await db.charity.findUnique({ where: { id: charityId } });
            if (!charity || !charity.isActive) {
                return failure(res, 400, "Invalid or inactive charity.");
            }
        }

        const percent = Math.min(Math.max(Number(contributionPercent) || 10, 5), 50);
        const price = plan === "MONTHLY" ? 9.99 : 99.99;
        const startDate = new Date();
        const endDate = new Date(startDate);
        if (plan === "MONTHLY") {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = await db.subscription.create({
            data: {
                userId,
                plan,
                price,
                charityId: charityId || null,
                contributionPercent: percent,
                startDate,
                endDate,
            },
            include: { charity: true },
        });

        return success(res, 201, subscription);
    })
);

/**
 * GET /api/v1/subscriptions/me — Get current user's active subscription
 */
router.get(
    "/me",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;

        const subscription = await db.subscription.findFirst({
            where: { userId, status: "ACTIVE" },
            include: { charity: true },
            orderBy: { createdAt: "desc" },
        });

        return success(res, 200, { subscription });
    })
);

/**
 * GET /api/v1/subscriptions/history — Get all user subscriptions
 */
router.get(
    "/history",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;

        const subscriptions = await db.subscription.findMany({
            where: { userId },
            include: { charity: true },
            orderBy: { createdAt: "desc" },
        });

        return success(res, 200, { subscriptions });
    })
);

/**
 * PATCH /api/v1/subscriptions/:id/cancel — Cancel a subscription
 */
router.patch(
    "/:id/cancel",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { id } = req.params;

        const subscription = await db.subscription.findFirst({
            where: { id, userId, status: "ACTIVE" },
        });

        if (!subscription) {
            return failure(res, 404, "Active subscription not found.");
        }

        const updated = await db.subscription.update({
            where: { id },
            data: { status: "CANCELLED" },
            include: { charity: true },
        });

        return success(res, 200, updated);
    })
);

/**
 * PATCH /api/v1/subscriptions/:id/charity — Update charity selection
 */
router.patch(
    "/:id/charity",
    asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).userId;
        const { id } = req.params;
        const { charityId, contributionPercent } = req.body;

        const subscription = await db.subscription.findFirst({
            where: { id, userId, status: "ACTIVE" },
        });

        if (!subscription) {
            return failure(res, 404, "Active subscription not found.");
        }

        if (charityId) {
            const charity = await db.charity.findUnique({ where: { id: charityId } });
            if (!charity || !charity.isActive) {
                return failure(res, 400, "Invalid or inactive charity.");
            }
        }

        const percent = contributionPercent
            ? Math.min(Math.max(Number(contributionPercent), 5), 50)
            : undefined;

        const updated = await db.subscription.update({
            where: { id },
            data: {
                ...(charityId && { charityId }),
                ...(percent && { contributionPercent: percent }),
            },
            include: { charity: true },
        });

        return success(res, 200, updated);
    })
);

export default router;
