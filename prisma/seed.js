const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Ensure only one AppConfig exists
  const existing = await prisma.appConfig.findFirst();

  if (!existing) {
    await prisma.appConfig.create({
      data: {
        trustedDomains: "reuters.com,apnews.com,bbc.com,thehindu.com,indianexpress.com",
        blockedDomains: "",
        likelyTrueThreshold: 0.72,
        misleadingThreshold: 0.42,
        autoSaveArticles: true,
      },
    });

    console.log("✅ AppConfig created");
  } else {
    console.log("ℹ️ AppConfig already exists, skipping");
  }

  console.log("🎉 Seed complete");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });