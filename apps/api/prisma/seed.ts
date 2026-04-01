import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      hashedPassword: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });
  // const alice = await prisma.user.create({
  //   data: {
  //     username: "alice",
  //     email: "alice@example.com",
  //     hashedPassword: await bcrypt.hash("alice123", 10),
  //     role: "author",
  //   },
  // });

  const alice = await prisma.user.upsert({
    where: { email: "alice@email.com" },
    update: {},
    create: {
      username: "alice",
      email: "alice@email.com",
      hashedPassword: await bcrypt.hash("alice123", 10),
      role: "author",
      posts: {
        create: [
          {
            title: "Alice's first post",
            content: "Here is my first post",
            slug: "here-is-my-first-post",
            status: "published",
            publishedAt: new Date().toISOString(),
          },
        ],
      },
    },
  });
  console.log({ admin, alice });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
