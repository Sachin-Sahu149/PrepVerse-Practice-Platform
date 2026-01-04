
import { Request, Response } from "express";
import z from "zod";
import { prisma } from "../../../lib/prisma";
import { submitEssaySchema } from "../../Validators/essaySubmission.schema";
import { createEssayChallengeSchema } from "../../Validators/essayChallenge.validator";
import { evaluateEssay } from "../../worker/evaluate_essay.worker";



// ----------------Essay controller-------------------------------------------------
// controller to retry the task evaluation 
// api/v1/essay/submission/id/retry

export async function retryEssaySubmission(req: Request, res: Response) {
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

        // consider the userId is coming from the request 
        const userId = 4;

        /**
    * 3️⃣ Fetch submission with ownership check
    */
        const submission = await prisma.essayResult.findFirst({
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
     * 4️⃣ Guard against invalid retry states
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


        // Just call essay evalator 
        // Here we call the LLM to evaluate the ans 
        await evaluateEssay(submission.id, 0);

        //return success message 
        return res.status(202).json({
            message: "Essay evaluation retry initiated",
        });
    } catch (error) {
        console.log("Error in retry submissin : ", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// api end points to fetch the result 
// api/v1/essay/result/id
export async function fetchEssayResult(req: Request, res: Response) {
    try {
        ///valid the id parameters 
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

        // let say assume that userId exist in 
        // const userId = req?.user?.id 
        const userId = 3;
        /**
      * 3️⃣ Fetch result with ownership check
      */
        const result = await prisma.essayResult.findFirst({
            where: {
                id,
                userId, // 🔐 ensures user can only fetch their own result
            },
            select: {
                id: true,
                questionId: true,
                userEssay: true,
                overallScore: true,
                keywordCoverage: true,
                grammarAccuracy: true,
                coherence: true,
                tone: true,
                aiFeedback: true,
                timeTaken: true,
                createdAt: true,
                evaluationStatus: true
            },
        });


        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        /**
         * Handle evaluation still in progress
         * 
         */
        if (result.evaluationStatus !== "completed" && result.evaluationStatus !== "failed") {
            return res.status(202).json({
                message: "Evaluation in progress",
                data: result
            })
        }

        //return the success message with data
        return res.status(200).json({
            data: result
        })
    } catch (error: any) {
        console.log("Error in fetching results : ", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


// and api end points to retry if fails 


// 
// Submit the task 
/**
 * User submits an essay challenge
 * ✅ Case A: User submits / auto-submit

Store essay result with:

evaluationStatus: "pending"


Redirect user to:

/essay/result/:resultId

Your result page must fetch by resultId, not regenerate.

GET /api/essay-results/:resultId

Option 1: Auto retry (recommended)

Retry 2–3 times in background

Exponential backoff

Option 2: Manual retry (admin/user)
POST /api/essay-results/:id/retry

 */
export async function submitEssayChallenge(req: Request, res: Response) {
    try {
        // validate the req.body
        const parsedResult = submitEssaySchema.safeParse(req.body);

        if (!parsedResult.success) {
            return res.status(400).json({
                message: "Invalid submission data",
            });
        }

        const { questionId, userEssay, timeTaken } = parsedResult.data;

        // extract userId from auth middleware 
        // const{userId} = req.user.id;
        //For temporary
        // user id in profile reference to id of that documents 
        // temporarily
        const userId = 7; // 

        // 3️⃣ Check if essay question exists
        const question = await prisma.essayQuestion.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            return res.status(404).json({
                message: "Essay challenge not found",
            });
        }

        // store initial submission (evaluation pending)
        const submission = await prisma.essayResult.create({
            data: {
                userId,
                questionId,
                userEssay,
                timeTaken,
                evaluationStatus: "pending",
            }
        })

        //Trigger evaluation
        //This is where LLM will process the task
        // evaluateEssayAsync(submission.id)
        //resultId: number, retryCount: number
        // const parameters: { resultId: Number, retryCount: Number } = {
        //     resultId: submission.id,
        //     retryCount: 0
        // }
        // Here we call the LLM to evaluate the ans 
        await evaluateEssay(submission.id, 0);

        return res.status(201).json({
            message: "Essay submitted successfully. Evaluation in progress",
            submissionId: submission.id
        })

    } catch (error) {
        console.error("Error in submition of essay challenge : ", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

/**
 * Fetch a single essay challenge by ID
 */
// for user side 
export async function fetchOneEssayChallenge(req: Request, res: Response) {
    try {
        // 1️⃣ Validate challengeId param (params are strings → coerce)
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

        // 2️⃣ Fetch essay challenge
        const challenge = await prisma.essayQuestion.findUnique({
            where: { id: challengeId },
            select: {
                id: true,
                problemStatement: true,
                difficultyLevel: true,
                category: true,
                requiredTime: true,
                requiredWordCount: true,
                essayOutline: true,
                createdAt: true,
                updatedAt: true,
                // 🔐 evaluationCriteriaKeywords intentionally hidden from users
            },
        });

        // 3️⃣ Not found check
        if (!challenge) {
            return res.status(404).json({
                message: "Essay challenge not found",
            });
        }

        // 4️⃣ Success response
        return res.status(200).json({
            data: challenge,
        });

    } catch (error) {
        console.error("Error fetching essay challenge:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// controller to fetch all the essay challenge 
// cursor and pagination 
// for user side 
export async function fetchEssayChallenge(req: Request, res: Response) {
    try {

        //validate query params 
        const querySchema = z.object({
            page: z.coerce.number().int().positive().optional(),
            limit: z.coerce.number().int().min(1).max(50).optional(),
            cursorId: z.coerce.number().int().positive().optional(),
            difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
            category: z.enum([
                "technical",
                "moral",
                "historical",
                "abstract",
                "business",
                "personal_growth",
                "others"
            ]).optional(),
            search: z.string().trim().min(1).optional(),
            // page:z.coerce.number().int().min(1).max(50).optional()
        })

        const parsedQuery = querySchema.safeParse(req.query);

        if (!parsedQuery.success) {
            return res.status(400).json({
                message: "Invalid query paramters",
            });
        }

        const { page = 1, limit = 10, cursorId, difficultyLevel, category, search } = parsedQuery.data;

        // build where clause filters
        const whereClause: any = {};

        if (difficultyLevel) whereClause.difficultyLevel = difficultyLevel;
        if (category) whereClause.category = category;

        if (search) {
            whereClause.problemStatement = {
                contains: search,
                mode: "insenstive"
            };
        }

        if (cursorId) {
            const challenges = await prisma.essayQuestion.findMany({
                where: whereClause,
                cursor: { id: cursorId },
                skip: 1,
                take: limit + 1,
                orderBy: {
                    createdAt: "desc"
                },
                select: {
                    id: true,
                    problemStatement: true,
                    difficultyLevel: true,
                    category: true,
                    requiredTime: true,
                    requiredWordCount: true,
                    essayOutline: true,
                    createdAt: true,
                    updatedAt: true,
                    // 🔐 evaluationCriteriaKeywords intentionally hidden from users
                },
            });
            const hasNextPage = challenges.length > limit;
            const data = hasNextPage ? challenges.slice(0, limit) : challenges;

            return res.status(200).json({
                data,
                pagination: {
                    type: "cursor",
                    hasNextPage,
                    nextCursor: hasNextPage ? data[data.length - 1].id : null,
                }
            })
        }

        // 4️⃣ Offset-based pagination
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            prisma.essayQuestion.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.essayQuestion.count({ where: whereClause }),
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
        console.error("Error in fetching the essay challenge :", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// for admin side 

export async function fetchOneEssayChallengeAdmin(req: Request, res: Response) {
    try {
        // 1️⃣ Validate challengeId param (params are strings → coerce)
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

        // 2️⃣ Fetch essay challenge
        const challenge = await prisma.essayQuestion.findUnique({
            where: { id: challengeId },
        });

        // 3️⃣ Not found check
        if (!challenge) {
            return res.status(404).json({
                message: "Essay challenge not found",
            });
        }

        // 4️⃣ Success response
        return res.status(200).json({
            data: challenge,
        });

    } catch (error) {
        console.error("Error fetching essay challenge:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}


// for admin side 
export async function fetchEssayChallengeAdmin(req: Request, res: Response) {
    try {

        //validate query params 
        const querySchema = z.object({
            page: z.coerce.number().int().positive().optional(),
            limit: z.coerce.number().int().min(1).max(50).optional(),
            cursorId: z.coerce.number().int().positive().optional(),
            difficultyLevel: z.enum(["easy", "medium", "hard"]).optional(),
            category: z.enum([
                "technical",
                "moral",
                "historical",
                "abstract",
                "business",
                "personal_growth",
                "others"
            ]).optional(),
            search: z.string().trim().min(1).optional(),
            // page:z.coerce.number().int().min(1).max(50).optional()
        })

        const parsedQuery = querySchema.safeParse(req.query);

        if (!parsedQuery.success) {
            return res.status(400).json({
                message: "Invalid query paramters",
            });
        }

        const { page = 1, limit = 10, cursorId, difficultyLevel, category, search } = parsedQuery.data;

        // build where clause filters
        const whereClause: any = {};

        if (difficultyLevel) whereClause.difficultyLevel = difficultyLevel;
        if (category) whereClause.category = category;

        if (search) {
            whereClause.problemStatement = {
                contains: search,
                mode: "insenstive"
            };
        }

        if (cursorId) {
            const challenges = await prisma.essayQuestion.findMany({
                where: whereClause,
                cursor: { id: cursorId },
                skip: 1,
                take: limit + 1,
                orderBy: {
                    createdAt: "desc"
                },
            });
            const hasNextPage = challenges.length > limit;
            const data = hasNextPage ? challenges.slice(0, limit) : challenges;

            return res.status(200).json({
                data,
                pagination: {
                    type: "cursor",
                    hasNextPage,
                    nextCursor: hasNextPage ? data[data.length - 1].id : null,
                }
            })
        }

        // 4️⃣ Offset-based pagination
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            prisma.essayQuestion.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.essayQuestion.count({ where: whereClause }),
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
        console.error("Error in fetching the essay challenge :", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



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