const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("DATABASE_URL (seed):", process.env.DATABASE_URL);
  console.log("SEED_ADMIN_EMAIL:", process.env.SEED_ADMIN_EMAIL);
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = process.env.SEED_ADMIN_EMAIL || "admin@local.dev";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin1234";
  const hash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { role: "SUPERADMIN" },
    create: { email, name: "Superadmin", password: hash, role: "SUPERADMIN" },
  });

  console.log("✅ Admin ready:", email);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
