/*
  Warnings:

  - You are about to drop the column `image` on the `Hotels` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotel_name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "hotel_image" TEXT NOT NULL DEFAULT 'hotel-694bfd2d-0672-4953-893e-a4ebd192ae53.png'
);
INSERT INTO "new_Hotels" ("email", "hotel_name", "id", "latitude", "longitude", "password_hash", "user_name") SELECT "email", "hotel_name", "id", "latitude", "longitude", "password_hash", "user_name" FROM "Hotels";
DROP TABLE "Hotels";
ALTER TABLE "new_Hotels" RENAME TO "Hotels";
CREATE UNIQUE INDEX "Hotels_hotel_name_key" ON "Hotels"("hotel_name");
CREATE UNIQUE INDEX "Hotels_user_name_key" ON "Hotels"("user_name");
CREATE UNIQUE INDEX "Hotels_email_key" ON "Hotels"("email");
CREATE TABLE "new_Users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'default-b92a3903-16e4-49ce-be9d-53ff8c0fd24e.png'
);
INSERT INTO "new_Users" ("email", "full_name", "id", "image", "password_hash", "user_name") SELECT "email", "full_name", "id", coalesce("image", 'default-b92a3903-16e4-49ce-be9d-53ff8c0fd24e.png') AS "image", "password_hash", "user_name" FROM "Users";
DROP TABLE "Users";
ALTER TABLE "new_Users" RENAME TO "Users";
CREATE UNIQUE INDEX "Users_user_name_key" ON "Users"("user_name");
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
