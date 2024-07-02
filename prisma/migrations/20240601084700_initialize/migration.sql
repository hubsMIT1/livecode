/*
  Warnings:

  - You are about to drop the column `userId` on the `points` table. All the data in the column will be lost.
  - You are about to drop the column `topic_id` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the `question_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `question_id` to the `images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `points` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "points" DROP CONSTRAINT "points_userId_fkey";

-- DropForeignKey
ALTER TABLE "question_images" DROP CONSTRAINT "question_images_image_id_fkey";

-- DropForeignKey
ALTER TABLE "question_images" DROP CONSTRAINT "question_images_question_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "sheet_questions" DROP CONSTRAINT "sheet_questions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "topic_questions" DROP CONSTRAINT "topic_questions_topic_id_fkey";

-- AlterTable
ALTER TABLE "images" ADD COLUMN     "question_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "points" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "topic_id";

-- DropTable
DROP TABLE "question_images";

-- CreateTable
CREATE TABLE "schedule_topic" (
    "topic_id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,

    CONSTRAINT "schedule_topic_pkey" PRIMARY KEY ("topic_id","schedule_id")
);

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_questions" ADD CONSTRAINT "topic_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("title") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_topic" ADD CONSTRAINT "schedule_topic_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("schedule_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_topic" ADD CONSTRAINT "schedule_topic_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("title") ON DELETE RESTRICT ON UPDATE CASCADE;
