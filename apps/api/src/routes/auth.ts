import { db } from "../database/index.js";

export async function getUserRole(userId: string) {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });
}
