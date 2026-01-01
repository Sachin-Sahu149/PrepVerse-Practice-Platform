import { Response, Request } from "express";
import { prisma } from "../../lib/prisma"
import { evaluateEssayWithGemini } from "../services/essayEvaluation.service";
import { EvaluateEssayParams } from "../types/types";

const MAX_RETIES = 3;


export async function evaluateEssay(resultId: number, retryCount: number) {
    const result = await prisma.essayResult.findUnique({
        where: { id: resultId }
    });

    if (!result) return;

    //Prevent duplicate evaluation 
    if (result.evaluationStatus === "completed") return;

    try {
        const challenge = await prisma.essayQuestion.findUnique({
            where: { id: result.questionId }
        })
        if (!challenge) {
            throw new Error("Challenge not found");
        }

        // mark as processing 
        await prisma.essayResult.update({
            where: { id: resultId },
            data: {
                evaluationStatus: "processing",
            },
        });



        const parameters: EvaluateEssayParams = {
            problemStatement: challenge.problemStatement,
            essay: result.userEssay,
            keywords: challenge.evaluationCriteriaKeywords,
            category: challenge.category,
            difficulty: challenge.difficultyLevel,
            expectedWordCount: challenge.requiredWordCount
        }

        const aiResult = await evaluateEssayWithGemini(parameters);
        // save evaluation 
        await prisma.essayResult.update({
            where: { id: resultId },
            data: {
                evaluationStatus: "completed",
                overallScore: aiResult.score,
                grammarAccuracy: aiResult.grammar,
                coherence: aiResult.coherence,
                tone: aiResult.tone,
                keywordCoverage: aiResult.keywordCoverage,
                aiFeedback: aiResult.feedback,
            },
        });

    } catch (error: any) {
        if (retryCount >= MAX_RETIES) {
            console.log("Error in essay result evaluation : ", error);
            await prisma.essayResult.update({
                where: { id: resultId },
                data: {
                    evaluationStatus: "failed",
                }
            });
        } else {
            await prisma.essayResult.update({
                where: { id: resultId },
                data: {
                    evaluationStatus: "pending"
                },
            });

            //retry later delay 
            setTimeout(() => {
                evaluateEssay(resultId, retryCount + 1);
            }, retryCount * 5000);
        }
    }
}