// prisma/seed.ts
import { PrismaClient } from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      email: "admin@hotel.com",
      name: "Hotel Administrator",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "reception@hotel.com" },
    update: {},
    create: {
      email: "reception@hotel.com",
      name: "Hotel Receptionist",
      passwordHash: await bcrypt.hash("reception123", 10),
      role: "RECEPTIONIST",
    },
  });

  console.log("✅ Seeding selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
