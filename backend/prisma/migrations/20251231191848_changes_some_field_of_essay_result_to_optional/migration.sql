-- AlterTable
ALTER TABLE "EmailResult" ALTER COLUMN "overallScore" DROP NOT NULL,
ALTER COLUMN "grammarAccuracy" DROP NOT NULL,
ALTER COLUMN "keywordCoverage" DROP NOT NULL,
ALTER COLUMN "toneAppropriateness" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EssayResult" ALTER COLUMN "overallScore" DROP NOT NULL,
ALTER COLUMN "keywordCoverage" DROP NOT NULL,
ALTER COLUMN "grammarAccuracy" DROP NOT NULL,
ALTER COLUMN "coherence" DROP NOT NULL,
ALTER COLUMN "tone" DROP NOT NULL;
