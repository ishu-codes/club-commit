import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import { asyncHandler } from "../config/handler.js";
import { success, failure } from "../config/response.js";

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

/**
 * GET /api/v1/admin/stats — Dashboard analytics
 */
router.get(
    "/stats",
    asyncHandler(async (_req: Request, res: Response) => {
        const [
            totalUsers,
            activeSubscriptions,
            totalCharities,
            totalDraws,
            completedDraws,
        ] = await Promise.all([
            db.user.count({ where: { role: "user" } }),
            db.subscription.count({ where: { status: "ACTIVE" } }),
            db.charity.count({ where: { isActive: true } }),
            db.draw.count(),
            db.draw.count({ where: { status: "COMPLETED" } }),
        ]);

        const activeSubs = await db.subscription.findMany({
            where: { status: "ACTIVE" },
            select: { price: true, contributionPercent: true },
        });

        const totalRevenue = activeSubs.reduce((sum, s) => sum + s.price, 0);
        const totalCharityContributions = activeSubs.reduce(
            (sum, s) => sum + s.price * (s.contributionPercent / 100),
            0
        );

        const totalPrizesPaid = await db.winner.aggregate({
            where: { paidAt: { not: null } },
            _sum: { prizeAmount: true },
        });

        const charitiesBreakdown = await db.charity.findMany({
            where: { isActive: true },
            select: { id: true, name: true, totalReceived: true },
            orderBy: { totalReceived: "desc" },
        });

        return success(res, 200, {
            users: {
                total: totalUsers,
                activeSubscriptions: activeSubscriptions,
            },
            subscriptions: {
                totalRevenue: Math.round(totalRevenue * 100) / 100,
            },
            charity: {
                totalDonated: Math.round(totalCharityContributions * 100) / 100,
            },
            draws: {
                upcoming: totalDraws - completedDraws,
                totalEntries: 0, // Placeholder or compute if needed
            },
            winners: {
                totalPaid: totalPrizesPaid._sum.prizeAmount || 0,
                pendingPayouts: 0, // Placeholder
            },
            charitiesBreakdown,
        });
    })
);

/**
 * GET /api/v1/admin/users — List all users with subscriptions
 */
router.get(
    "/users",
    asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            db.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    subscriptions: {
                        where: { status: "ACTIVE" },
                        take: 1,
                        select: { id: true, plan: true, status: true, endDate: true },
                    },
                    _count: { select: { golfScores: true, winners: true } },
                },
            }),
            db.user.count(),
        ]);

        return success(res, 200, {
            users,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    })
);

/**
 * GET /api/v1/admin/users/:id — Get user detail
 */
router.get(
    "/users/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const user = await db.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                subscriptions: {
                    orderBy: { createdAt: "desc" },
                    include: { charity: true },
                },
                golfScores: {
                    orderBy: { playedAt: "desc" },
                    take: 10,
                },
                winners: {
                    include: { draw: { select: { month: true, year: true } } },
                },
            },
        });

        if (!user) return failure(res, 404, "User not found.");
        return success(res, 200, user);
    })
);

/**
 * PATCH /api/v1/admin/users/:id — Edit user (admin)
 */
router.patch(
    "/users/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, role, email } = req.body;

        const user = await db.user.findUnique({ where: { id } });
        if (!user) return failure(res, 404, "User not found.");

        const updated = await db.user.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(role !== undefined && { role }),
                ...(email !== undefined && { email }),
            },
            select: { id: true, email: true, name: true, role: true },
        });

        return success(res, 200, updated);
    })
);

export default router;
