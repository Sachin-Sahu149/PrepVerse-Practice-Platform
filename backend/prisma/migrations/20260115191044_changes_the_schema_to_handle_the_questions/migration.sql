/*
  Warnings:

  - You are about to drop the column `sessionId` on the `PracticeSessionQuestion` table. All the data in the column will be lost.
  - Added the required column `topicId` to the `PracticeSessionQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PracticeSessionQuestion" DROP CONSTRAINT "PracticeSessionQuestion_sessionId_fkey";

-- AlterTable
ALTER TABLE "PracticeSessionQuestion" DROP COLUMN "sessionId",
ADD COLUMN     "topicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PracticeSessionQuestion" ADD CONSTRAINT "PracticeSessionQuestion_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
