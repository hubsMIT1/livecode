/*
  Warnings:

  - You are about to drop the column `image_url` on the `question_images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `questions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `sheets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `topics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_type` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "image_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "question_images" DROP COLUMN "image_url";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "average_time_to_solve" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "questions_title_key" ON "questions"("title");

-- CreateIndex
CREATE UNIQUE INDEX "sheets_title_key" ON "sheets"("title");

-- CreateIndex
CREATE UNIQUE INDEX "topics_title_key" ON "topics"("title");
