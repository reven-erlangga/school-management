/*
  Warnings:

  - You are about to drop the column `institute_id` on the `staffs` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "staff_institutes" (
    "staff_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,

    PRIMARY KEY ("staff_id", "institute_id"),
    CONSTRAINT "staff_institutes_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staffs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "staff_institutes_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "institutes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_staffs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_staffs" ("created_at", "email", "id", "name", "phone", "status", "updated_at") SELECT "created_at", "email", "id", "name", "phone", "status", "updated_at" FROM "staffs";
DROP TABLE "staffs";
ALTER TABLE "new_staffs" RENAME TO "staffs";
CREATE UNIQUE INDEX "staffs_email_key" ON "staffs"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
