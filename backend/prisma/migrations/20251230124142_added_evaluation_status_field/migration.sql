/*
  Warnings:

  - Added the required column `evaluationStatus` to the `EmailResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evaluationStatus` to the `EssayResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "EmailResult" ADD COLUMN     "evaluationStatus" "EvaluationStatus" NOT NULL;

-- AlterTable
ALTER TABLE "EssayResult" ADD COLUMN     "evaluationStatus" "EvaluationStatus" NOT NULL;
