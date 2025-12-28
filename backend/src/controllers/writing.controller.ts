import { Request, Response } from "express";
import { createEssayChallengeSchema } from "../Validators/essayChallenge.validator";
import { prisma } from "../../lib/prisma";
import z from 'zod';
import { createEmailChallengeSchema } from "../Validators/emailChallenge.validator";

/* ======================================================================= */
/*                               TEST MODE                                  */
/* ======================================================================= */

/**
 * Handles submitting a writing task (essay/email) in test mode.
 * This mode sends the submission for asynchronous AI scoring.
 */
export async function submitWritingTaskTestMode(req: Request, res: Response) {
    // Implementation goes here
}



/**
 * Fetch the final AI-generated report for a writing submission.
 * This is the result of the asynchronous scoring job.
 */
export async function fetchWritingTaskReport(req: Request, res: Response) {
    // Implementation goes here
}




/* ======================================================================= */
/*                               PRACTICE MODE                              */
/* ======================================================================= */

/**
 * Submit a practice writing challenge (essay/email).
 * Practice mode gives immediate feedback instead of queued scoring.
 */
export async function submitPracticeWritingChallenge(req: Request, res: Response) {
    // Implementation goes here
}



/**
 * Fetch the report generated for a practice writing challenge.
 */
export async function fetchPracticeChallengeReport(req: Request, res: Response) {
    // Implementation goes here
}




/* ======================================================================= */
/*                         ADMIN — WRITING CHALLENGES                       */
/* ======================================================================= */

// ----------------Essay controller-------------------------------------------------



/**
 * Admin: Create a new writing challenge (essay or email).
 * A challenge contains prompt, difficulty, tags, etc.
 */
export async function createEssayWritingChallenge(req: Request, res: Response) {
    // Implementation goes here
    try {

        // 1️⃣ Validate request body
        const parsedSchema = createEssayChallengeSchema.safeParse(req.body);

        if (!parsedSchema.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: parsedSchema.error.flatten(),
            });
        }

        const {
            problemStatement,
            difficultyLevel,
            category,
            requiredTime,
            requiredWordCount,
            essayOutline,
            evaluationCriteriaKeywords
        } = parsedSchema.data;

        // 2️⃣ Prevent duplicate challenges
        const existingChallenge = await prisma.essayQuestion.findFirst({
            where: {
                problemStatement,
            },
        });

        if (existingChallenge) {
            return res.status(409).json({
                message: "An essay challenge with the same problem statement already exists",
            });
        }

        // 3️⃣ Create new challenge
        const newChallenge = await prisma.essayQuestion.create({
            data: {
                problemStatement,
                difficultyLevel,
                category,
                requiredTime,
                requiredWordCount,
                essayOutline,
                evaluationCriteriaKeywords,
            }
        })

        // 4️⃣ Success response
        return res.status(201).json({
            message: "New essay challenge created successfully",
            data: newChallenge,
        });

    } catch (error) {
        console.error("Error in creating essay challenge : ", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// controller to handle modification in filed of the problem 

export async function modifyEssayChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate request body (partial allowed)
        const parsedResult = createEssayChallengeSchema
            .partial()
            .safeParse(req.body);

        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid input data",
                // errors: parsedResult.error.flatten(),
            });
        }

        // 2️⃣ Reject empty update payload
        if (Object.keys(parsedResult.data).length === 0) {
            return res.status(400).json({
                message: "At least one field must be provided for update",
            });
        }

        // from the paramters get challengeId
        const challengeIdSchema = z.object({
            id: z.number().int().positive(),
        })

        // validate the params 
        const parsedId = challengeIdSchema.safeParse({
            id: Number(req.params.challengeId),
        });


        if (!parsedId.success) {
            // 
            return res.status(400).json({
                message: "Invalid challenge id"
            });
        }

        const { id } = parsedId.data;

        // 4️⃣ Check if challenge exists
        const existingChallenge = await prisma.essayQuestion.findUnique({
            where: { id },
        });

        if (!existingChallenge) {
            return res.status(404).json({
                message: "Request challenge not found",
            });
        }

        const {
            problemStatement,
            difficultyLevel,
            category,
            requiredTime,
            requiredWordCount,
            essayOutline,
            evaluationCriteriaKeywords
        } = parsedResult.data;


        // 5️⃣ Prevent duplicate problemStatement
        if (
            problemStatement &&
            problemStatement.trim() !== existingChallenge.problemStatement
        ) {
            const duplicate = await prisma.essayQuestion.findFirst({
                where: {
                    problemStatement: problemStatement.trim(),
                    NOT: { id },
                },
            });

            if (duplicate) {
                return res.status(409).json({
                    message:
                        "Another essay challenge with the same problem statement already exists",
                });
            }
        }

        // 6️⃣ Build clean update payload (no undefined values)
        const updateData: Record<string, any> = {};

        if (problemStatement)
            updateData.problemStatement = problemStatement.trim();
        if (difficultyLevel) updateData.difficultyLevel = difficultyLevel;
        if (category) updateData.category = category;
        if (requiredTime) updateData.requiredTime = requiredTime;
        if (requiredWordCount)
            updateData.requiredWordCount = requiredWordCount;
        if (essayOutline) updateData.essayOutline = essayOutline;
        if (evaluationCriteriaKeywords)
            updateData.evaluationCriteriaKeywords = evaluationCriteriaKeywords;

        // 7️⃣ Update challenge
        const updatedChallenge = await prisma.essayQuestion.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json({
            message: "Essay challenge updated successfully",
            data: updatedChallenge,
        });

    } catch (error) {
        console.error("Error modifying essay challenge:", error);

        // if (error.code === "P2002") {
        //     return res.status(409).json({
        //         message: "Duplicate entry detected",
        //     });
        // }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// delete controller to delete the essay challenge 
export async function destroyEssayChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate challengeId param
        const challengeIdSchema = z.object({
            id: z.number().int().positive(),
        });

        const parsedId = challengeIdSchema.safeParse({
            id: Number(req.params.challengeId),
        });

        if (!parsedId.success) {
            return res.status(400).json({
                message: "Invalid challenge id",
            });
        }

        const { id } = parsedId.data;

        // 2️⃣ Check if challenge exists
        const existingChallenge = await prisma.essayQuestion.findUnique({
            where: { id },
            include: {
                results: {
                    select: { id: true },
                },
            },
        });

        if (!existingChallenge) {
            return res.status(404).json({
                message: "Essay challenge not found",
            });
        }

        // 3️⃣ Prevent deletion if submissions exist
        if (existingChallenge.results.length > 0) {
            return res.status(409).json({
                message:
                    "Cannot delete essay challenge because user submissions exist. Consider disabling it instead.",
            });
        }

        // 4️⃣ Delete challenge
        await prisma.essayQuestion.delete({
            where: { id },
        });

        // 5️⃣ Success response
        return res.status(200).json({
            message: "Essay challenge deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting essay challenge:", error);

        // Prisma constraint handling
        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete essay challenge due to existing related records",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

//---------------------Email-------------------------------------------------------------------------------------------

/**
 * Admin: Create a new email writing challenge
 */
export async function createEmailWritingChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate request body
        const parsedSchema = createEmailChallengeSchema.safeParse(req.body);

        if (!parsedSchema.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: parsedSchema.error.flatten(),
            });
        }

        const {
            category,
            problemStatement,
            difficultyLevel,
            wordCount,
            requiredTime,
            evaluationKeywords,
            content,
        } = parsedSchema.data;

        // 2️⃣ Prevent duplicate challenges
        const existingChallenge = await prisma.emailChallenge.findFirst({
            where: {
                problemStatement: problemStatement.trim(),
                category,
            },
        });

        if (existingChallenge) {
            return res.status(409).json({
                message:
                    "An email challenge with the same problem statement already exists in this category",
            });
        }

        // 3️⃣ Create new email challenge
        const newChallenge = await prisma.emailChallenge.create({
            data: {
                category,
                problemStatement: problemStatement.trim(),
                difficultyLevel,
                wordCount,
                requiredTime,
                evaluationKeywords,
                ...(content && { content }),
            },
        });

        // 4️⃣ Success response
        return res.status(201).json({
            message: "New email challenge created successfully",
            data: newChallenge,
        });

    } catch (error: any) {
        console.error("Error creating email challenge:", error);

        // Prisma unique constraint safety (future-proof)
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Duplicate email challenge detected",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * Admin: Modify an existing email writing challenge (partial update)
 */
export async function modifyEmailChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate request body (partial allowed)
        const parsedResult = createEmailChallengeSchema
            .partial()
            .safeParse(req.body);

        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: parsedResult.error.flatten(),
            });
        }

        // 2️⃣ Reject empty update payload
        if (Object.keys(parsedResult.data).length === 0) {
            return res.status(400).json({
                message: "At least one field must be provided for update",
            });
        }

        // 3️⃣ Validate challengeId param
        const challengeIdSchema = z.object({
            id: z.number().int().positive(),
        });

        const parsedId = challengeIdSchema.safeParse({
            id: Number(req.params.challengeId),
        });

        if (!parsedId.success) {
            return res.status(400).json({
                message: "Invalid challenge id",
            });
        }

        const { id } = parsedId.data;

        // 4️⃣ Check if challenge exists
        const existingChallenge = await prisma.emailChallenge.findUnique({
            where: { id },
        });

        if (!existingChallenge) {
            return res.status(404).json({
                message: "Requested email challenge not found",
            });
        }

        const {
            category,
            problemStatement,
            difficultyLevel,
            wordCount,
            requiredTime,
            evaluationKeywords,
            content,
        } = parsedResult.data;

        // 5️⃣ Prevent duplicate problemStatement (category-aware)
        if (
            problemStatement &&
            problemStatement.trim() !== existingChallenge.problemStatement
        ) {
            const duplicate = await prisma.emailChallenge.findFirst({
                where: {
                    problemStatement: problemStatement.trim(),
                    category: category ?? existingChallenge.category,
                    NOT: { id },
                },
            });

            if (duplicate) {
                return res.status(409).json({
                    message:
                        "Another email challenge with the same problem statement already exists in this category",
                });
            }
        }

        // 6️⃣ Build clean update payload
        const updateData: Record<string, any> = {};

        if (category) updateData.category = category;
        if (problemStatement)
            updateData.problemStatement = problemStatement.trim();
        if (difficultyLevel) updateData.difficultyLevel = difficultyLevel;
        if (wordCount) updateData.wordCount = wordCount;
        if (requiredTime) updateData.requiredTime = requiredTime;
        if (evaluationKeywords)
            updateData.evaluationKeywords = evaluationKeywords;

        // JSON field (optional)
        if (content !== undefined) {
            updateData.content = content;
        }

        // 7️⃣ Update email challenge
        const updatedChallenge = await prisma.emailChallenge.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json({
            message: "Email challenge updated successfully",
            data: updatedChallenge,
        });

    } catch (error: any) {
        console.error("Error modifying email challenge:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Duplicate email challenge detected",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

/**
 * Admin: Delete an email writing challenge
 */

export async function destroyEmailChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate challengeId param
        const challengeIdSchema = z.object({
            id: z.number().int().positive(),
        });

        const parsedId = challengeIdSchema.safeParse({
            id: Number(req.params.challengeId),
        });

        if (!parsedId.success) {
            return res.status(400).json({
                message: "Invalid challenge id",
            });
        }

        const { id } = parsedId.data;

        // 2️⃣ Check if challenge exists (and fetch related results)
        const existingChallenge = await prisma.emailChallenge.findUnique({
            where: { id },
            include: {
                results: {
                    select: { id: true },
                },
            },
        });

        if (!existingChallenge) {
            return res.status(404).json({
                message: "Email challenge not found",
            });
        }

        // 3️⃣ Prevent deletion if user submissions exist
        if (existingChallenge.results.length > 0) {
            return res.status(409).json({
                message:
                    "Cannot delete email challenge because user submissions exist. Consider disabling it instead.",
            });
        }

        // 4️⃣ Delete challenge
        await prisma.emailChallenge.delete({
            where: { id },
        });

        // 5️⃣ Success response
        return res.status(200).json({
            message: "Email challenge deleted successfully",
        });
    } catch (error: any) {
        console.error("Error deleting email challenge:", error);

        // Prisma FK / relation constraint
        if (error.code === "P2003") {
            return res.status(409).json({
                message:
                    "Cannot delete email challenge due to existing related records",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

//--------------------///////////------------------------------------------------------------------------------------------------



/**
 * Admin/User: Fetch all writing challenges (essay/email).
 * Supports filters, search, and pagination.
 */
export async function fetchAllWritingChallengesAdmin(req: Request, res: Response) {
    // Implementation goes here
}



/**
 * Admin/User: Fetch a single writing challenge by ID.
 */
export async function fetchSingleWritingChallengeAdmin(req: Request, res: Response) {
    // Implementation goes here
}



