/*
  Warnings:

  - A unique constraint covering the columns `[hotel_name]` on the table `Hotels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Hotels_hotel_name_key" ON "Hotels"("hotel_name");
