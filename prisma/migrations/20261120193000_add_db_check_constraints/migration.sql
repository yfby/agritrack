-- SQLite cannot add a CHECK constraint to an existing table, so rebuild both
-- tables with the constraints and copy the existing rows across.
-- defer_foreign_keys keeps the drop/rename sequence safe inside Prisma's
-- migration transaction (PRAGMA foreign_keys is a no-op in a transaction).
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- An end date, when present, must not be before the start date.
CREATE TABLE "new_Harvest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "crop" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Harvest_endDate_check" CHECK ("endDate" IS NULL OR "endDate" >= "startDate")
);

INSERT INTO "new_Harvest" ("id", "name", "crop", "startDate", "endDate", "status", "notes", "createdAt")
SELECT "id", "name", "crop", "startDate", "endDate", "status", "notes", "createdAt" FROM "Harvest";

DROP TABLE "Harvest";
ALTER TABLE "new_Harvest" RENAME TO "Harvest";

CREATE INDEX "Harvest_createdAt_idx" ON "Harvest"("createdAt");

-- Amounts are stored as integer centavos and must always be positive.
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "harvestId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_amountCents_check" CHECK ("amountCents" > 0),
    CONSTRAINT "Expense_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "Harvest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Expense" ("id", "harvestId", "categoryId", "amountCents", "date", "description", "createdAt")
SELECT "id", "harvestId", "categoryId", "amountCents", "date", "description", "createdAt" FROM "Expense";

DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";

CREATE INDEX "Expense_harvestId_date_idx" ON "Expense"("harvestId", "date");
CREATE INDEX "Expense_categoryId_idx" ON "Expense"("categoryId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
