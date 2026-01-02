import { prisma } from "../../lib/prisma";
import { evaluateEmailWithGemini } from "../services/emailEvaluation.service";
import { EvaluateEmailParams } from "../types/types";




const MAX_RETRIES = 3;

export async function evaluateEmail(resultId: number, retryCount: number) {
    try {
        // 1️⃣ Fetch email result
        const result = await prisma.emailResult.findUnique({
            where: { id: resultId },
        });

        if (!result) return;

        // 2️⃣ Prevent duplicate evaluation
        if (result.evaluationStatus === "completed") return;

        // 3️⃣ Fetch related email challenge
        const challenge = await prisma.emailChallenge.findUnique({
            where: { id: result.challengeId },
        });

        if (!challenge) {
            throw new Error("Email challenge not found");
        }

        // 4️⃣ Mark evaluation as PROCESSING
        await prisma.emailResult.update({
            where: { id: resultId },
            data: {
                evaluationStatus: "processing",
            },
        });

        // create the referencecontent object
        // const content = {
        //     subject: challenge.content,
        //     body: ""
        // }

        // 5️⃣ Build evaluation parameters
        const parameters: EvaluateEmailParams = {
            problemStatement: challenge.problemStatement,
            email: result.userEmail,
            keywords: challenge.evaluationKeywords,
            category: challenge.category,
            difficulty: challenge.difficultyLevel,
            expectedWordCount: challenge.wordCount,
            // referenceContent: challenge.content ?? null,
        };

        // 6️⃣ Call Gemini evaluator
        const aiResult = await evaluateEmailWithGemini(parameters);

        // 7️⃣ Save evaluation result
        await prisma.emailResult.update({
            where: { id: resultId },
            data: {
                evaluationStatus: "completed",
                overallScore: aiResult.overallScore,
                grammarAccuracy: aiResult.grammarAccuracy,
                toneAppropriateness: aiResult.toneAppropriateness,
                keywordCoverage: aiResult.keywordCoverage,
                clarityStructureComment: aiResult.clarityStructureComment,
                aiFeedback: aiResult.aiFeedback,
            },
        });

    } catch (error: any) {
        console.error("Error in email result evaluation:", error);
        // 8️⃣ Retry / fail logic (same as essay)
        if (retryCount >= MAX_RETRIES) {
            await prisma.emailResult.update({
                where: { id: resultId },
                data: {
                    evaluationStatus: "failed",
                },
            });
        } else {
            await prisma.emailResult.update({
                where: { id: resultId },
                data: {
                    evaluationStatus: "pending",
                },
            });

            // 9️⃣ Retry later with backoff
            setTimeout(() => {
                evaluateEmail(resultId, retryCount + 1);
            }, retryCount * 5000);
        }
    }
}