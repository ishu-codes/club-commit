import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Charities ──────────────────────────────────────────────────────────
  const charities = await Promise.all([
    db.charity.create({
      data: {
        name: "First Tee",
        description:
          "Building game-changers by providing educational programs that build character, instil life-enhancing values, and promote healthy choices through the game of golf.",
        imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400",
        website: "https://firsttee.org",
      },
    }),
    db.charity.create({
      data: {
        name: "Golf Fights Cancer",
        description:
          "A grassroots charity leveraging the golf community to fund cancer research and raise awareness for early detection and prevention.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
        website: "https://golffightscancer.org",
      },
    }),
    db.charity.create({
      data: {
        name: "The Folds of Honor",
        description:
          "Providing educational scholarships to the spouses and children of America's fallen and disabled service members.",
        imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400",
        website: "https://foldsofhonor.org",
      },
    }),
    db.charity.create({
      data: {
        name: "Ocean Conservancy",
        description:
          "Protecting the ocean from today's greatest global challenges through science-based solutions and advocacy.",
        imageUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400",
        website: "https://oceanconservancy.org",
      },
    }),
    db.charity.create({
      data: {
        name: "Habitat for Humanity",
        description:
          "Helping families build and improve places to call home, providing affordable housing solutions worldwide.",
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
        website: "https://habitat.org",
      },
    }),
    db.charity.create({
      data: {
        name: "Clean Water Fund",
        description: "Working to ensure clean, safe, and affordable drinking water for communities across the globe.",
        imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400",
        website: "https://cleanwaterfund.org",
      },
    }),
  ]);

  console.log(`  ✓ Created ${charities.length} charities`);

  // ── Admin User ─────────────────────────────────────────────────────────
  const adminPassword = await hash("admin123", 10);
  const admin = await db.user.upsert({
    where: { email: "admin@clubcommit.com" },
    update: {},
    create: {
      email: "admin@clubcommit.com",
      name: "Admin",
      role: "ADMIN",
      emailVerified: true,
    },
  });
  console.log(`  ✓ Admin user: admin@clubcommit.com / admin123`);

  // ── Test User ──────────────────────────────────────────────────────────
  const userPassword = await hash("user123", 10);
  const testUser = await db.user.upsert({
    where: { email: "user@clubcommit.com" },
    update: {},
    create: {
      email: "user@clubcommit.com",
      name: "Test User",
      hashedPassword: userPassword,
      role: "user",
      emailVerified: true,
    },
  });
  console.log(`  ✓ Test user: user@clubcommit.com / user123`);

  // ── Sample subscription for test user ──────────────────────────────────
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);

  await db.subscription.create({
    data: {
      userId: testUser.id,
      plan: "MONTHLY",
      status: "ACTIVE",
      price: 9.99,
      charityId: charities[0].id,
      contributionPercent: 10,
      startDate: now,
      endDate,
    },
  });
  console.log("  ✓ Sample subscription created for test user");

  // ── Sample scores for test user ────────────────────────────────────────
  const sampleScores = [36, 32, 38, 34, 40];
  for (let i = 0; i < sampleScores.length; i++) {
    const playedAt = new Date(now);
    playedAt.setDate(playedAt.getDate() - (sampleScores.length - i) * 7);
    await db.golfScore.create({
      data: {
        userId: testUser.id,
        score: sampleScores[i],
        courseName: `Sample Course ${i + 1}`,
        playedAt,
      },
    });
  }
  console.log(`  ✓ Created ${sampleScores.length} sample golf scores`);

  // ── Sample draw ────────────────────────────────────────────────────────
  await db.draw.create({
    data: {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      status: "OPEN",
      drawType: "RANDOM",
      prizePool: 500,
    },
  });
  console.log("  ✓ Sample open draw created");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
