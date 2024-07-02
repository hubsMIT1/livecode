-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "socialLinks" VARCHAR(255)[],
    "about" TEXT,
    "profileImage" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "points" (
    "point_id" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "point_type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "points_pkey" PRIMARY KEY ("point_id")
);

-- CreateTable
CREATE TABLE "topics" (
    "topic_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("topic_id")
);

-- CreateTable
CREATE TABLE "sheets" (
    "sheet_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,

    CONSTRAINT "sheets_pkey" PRIMARY KEY ("sheet_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "question_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty_level" TEXT NOT NULL,
    "average_time_to_solve" INTEGER NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "topic_questions" (
    "topic_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "topic_questions_pkey" PRIMARY KEY ("topic_id","question_id")
);

-- CreateTable
CREATE TABLE "sheet_questions" (
    "sheet_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "sheet_questions_pkey" PRIMARY KEY ("sheet_id","question_id")
);

-- CreateTable
CREATE TABLE "images" (
    "image_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "question_images" (
    "ques_image_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "question_images_pkey" PRIMARY KEY ("ques_image_id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "solution_id" TEXT NOT NULL,
    "solution_text" TEXT NOT NULL,
    "submission_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("solution_id")
);

-- CreateTable
CREATE TABLE "contests" (
    "contest_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "question_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contests_pkey" PRIMARY KEY ("contest_id")
);

-- CreateTable
CREATE TABLE "peer_reviewers" (
    "peer_reviewer_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,
    "time_taken" INTEGER NOT NULL,

    CONSTRAINT "peer_reviewers_pkey" PRIMARY KEY ("peer_reviewer_id")
);

-- CreateTable
CREATE TABLE "feedback" (
    "feedback_id" TEXT NOT NULL,
    "problem_solving_rating" INTEGER NOT NULL,
    "coding_rating" INTEGER NOT NULL,
    "communication_rating" INTEGER NOT NULL,
    "peer_strengths" TEXT NOT NULL,
    "areas_for_improvement" TEXT NOT NULL,
    "interviewer_rating" INTEGER NOT NULL,
    "topic_rating" INTEGER NOT NULL,
    "interviewee" TEXT NOT NULL,
    "contest_id" TEXT NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("feedback_id")
);

-- CreateTable
CREATE TABLE "question_tags" (
    "question_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "question_tags_pkey" PRIMARY KEY ("question_id","tag_id")
);

-- CreateTable
CREATE TABLE "sheet_tags" (
    "sheet_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "sheet_tags_pkey" PRIMARY KEY ("sheet_id","tag_id")
);

-- CreateTable
CREATE TABLE "topic_tags" (
    "topic_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "topic_tags_pkey" PRIMARY KEY ("topic_id","tag_id")
);

-- CreateTable
CREATE TABLE "tags" (
    "tag_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "schedule_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "join_link" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" TEXT NOT NULL,
    "allowed_users" TEXT[],

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_questions" ADD CONSTRAINT "topic_questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_questions" ADD CONSTRAINT "topic_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("sheet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_images" ADD CONSTRAINT "question_images_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_images" ADD CONSTRAINT "question_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("image_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contests" ADD CONSTRAINT "contests_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviewers" ADD CONSTRAINT "peer_reviewers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peer_reviewers" ADD CONSTRAINT "peer_reviewers_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "contests"("contest_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_tags" ADD CONSTRAINT "question_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_tags" ADD CONSTRAINT "sheet_tags_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("sheet_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_tags" ADD CONSTRAINT "sheet_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_tags" ADD CONSTRAINT "topic_tags_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_tags" ADD CONSTRAINT "topic_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("tag_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("topic_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
