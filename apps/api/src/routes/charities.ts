import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../database/index.js";
import requireAuth from "../middlewares/auth.js";
import requireAdmin from "../middlewares/requireAdmin.js";
import { asyncHandler } from "../config/handler.js";
import { success, failure } from "../config/response.js";

const router = Router();

/**
 * GET /api/v1/charities — List all active charities (public)
 */
router.get(
    "/",
    asyncHandler(async (_req: Request, res: Response) => {
        const charities = await db.charity.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
        });
        return success(res, 200, charities);
    })
);

/**
 * GET /api/v1/charities/:id — Get a charity by ID
 */
router.get(
    "/:id",
    asyncHandler(async (req: Request, res: Response) => {
        const charity = await db.charity.findUnique({
            where: { id: req.params.id },
        });
        if (!charity) return failure(res, 404, "Charity not found.");
        return success(res, 200, charity);
    })
);

// ── Admin routes ─────────────────────────────────────────────────────────

/**
 * POST /api/v1/charities — Create charity (admin)
 */
router.post(
    "/",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { name, description, imageUrl, website } = req.body;

        if (!name || !description) {
            return failure(res, 400, "Name and description are required.");
        }

        const charity = await db.charity.create({
            data: { name, description, imageUrl, website },
        });

        return success(res, 201, charity);
    })
);

/**
 * PATCH /api/v1/charities/:id — Update charity (admin)
 */
router.patch(
    "/:id",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, description, imageUrl, website, isActive } = req.body;

        const existing = await db.charity.findUnique({ where: { id } });
        if (!existing) return failure(res, 404, "Charity not found.");

        const updated = await db.charity.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(imageUrl !== undefined && { imageUrl }),
                ...(website !== undefined && { website }),
                ...(isActive !== undefined && { isActive }),
            },
        });

        return success(res, 200, updated);
    })
);

/**
 * DELETE /api/v1/charities/:id — Delete charity (admin)
 */
router.delete(
    "/:id",
    requireAuth,
    requireAdmin,
    asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        const existing = await db.charity.findUnique({ where: { id } });
        if (!existing) return failure(res, 404, "Charity not found.");

        await db.charity.update({
            where: { id },
            data: { isActive: false },
        });

        return success(res, 200, { message: "Charity deactivated." });
    })
);

export default router;
