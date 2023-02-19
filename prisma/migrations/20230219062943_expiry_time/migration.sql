/*
  Warnings:

  - Added the required column `expiryTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.

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
    "occupancyExpiryTime" INTEGER,
    "roomTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("id", "lifetime", "occupancy", "occupancyLifetime", "roomTypeId", "startTime", "userId") SELECT "id", "lifetime", "occupancy", "occupancyLifetime", "roomTypeId", "startTime", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
