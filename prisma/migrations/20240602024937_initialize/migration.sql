/*
  Warnings:

  - You are about to drop the column `tag` on the `tags` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `tags` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "contests" DROP CONSTRAINT "contests_question_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback" DROP CONSTRAINT "feedback_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_question_id_fkey";

-- DropForeignKey
ALTER TABLE "peer_reviewers" DROP CONSTRAINT "peer_reviewers_contest_id_fkey";

-- DropForeignKey
ALTER TABLE "peer_reviewers" DROP CONSTRAINT "peer_reviewers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "points" DROP CONSTRAINT "points_user_id_fkey";

-- DropForeignKey
ALTER TABLE "question_tags" DROP CONSTRAINT "question_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "schedule_topic" DROP CONSTRAINT "schedule_topic_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "sheet_questions" DROP CONSTRAINT "sheet_questions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "sheet_questions" DROP CONSTRAINT "sheet_questions_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "sheet_tags" DROP CONSTRAINT "sheet_tags_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "sheet_tags" DROP CONSTRAINT "sheet_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "solutions" DROP CONSTRAINT "solutions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "solutions" DROP CONSTRAINT "solutions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "topic_questions" DROP CONSTRAINT "topic_questions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "topic_questions" DROP CONSTRAINT "topic_questions_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "topic_tags" DROP CONSTRAINT "topic_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "topic_tags" DROP CONSTRAINT "topic_tags_topic_id_fkey";

-- AlterTable
ALTER TABLE "tags" DROP COLUMN "tag";

-- CreateIndex
CREATE UNIQUE INDEX "tags_title_key" ON "tags"("title");

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_questions" ADD CONSTRAINT "topic_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_questions" ADD CONSTRAINT "topic_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("sheet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("title") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contests" ADD CONSTRAINT "contests_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviewers" ADD CONSTRAINT "peer_reviewers_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviewers" ADD CONSTRAINT "peer_reviewers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_tags" ADD CONSTRAINT "sheet_tags_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("sheet_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_tags" ADD CONSTRAINT "sheet_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_tags" ADD CONSTRAINT "topic_tags_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_tags" ADD CONSTRAINT "topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_topic" ADD CONSTRAINT "schedule_topic_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE CASCADE ON UPDATE CASCADE;
