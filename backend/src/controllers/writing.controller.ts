import { Request, Response } from "express";
import { createEssayChallengeSchema } from "../Validators/essayChallenge.validator";
import { prisma } from "../../lib/prisma";
import z from 'zod';
import { createEmailChallengeSchema } from "../Validators/emailChallenge.validator";
import { submitEssaySchema } from "../Validators/essaySubmission.schema";

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
        const userId = 7;

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

//---------------------Email-------------------------------------------------------------------------------------------

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
 * Fetch all email challenges (Admin / User)
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



