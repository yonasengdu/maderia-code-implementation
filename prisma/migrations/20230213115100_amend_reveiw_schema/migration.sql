/*
  Warnings:

  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Review";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    CONSTRAINT "review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "review_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "hotel_image" TEXT NOT NULL DEFAULT 'hotel-694bfd2d-0672-4953-893e-a4ebd192ae53.png',
    "averageRating" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Hotels" ("email", "hotel_image", "hotel_name", "id", "latitude", "longitude", "password_hash", "user_name") SELECT "email", "hotel_image", "hotel_name", "id", "latitude", "longitude", "password_hash", "user_name" FROM "Hotels";
DROP TABLE "Hotels";
ALTER TABLE "new_Hotels" RENAME TO "Hotels";
CREATE UNIQUE INDEX "Hotels_hotel_name_key" ON "Hotels"("hotel_name");
CREATE UNIQUE INDEX "Hotels_user_name_key" ON "Hotels"("user_name");
CREATE UNIQUE INDEX "Hotels_email_key" ON "Hotels"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
