import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  { name: "Seeds", color: "#16a34a" },
  { name: "Fertilizer", color: "#2563eb" },
  { name: "Pesticide/Herbicide", color: "#dc2626" },
  { name: "Labor", color: "#d97706" },
  { name: "Fuel", color: "#7c3aed" },
  { name: "Equipment & Repairs", color: "#475569" },
  { name: "Irrigation", color: "#0891b2" },
  { name: "Transport", color: "#db2777" },
  { name: "Other", color: "#6b7280" },
];

async function main() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log(`Seeded ${defaultCategories.length} default categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
