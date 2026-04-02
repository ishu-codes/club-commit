import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
import { getUserRole } from "./routes/auth.js";
import { customSession } from "better-auth/plugins";
dotenv.config();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

const isProd = process.env.NODE_ENV == "production";

if (!isProd) {
  globalForPrisma.prisma = prisma;
}

const db = new PrismaClient();
let authConfig: ReturnType<typeof betterAuth>;

try {
  const betterAuthUrl = (process.env.BETTER_AUTH_URL || "http://localhost:8080").replace(/\/$/, "");

  authConfig = betterAuth({
    baseURL: betterAuthUrl + "/api/auth",
    trustedOrigins: (process.env.TRUSTED_ORIGINS || "http://localhost:3000").split(",").map((origin) => origin.trim()),

    secret: process.env.JWT_ACCESS_SECRET || "",

    database: prismaAdapter(db, {
      provider: "postgresql",
    }),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },

    session: {
      name: "session-token",
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update every day
      cookieAttributes: {
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        httpOnly: true,
        path: "/",
        domain: "club-commit-production.up.railway.app",
      },
      cookieCache: {
        enabled: true,
        maxAge: 10 * 60, // Cache duration in seconds (10 minutes)
      },
    },
    advanced: {
      cookies: {
        session_token: {
          name: "session-token",
          attributes: {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
          },
        },
      },
      defaultCookieAttributes: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
      },
    },

    plugins: [
      customSession(async ({ user, session }) => {
        const userFound = await getUserRole(user.id);
        return {
          user: {
            ...user,
            role: userFound?.role ?? "USER",
          },
          session,
        };
      }),
    ],
  });
} catch (err) {
  console.error("Better Auth initialization error:", err);
  throw err;
}

export default authConfig;
