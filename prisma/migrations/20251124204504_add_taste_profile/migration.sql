/*
  Warnings:

  - You are about to drop the column `description` on the `TasteProfile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TasteProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataJson" TEXT NOT NULL,
    CONSTRAINT "TasteProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TasteProfile" ("createdAt", "dataJson", "id", "userId") SELECT "createdAt", "dataJson", "id", "userId" FROM "TasteProfile";
DROP TABLE "TasteProfile";
ALTER TABLE "new_TasteProfile" RENAME TO "TasteProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
