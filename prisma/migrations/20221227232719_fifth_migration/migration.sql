-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotels" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hotel_name" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL
);
INSERT INTO "new_Hotels" ("email", "hotel_name", "id", "latitude", "longitude", "password_hash", "user_name") SELECT "email", "hotel_name", "id", "latitude", "longitude", "password_hash", "user_name" FROM "Hotels";
DROP TABLE "Hotels";
ALTER TABLE "new_Hotels" RENAME TO "Hotels";
CREATE UNIQUE INDEX "Hotels_hotel_name_key" ON "Hotels"("hotel_name");
CREATE UNIQUE INDEX "Hotels_user_name_key" ON "Hotels"("user_name");
CREATE UNIQUE INDEX "Hotels_email_key" ON "Hotels"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
