import { PrismaClient } from "@prisma/client";
// import { Pool } from "pg";

// pg.Pool not required, as prisma automatically does pooling
// const pool = new Pool({
//   connectionString:
//     process.env.DATABASE_URL ||
//     "postgresql://quillspace_user:quillspace_password@localhost:5432/quillspace",
// });

export const db = new PrismaClient();
