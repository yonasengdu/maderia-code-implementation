/*
  Warnings:

  - You are about to alter the column `occupancyExpiryTime` on the `Reservation` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoomType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "reservationLifetime" INTEGER NOT NULL,
    "totalNumber" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    CONSTRAINT "RoomType_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RoomType" ("description", "hotelId", "id", "name", "price", "reservationLifetime", "totalNumber") SELECT "description", "hotelId", "id", "name", "price", "reservationLifetime", "totalNumber" FROM "RoomType";
DROP TABLE "RoomType";
ALTER TABLE "new_RoomType" RENAME TO "RoomType";
CREATE UNIQUE INDEX "RoomType_name_key" ON "RoomType"("name");
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
    CONSTRAINT "Reservation_roomTypeId_fkey" FOREIGN KEY ("roomTypeId") REFERENCES "RoomType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("expiryTime", "id", "lifetime", "occupancy", "occupancyExpiryTime", "occupancyLifetime", "roomTypeId", "startTime", "userId") SELECT "expiryTime", "id", "lifetime", "occupancy", "occupancyExpiryTime", "occupancyLifetime", "roomTypeId", "startTime", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
