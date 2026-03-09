/*
  Warnings:

  - Added the required column `key` to the `genders` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_genders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_genders" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "genders";
DROP TABLE "genders";
ALTER TABLE "new_genders" RENAME TO "genders";
CREATE UNIQUE INDEX "genders_key_key" ON "genders"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
