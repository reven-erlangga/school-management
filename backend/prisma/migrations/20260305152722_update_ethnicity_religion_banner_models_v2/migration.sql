/*
  Warnings:

  - Added the required column `key` to the `ethnicities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `religions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "image" TEXT NOT NULL,
    "target_url" TEXT,
    "start_date" DATETIME,
    "end_date" DATETIME,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "banner_institutes" (
    "banner_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,

    PRIMARY KEY ("banner_id", "institute_id"),
    CONSTRAINT "banner_institutes_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "banner_institutes_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ethnicities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_ethnicities" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "ethnicities";
DROP TABLE "ethnicities";
ALTER TABLE "new_ethnicities" RENAME TO "ethnicities";
CREATE UNIQUE INDEX "ethnicities_key_key" ON "ethnicities"("key");
CREATE TABLE "new_religions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_religions" ("created_at", "id", "name", "updated_at") SELECT "created_at", "id", "name", "updated_at" FROM "religions";
DROP TABLE "religions";
ALTER TABLE "new_religions" RENAME TO "religions";
CREATE UNIQUE INDEX "religions_key_key" ON "religions"("key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
