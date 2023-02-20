-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "authorId" INTEGER NOT NULL,
    "hotelId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "review_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_review" ("authorId", "hotelId", "id", "rating", "text") SELECT "authorId", "hotelId", "id", "rating", "text" FROM "review";
DROP TABLE "review";
ALTER TABLE "new_review" RENAME TO "review";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
