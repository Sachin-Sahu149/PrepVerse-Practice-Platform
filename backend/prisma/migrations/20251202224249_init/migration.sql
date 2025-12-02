/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('streak', 'achievement', 'performance');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Technical', 'Communication', 'Aptitude');

-- CreateEnum
CREATE TYPE "EmailCategory" AS ENUM ('job_application', 'complaint', 'request', 'campus_email', 'business');

-- CreateEnum
CREATE TYPE "ToneAppropriateness" AS ENUM ('excellent', 'acceptable', 'unprofessional');

-- CreateEnum
CREATE TYPE "EssayCategory" AS ENUM ('technical', 'moral', 'historical', 'abstract', 'business', 'personal_growth', 'others');

-- CreateEnum
CREATE TYPE "GrammarAccuracy" AS ENUM ('excellent', 'good', 'average', 'poor');

-- CreateEnum
CREATE TYPE "Coherence" AS ENUM ('basic', 'good', 'excellent');

-- CreateEnum
CREATE TYPE "Tone" AS ENUM ('professional', 'casual', 'formal', 'very_poor');

-- CreateEnum
CREATE TYPE "PracticeType" AS ENUM ('practice', 'test');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('achievement', 'reminder', 'others');

-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('bug', 'suggestion', 'appreciation');

-- CreateEnum
CREATE TYPE "Period" AS ENUM ('weekly', 'monthly', 'overall');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'Grammar');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userID" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "condition" JSONB NOT NULL,
    "type" "BadgeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT,
    "difficultyDistribution" JSONB NOT NULL,
    "totalQuestion" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailChallenge" (
    "id" SERIAL NOT NULL,
    "category" "EmailCategory" NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "difficultyLevel" "Difficulty" NOT NULL,
    "evaluationKeywords" TEXT[],
    "wordCount" INTEGER NOT NULL,
    "requiredTime" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailResult" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "userEmail" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "grammarAccuracy" "GrammarAccuracy" NOT NULL,
    "keywordCoverage" JSONB NOT NULL,
    "clarityStructureComment" TEXT,
    "toneAppropriateness" "ToneAppropriateness" NOT NULL,
    "aiFeedback" TEXT,
    "timeTaken" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssayQuestion" (
    "id" SERIAL NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "difficultyLevel" "Difficulty" NOT NULL,
    "category" "EssayCategory" NOT NULL,
    "requiredTime" INTEGER NOT NULL,
    "requiredWordCount" INTEGER NOT NULL,
    "essayOutline" JSONB NOT NULL,
    "evaluationCriteriaKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EssayQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssayResult" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userEssay" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "keywordCoverage" JSONB NOT NULL,
    "grammarAccuracy" "GrammarAccuracy" NOT NULL,
    "structureComment" TEXT,
    "coherence" "Coherence" NOT NULL,
    "tone" "Tone" NOT NULL,
    "aiFeedback" TEXT,
    "timeTaken" INTEGER,
    "essayContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EssayResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "topicId" INTEGER NOT NULL,
    "practiceType" "PracticeType" NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "incorrectAnswers" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "totalTimeSpent" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PracticeSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PracticeSessionQuestion" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOption" INTEGER,
    "isCorrect" BOOLEAN NOT NULL,
    "timeSpent" INTEGER NOT NULL,

    CONSTRAINT "PracticeSessionQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "category" "FeedbackCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" SERIAL NOT NULL,
    "period" "Period" NOT NULL,
    "users" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIRecommendation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recommendations" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AIRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "weekRange" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "accuracyRate" DOUBLE PRECISION NOT NULL,
    "totalTimeSpent" INTEGER NOT NULL,
    "topicWiseStats" JSONB NOT NULL,
    "aiInsights" TEXT[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "goals" TEXT[],
    "lastActiveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "type" "QuestionType" NOT NULL,
    "text" TEXT NOT NULL,
    "options" TEXT[],
    "correctOption" INTEGER,
    "explanation" TEXT,
    "difficulty" "Difficulty" NOT NULL,
    "keywords" TEXT[],
    "approvedBy" INTEGER,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "weightage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileBadges" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProfileBadges_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProfileToTopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProfileToTopic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "_ProfileBadges_B_index" ON "_ProfileBadges"("B");

-- CreateIndex
CREATE INDEX "_ProfileToTopic_B_index" ON "_ProfileToTopic"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_userID_key" ON "User"("userID");

-- AddForeignKey
ALTER TABLE "EmailResult" ADD CONSTRAINT "EmailResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailResult" ADD CONSTRAINT "EmailResult_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "EmailChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayResult" ADD CONSTRAINT "EssayResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayResult" ADD CONSTRAINT "EssayResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "EssayQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSession" ADD CONSTRAINT "PracticeSession_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSessionQuestion" ADD CONSTRAINT "PracticeSessionQuestion_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PracticeSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PracticeSessionQuestion" ADD CONSTRAINT "PracticeSessionQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIRecommendation" ADD CONSTRAINT "AIRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressReport" ADD CONSTRAINT "ProgressReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileBadges" ADD CONSTRAINT "_ProfileBadges_A_fkey" FOREIGN KEY ("A") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileBadges" ADD CONSTRAINT "_ProfileBadges_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTopic" ADD CONSTRAINT "_ProfileToTopic_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToTopic" ADD CONSTRAINT "_ProfileToTopic_B_fkey" FOREIGN KEY ("B") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
