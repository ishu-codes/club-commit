import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { anonymous } from "better-auth/plugins";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
// import { customSessionPlugin } from "./config/authPlugins";
import { getUserRole } from "./routes/auth.js";
import { customSession } from "better-auth/plugins";
dotenv.config();

const db = new PrismaClient();

const authConfig: ReturnType<typeof betterAuth> = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8080",
  trustedOrigins: ["http://localhost:3000"],
  secret: process.env.JWT_ACCESS_SECRET || "",

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  //   socialProviders: {
  //     google: {
  //       clientId: process.env.GITHUB_CLIENT_ID || "",
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  //       scopes: ["user:email"],
  //     },
  //   },
  //   plugins: [
  // 	anonymous({
  // 		generateName: async () => generateDemoName()
  // 	})
  //   ]
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

export default authConfig;
