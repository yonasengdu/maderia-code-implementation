/*
  Warnings:

  - Added the required column `hotelId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME NOT NULL,
    "lifetime" INTEGER NOT NULL,
    "expiryTime" DATETIME NOT NULL,
    "occupancy" BOOLEAN NOT NULL,
    "occupancyLifetime" INTEGER,
    "occupancyExpiryTime" DATETIME,
    "roomTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("expiryTime", "id", "lifetime", "occupancy", "occupancyExpiryTime", "occupancyLifetime", "roomTypeId", "startTime", "userId") SELECT "expiryTime", "id", "lifetime", "occupancy", "occupancyExpiryTime", "occupancyLifetime", "roomTypeId", "startTime", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
