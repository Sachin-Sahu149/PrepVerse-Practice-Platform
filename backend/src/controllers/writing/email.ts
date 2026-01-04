
//---------------------Email-------------------------------------------------------------------------------------------

import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../../../lib/prisma";
import { evaluateEmail } from "../../worker/evaluate_email.worker";
import { submitEmailSchema } from "../../Validators/essaySubmission.schema";
import { createEmailChallengeSchema } from "../../Validators/emailChallenge.validator";

// Implementing the controller to handle the submisson,fetching result and retry if failed
//retry if failed 

// controller to retry email evaluation
// api/v1/email/submission/:id/retry

export async function retryEmailSubmission(req: Request, res: Response) {
    try {
        /**
        * 1️⃣ Validate route params
        */
        const paramSchema = z.object({
            id: z.coerce.number().int().positive(),
        });

        const parsedParams = paramSchema.safeParse(req.params);

        if (!parsedParams.success) {
            return res.status(400).json({
                message: "Invalid submission id",
            });
        }

        const { id } = parsedParams.data;

        // extract userId from auth middleware
        // const userId = req.user.id;
        const userId = 4;

        /**
         * Fetch email submission with ownership check 
         */

        const submission = await prisma.emailResult.findFirst({
            where: {
                id,
                userId,
            },
            select: {
                id: true,
                evaluationStatus: true,
            },
        });

        if (!submission) {
            return res.status(404).json({
                message: "Submission not found",
            });
        }
        /**
         * Guard against invalid retry states 
         * 
         */

        if (submission.evaluationStatus === "processing") {
            return res.status(409).json({
                message: "Evaluation is already in progress",
            });
        }

        if (submission.evaluationStatus === "completed") {
            return res.status(409).json({
                message: "Evaluation already completed",
            });
        }

        // Trigger evaluation retry 

        await evaluateEmail(submission.id, 0);
        return res.status(202).json({
            message: "Email evaluation retry initiated",
        })

    } catch (error) {
        console.error("Error in retry email submission :", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


// this controller will fetch the generated result 
// api end points to fetch the email evaluation result
// api/v1/email/result/:id

export async function fetchEmailResult(req: Request, res: Response) {
    try {
        // 1️⃣ Validate route params
        const paramSchema = z.object({
            id: z.coerce.number().int().positive(),
        });

        const parsedParams = paramSchema.safeParse(req.params);

        if (!parsedParams.success) {
            return res.status(400).json({
                message: "Invalid result id",
            });
        }

        const { id } = parsedParams.data;

        // 2️⃣ Extract userId (temporary hardcoded)
        // const userId = req.user.id;
        const userId = 3;

        /**
        * 3️⃣ Fetch email result with ownership check
        */
        const result = await prisma.emailResult.findFirst({
            where: {
                id,
                userId, // 🔐 user can access only their own result
            },
            select: {
                id: true,
                challengeId: true,
                userEmail: true,
                overallScore: true,
                keywordCoverage: true,
                grammarAccuracy: true,
                clarityStructureComment: true,
                toneAppropriateness: true,
                aiFeedback: true,
                timeTaken: true,
                createdAt: true,
                evaluationStatus: true,
            },
        });

        if (!result) {
            return res.status(404).json({
                message: "Result not found",
            });
        }

        /**
        * 4️⃣ Handle evaluation still in progress
        */
        if (
            result.evaluationStatus !== "completed" &&
            result.evaluationStatus !== "failed"
        ) {
            return res.status(202).json({
                message: "Evaluation in progress",
                data: result,
            });
        }


        // 5️⃣ Final evaluated response
        return res.status(200).json({
            data: result,
        });

    } catch (error) {
        console.error("Error in fetching email result:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// This controller will handle the submission of the email 
// and will trigure the email evaluator 
// api/v1/email/submit
export async function submitEmailChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate request body
        const parsedResult = submitEmailSchema.safeParse(req.body);

        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid submission data",
            });
        }


        const { questionId, userEmail, timeTaken } = parsedResult.data;

        // 2️⃣ Extract userId from auth middleware
        // const userId = req.user.id;
        // Temporary hardcoded user
        const userId = 7;

        // 3️⃣ Check if email challenge exists
        const challenge = await prisma.emailChallenge.findUnique({
            where: { id: questionId },
        });

        if (!challenge) {
            return res.status(404).json({
                message: "Email challenge not found",
            });
        }

        // 4️⃣ Store initial submission (evaluation pending)
        const submission = await prisma.emailResult.create({
            data: {
                userId,
                challengeId: questionId,
                userEmail,
                timeTaken,
                evaluationStatus: "pending",
            },
        });

        // 5️⃣ Trigger evaluation (async / background)
        // resultId: number, retryCount: number
        await evaluateEmail(submission.id, 0);

        // 6️⃣ Immediate response
        return res.status(201).json({
            message: "Email submitted successfully. Evaluation in progress",
            submissionId: submission.id,
        });
    } catch (error) {
        console.error("Error in submission of email challenge:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// Fetch only one email 
export async function fetchOneEmail(req: Request, res: Response) {
    try {
        // 1️⃣ Validate challengeId param
        const paramSchema = z.object({
            challengeId: z.coerce.number().int().positive(),
        });

        const parsedResult = paramSchema.safeParse({
            challengeId: req.params.id,
        });

        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid challenge id",
            });
        }



        const { challengeId } = parsedResult.data;

        // 2️⃣ Fetch challenge
        const challenge = await prisma.emailChallenge.findUnique({
            where: { id: challengeId },
            select: {
                id: true,
                category: true,
                problemStatement: true,
                difficultyLevel: true,
                wordCount: true,
                requiredTime: true,
                createdAt: true,
                updatedAt: true,
                // 🔐 hide content & evaluation keywords from users
            },
        });



        // 3️⃣ Not found check
        if (!challenge) {
            return res.status(404).json({
                message: "Email challenge not found",
            });
        }

        // 4️⃣ Success response
        return res.status(200).json({
            data: challenge,
        });

    } catch (error) {
        console.error("Error fetching email challenge:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
// for admin side 
export async function fetchOneEmailAdmin(req: Request, res: Response) {
    try {
        // 1️⃣ Validate challengeId param
        const paramSchema = z.object({
            challengeId: z.coerce.number().int().positive(),
        });

        const parsedResult = paramSchema.safeParse({
            challengeId: req.params.id,
        });

        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid challenge id",
            });
        }



        const { challengeId } = parsedResult.data;

        // 2️⃣ Fetch challenge
        const challenge = await prisma.emailChallenge.findUnique({
            where: { id: challengeId },
        });



        // 3️⃣ Not found check
        if (!challenge) {
            return res.status(404).json({
                message: "Email challenge not found",
            });
        }

        // 4️⃣ Success response
        return res.status(200).json({
            data: challenge,
        });

    } catch (error) {
        console.error("Error fetching email challenge:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// Fetech all the records of the email challenge
/**
 * Fetch all email challenges ( User)
 * Supports pagination, cursor-based pagination, filters
 */
// for user side 
export async function fetchEmailChallenge(req: Request, res: Response) {
    try {

        //validate query params 
        const querySchema = z.object({
            page: z.coerce.number().int().positive().optional(),
            limit: z.coerce.number().int().positive().min(1).max(50).optional(),
            cursorId: z.coerce.number().int().positive().optional(),
            difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
            category: z.enum(
                ["job_application", "complaint", "request", "campus_email", "business"],
            ).optional(),
            search: z.string().trim().min(1).optional(),
        })

        const parsedQuery = querySchema.safeParse(req.query);

        if (!parsedQuery.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
            });
        }

        const { page = 1, limit = 10, cursorId, difficultyLevel, category, search } = parsedQuery.data;
        // 
        // Build the where clause to filter the records from tables 
        const whereClause: any = {};

        if (difficultyLevel) {
            whereClause.difficultyLevel = difficultyLevel;
        }
        if (category) {
            whereClause.category = category;
        }


        if (search) {
            whereClause.problemStatement = {
                contains: search,
                mode: "insensitive",
            };
        }

        // 3️⃣ Cursor-based pagination
        if (cursorId) {
            const challenges = await prisma.emailChallenge.findMany({
                where: whereClause,
                take: limit + 1,
                skip: 1,
                cursor: { id: cursorId },
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    category: true,
                    problemStatement: true,
                    difficultyLevel: true,
                    wordCount: true,
                    requiredTime: true,
                    createdAt: true,
                    updatedAt: true,
                    // 🔐 hide content & evaluation keywords from users
                },
            });

            const hasNextPage = challenges.length > limit;
            const data = hasNextPage
                ? challenges.slice(0, limit)
                : challenges;

            return res.status(200).json({
                data,
                pagination: {
                    type: "cursor",
                    hasNextPage,
                    nextCursor: hasNextPage ? data[data.length - 1].id : null,
                },
            });
        }

        // 4️⃣ Offset-based pagination
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            prisma.emailChallenge.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.emailChallenge.count({
                where: whereClause,
            }),
        ]);

        return res.status(200).json({
            data,
            pagination: {
                type: "page",
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: skip + data.length < totalCount,
            },
        });

    } catch (error) {
        console.error("Error in fetching email : ", error);
        return res.status(500).json({
            message: "Internal server error encountered in fetchEmailChallenge"
        });
    }
}

//for admin side 

export async function fetchEmailChallengeAdmin(req: Request, res: Response) {
    try {
        //validate query params 
        const querySchema = z.object({
            page: z.coerce.number().int().positive().optional(),
            limit: z.coerce.number().int().positive().min(1).max(50).optional(),
            cursorId: z.coerce.number().int().positive().optional(),
            difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
            category: z.enum(
                ["job_application", "complaint", "request", "campus_email", "business"],
            ).optional(),
            search: z.string().trim().min(1).optional(),
        })

        const parsedQuery = querySchema.safeParse(req.query);

        if (!parsedQuery.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
            });
        }

        const { page = 1, limit = 10, cursorId, difficultyLevel, category, search } = parsedQuery.data;
        // 
        // Build the where clause to filter the records from tables 
        const whereClause: any = {};

        if (difficultyLevel) {
            whereClause.difficultyLevel = difficultyLevel;
        }
        if (category) {
            whereClause.category = category;
        }


        if (search) {
            whereClause.problemStatement = {
                contains: search,
                mode: "insensitive",
            };
        }

        // 3️⃣ Cursor-based pagination
        if (cursorId) {
            const challenges = await prisma.emailChallenge.findMany({
                where: whereClause,
                take: limit + 1,
                skip: 1,
                cursor: { id: cursorId },
                orderBy: { createdAt: "desc" },
            });

            const hasNextPage = challenges.length > limit;
            const data = hasNextPage
                ? challenges.slice(0, limit)
                : challenges;

            return res.status(200).json({
                data,
                pagination: {
                    type: "cursor",
                    hasNextPage,
                    nextCursor: hasNextPage ? data[data.length - 1].id : null,
                },
            });
        }

        // 4️⃣ Offset-based pagination
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            prisma.emailChallenge.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.emailChallenge.count({
                where: whereClause,
            }),
        ]);

        return res.status(200).json({
            data,
            pagination: {
                type: "page",
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: skip + data.length < totalCount,
            },
        });

    } catch (error) {
        console.error("Error in fetching email : ", error);
        return res.status(500).json({
            message: "Internal server error encountered in fetchEmailChallenge"
        });
    }
}

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
