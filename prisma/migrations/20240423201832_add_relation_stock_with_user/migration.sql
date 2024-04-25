/*
  Warnings:

  - Added the required column `userId` to the `stockMovements` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_stockMovements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stockMovements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "stockMovements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_stockMovements" ("createdAt", "id", "productId", "quantity", "type") SELECT "createdAt", "id", "productId", "quantity", "type" FROM "stockMovements";
DROP TABLE "stockMovements";
ALTER TABLE "new_stockMovements" RENAME TO "stockMovements";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
