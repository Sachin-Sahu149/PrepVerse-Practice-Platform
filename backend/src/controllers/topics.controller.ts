import { Request, Response } from "express";
import { prisma } from '../../lib/prisma'
import { createTopicSchema } from "../Validators/topic.validator";
import { createQuestionSchema, destroyQuestionParamsSchema } from "../Validators/question.validator";
import z from "zod";


// Here the controller to submit the questions while practicing the questions 
// /api/v1/practice/submit/:topicId/:questionId,
// Payload 
/**
 * --selected option 
 * -- taken time 
 * response with success 
 * // If they have already selected the questions and now they are selectiing the other options they just change 
 * the selected options only if they already submitted 
 * Bu the problem is that they have already solved this questions, so do not overlap with this one 
 * To ensure this things work correctly just 
 * // show the submit button and, else questions will be submitted 
 * 
 *  So, when user will come to platform to practice the questions, even if he has already solved that questions 
 *  they do not show right option 
 * 
 */
// tested****  Just handle userId
export async function submitTheQuestion(req: Request, res: Response) {
    try {
        // get the payload 
        //payload, selected option and takentime 
        // topicId,questionId,selectedOption,spentTime,
        const bodySchema = z.object({
            // topicId: z.coerce.number().int().positive(),
            // questionId: z.coerce.number().int().positive(),
            selectedOption: z.coerce.number().int().max(5).nonnegative(),
            // each question can have at most 5 minutes 
            timeTaken: z.coerce.number().int().min(0).max(300),
        });

        // Now validate the body 
        const parsedBody = bodySchema.safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Invalid data provided",
            });
        }

        // destructuring the parsed body data 
        const { selectedOption, timeTaken } = parsedBody.data;

        // 1️⃣ Validate questionId param
        const paramSchema = z.object({
            questionId: z
                .number()
                .int()
                .positive(),
            topicId: z
                .number()
                .int()
                .positive(),
        });

        const parsedParams = paramSchema.safeParse({
            questionId: Number(req.params.questionId),
            topicId: Number(req.params.topicId),
        });

        if (!parsedParams.success) {
            return res.status(400).json({
                message: "Invalid question id or topicId",
                // errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { questionId, topicId } = parsedParams.data;

        // validate that the question existance
        const foundQuestion = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!foundQuestion) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        if (foundQuestion.topicId !== topicId) {
            return res.status(400).json({
                message: "Question does not belong to the given topic",
            });
        }

        const isCorrect = selectedOption === foundQuestion.correctOption;

        // Get the userId via auth
        // temporary userId
        const userId = 123;
        //also handle user id 

        // Now create new Entry for PracticeSessionQuestion
        const newEntry = await prisma.practiceSessionQuestion.create({
            data: {
                topicId: topicId,
                questionId: questionId,
                selectedOption: selectedOption,
                timeSpent: timeTaken,
                isCorrect: isCorrect,
                userId:userId
            },
        });

        // handle how we wil submit the Grammar questions, according to that 
        // change the submition logic 
        // but for now it ok 

        // response with success message 
        return res.status(201).json({
            message: "Question submitted successfully",
            data: {
                id: newEntry.id,
                isCorrect: newEntry.isCorrect,
            }
        })

    } catch (error) {
        console.log("Error in submitTheQuestion controller : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * GET /topics
 * -------- working 
 */
// tested*****************
export async function allTopics(req: Request, res: Response) {

    try {
        // fetch topics 
        const topics = await prisma.topic.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                icon: true,
                description: true,
                totalQuestion: true,
                difficultyDistribution: true,
            },
            orderBy: [
                { name: "asc" },
                { id: "asc" }
            ]
        });

        // check if topics available
        if (topics.length === 0) {
            return res.status(200).json({
                message: "No topics available",
                data: [],
            })
        }

        // success respsonse
        return res.status(200).json({
            message: "Topics fetched successfully",
            data: topics,
        })

    } catch (error) {
        console.error("Error fetching topics:", error);
        return res.status(500).json({
            message: "Internal server error while fetching topics",
        })
    }
}

/**
 * GET /topics/:topicId/questions
 */
// tested****************
export async function oneTopic(req: Request, res: Response) {
    try {
        // validate route params
        const paramSchema = z.object({
            topicId: z.number().int().positive(),
        })

        const paramParsed = paramSchema.safeParse({
            topicId: Number(req.params.topicId),
        })

        if (!paramParsed.success) {
            return res.status(400).json({
                message: "Invalid topic id"
            });
        }

        const { topicId } = paramParsed.data;

        // validate query params
        const querySchema = z.object({
            difficulty: z.enum(["easy", "medium", "hard"]).optional(),
            cursor: z.string().optional(),
            limit: z.string().optional(),
        })

        const queryParsed = querySchema.safeParse(req.query);

        if (!queryParsed.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
            });
        }

        const { difficulty, cursor, limit } = queryParsed.data;

        const take = Math.min(Number(limit) || 10, 50);

        //check if topic exists
        const topic = await prisma.topic.findUnique({
            where: {
                id: topicId
            },
            select: {
                id: true,
                name: true,
                category: true,
            },
        });

        if (!topic) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        //build filters
        const whereClause: any = {
            topicId,
        };

        if (difficulty) {
            whereClause.difficulty = difficulty;
        }

        //Fetch questions (cursor-based pagination )
        const questions = await prisma.question.findMany({
            where: whereClause,
            take: take + 1, // fetches one extra to check next cursor
            ...(cursor && {
                skip: 1,
                cursor: { id: Number(cursor) },
            }),
            orderBy: {
                id: "asc"
            },
            select: {
                id: true,
                type: true,
                text: true,
                options: true,
                difficulty: true,
                keywords: true,
                weightage: true,
            },
        });

        // handle pagination cursor
        let nextCursor: number | null = null;

        if (questions.length > take) {
            const nextItem = questions.pop();
            nextCursor = nextItem!.id;
        }

        // 7️⃣ Success response
        return res.status(200).json({
            message: "Questions fetched successfully",
            data: {
                topic,
                questions,
                pagination: {
                    nextCursor,
                    limit: take,
                },
            },
        });

    } catch (error) {
        console.error("")
    }
}
// tested***************
export async function findQuestions(req: Request, res: Response) {
    /**
     * GET /questions/:questionId
     */
    try {
        // 1️⃣ Validate questionId param
        const paramSchema = z.object({
            questionId: z
                .number()
                .int()
                .positive(),
        });

        const parsed = paramSchema.safeParse({
            questionId: Number(req.params.questionId),
        });

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid question id",
                // errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { questionId } = parsed.data;
        // 2️⃣ Fetch question
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            select: {
                id: true,
                topicId: true,
                type: true,
                text: true,
                options: true,
                correctOption: true,
                explanation: true,
                difficulty: true,
                keywords: true,
                weightage: true,
                createdAt: true,
                lastUpdated: true,
            },
        });

        if (!question) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        // 3️⃣ Success response
        return res.status(200).json({
            message: "Question fetched successfully",
            data: question,
        });

    } catch (error) {
        console.error("Find question error:", error);
        return res.status(500).json({
            message: "Internal server error while fetching question",
        });
    }
}

// tested***************
export async function fetchOneQuestion(req: Request, res: Response) {

    /**
     * GET /questions/:topicId/:questionId
     */
    try {
        // 1️⃣ Validate route params
        const parsed = destroyQuestionParamsSchema.safeParse({
            topicId: Number(req.params.topicId),
            questionId: Number(req.params.questionId),
        });

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid route parameters",
                // errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { topicId, questionId } = parsed.data;

        // 2️⃣ Check topic existence
        const topicExists = await prisma.topic.findUnique({
            where: { id: topicId },
            select: { id: true, name: true },
        });

        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        // 3️⃣ Fetch question & ensure it belongs to the topic
        const question = await prisma.question.findFirst({
            where: {
                id: questionId,
                topicId,
            },
            select: {
                id: true,
                topicId: true,
                type: true,
                text: true,
                options: true,
                explanation: true,
                difficulty: true,
                keywords: true,
                weightage: true,
                createdAt: true,
                lastUpdated: true,
            },
        });

        if (!question) {
            return res.status(404).json({
                message: "Question not found for this topic",
            });
        }

        // 4️⃣ Success response
        return res.status(200).json({
            message: "Question fetched successfully",
            data: {
                topic: topicExists,
                question,
            },
        });

    } catch (error) {
        console.error("Fetch one question error:", error);
        return res.status(500).json({
            message: "Internal server error while fetching question",
        });
    }
}

// tested*****************
export async function addQuestions(req: Request, res: Response) {

    // this is the controller to add the logic to add new questions in the database 
    try {
        // validate the request body using zod 
        const parsed = createQuestionSchema.safeParse(req.body);
        if (!parsed.success) {
            console.log("parsedResult : ", parsed.error?.issues.map(err => err.message));

            return res.status(400).json({
                message: "Invalid input data",
            })
        }
        console.log("parsed : ", parsed);

        const { topicId, type, text, options, correctOption, explanation, difficulty, keywords, weightage } = parsed.data;

        // check if topic exist 
        const topicExists = await prisma.topic.findUnique({
            where: {
                id: topicId
            }
        })
        // console.log("topicExist : ", topicExists);

        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found"
            })
        }

        // Optional prevent duplicate questions in same topics
        const duplicatequestion = await prisma.question.findFirst({
            where: {
                // topicId,//because it added duplicate quetions in different topics
                text: {
                    equals: text,
                    mode: "insensitive"
                }
            }
        })

        if (duplicatequestion) {
            return res.status(409).json({
                message: "Questions already exists",
            });
        }
        // create questions 
        const newQuestion = await prisma.question.create({
            data: {
                topicId,
                type,
                text,
                options: options || [],
                correctOption: correctOption ?? null,
                explanation: explanation || null,
                difficulty,
                keywords,
                weightage
            },
        });

        // update the topic analytics ( difficultyDistribution and totalQuestions )
        // const currentDistribution = topicExists.difficultyDistribution && typeof topicExists.difficultyDistribution === 'object' 
        //     ? topicExists.difficultyDistribution 
        //     : { easy: 0, medium: 0, hard: 0 };
        //  difficultyDistribution: {
        //             ...currentDistribution,
        //             [difficulty.toLowerCase()]:(currentDistribution.[difficulty.toLowerCase()] || 0) + 1
        //         }

        await prisma.topic.update({
            where: { id: topicId },
            data: {
                totalQuestion: {
                    increment: 1
                },
                difficultyDistribution: {
                    ...((topicExists.difficultyDistribution as any) || {
                        easy: 0,
                        medium: 0,
                        hard: 0
                    }),
                    [difficulty.toLowerCase()]: ((topicExists.difficultyDistribution as any)?.[difficulty.toLowerCase()] || 0) + 1,
                },
            },
        });

        // success response 
        return res.status(201).json({
            message: "Question added successfully",
            data: newQuestion
        })
    } catch (error) {
        console.error("Add questions error : ", error);
        return res.status(500).json({
            message: "Internal server error while adding questions"
        })
    }

}
// tested********************
export async function modifyQuestions(req: Request, res: Response) {
    /**
 * PUT /admin/:topicId/:questionId
 */
    try {
        // Rather than partial update, just do all things 

        // validate route params 
        const paramParsed = destroyQuestionParamsSchema.safeParse({
            topicId: Number(req.params.topicId),
            questionId: Number(req.params.questionId),
        });

        if (!paramParsed.success) {
            return res.status(400).json({
                message: "Invalid route parameters",
            });
        }

        const { topicId, questionId } = paramParsed.data;

        // log the body 
        console.log("body : ", req.body);

        if (req.body.length === 0) {
            return res.status(400).json({
                message: "Invalid data"
            });
        }

        // Fetch existing question 
        const existingQuestion = await prisma.question.findFirst({
            where: {
                id: questionId,
                topicId,
            },
        });

        if (!existingQuestion) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        //type of question can not be changed 
        if (existingQuestion.type !== req.body.type) {
            return res.status(400).json({
                message: "Type of question can not be change"
            });
        }


        req.body.topicId = topicId;

        // validate body (partial update)
        const bodyParsed = createQuestionSchema.safeParse(req.body);

        if (!bodyParsed.success) {
            // console error
            console.log("bodyParsed : ", bodyParsed)
            return res.status(400).json({
                message: "Invalid input data",
            });
        }

        const updateData = bodyParsed.data;
        console.log("updatePayload : ", updateData);


        // Fetch topic needed for analytics update 
        const topic = await prisma.topic.findFirst({
            where: { id: topicId },
        });

        if (!topic) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        // Handle difficulty change 
        const oldDifficulty = existingQuestion.difficulty;
        const newDifficulty = updateData.difficulty;

        if (newDifficulty && newDifficulty !== oldDifficulty) {
            const dist = (topic.difficultyDistribution as any) || {
                easy: 0,
                medium: 0,
                hard: 0
            };
            dist[oldDifficulty.toLowerCase()] = Math.max((dist[oldDifficulty.toLowerCase()] || 0) - 1, 0);
            dist[newDifficulty.toLowerCase()] = (dist[newDifficulty.toLowerCase()] || 0) + 1;

            await prisma.topic.update({
                where: { id: topicId },
                data: {
                    difficultyDistribution: dist,
                },
            });
        }

        // Update question
        const updatedQuestion = await prisma.question.update({
            where: { id: questionId },
            data: updateData,
        });

        // Success response
        return res.status(200).json({
            message: "Question updated successfully",
            // data: updatedQuestion,
        });

    } catch (error) {
        console.error("Modify question error : ", error);
        return res.status(500).json({
            message: "Internal server error while updating question",
        });
    }
}

//tested****************
export async function destroyQuestions(req: Request, res: Response) {
    try {
        // validate params
        const parsed = destroyQuestionParamsSchema.safeParse({
            topicId: Number(req.params.topicId),
            questionId: Number(req.params.questionId),
        });

        if (!parsed.success) {
            console.log("parsedResult : ", parsed.error?.issues.map(err => err.message));
            return res.status(400).json({
                message: "Invalid route parameters"
            });
        }

        const { topicId, questionId } = parsed.data;
        // check if question exist and belongs to the topic 
        const question = await prisma.question.findFirst({
            where: {
                id: questionId,
                topicId: topicId
            },
            select: {
                id: true,
                difficulty: true,
            },
        });

        if (!question) {
            return res.status(404).json({
                message: "Question not found for this topic",
            });
        }

        // Fetch topic for analytics rollback 
        const topic = await prisma.topic.findUnique({
            where: {
                id: topicId
            },
        });

        if (!topic) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        // delete question 
        await prisma.question.delete({
            where: {
                id: questionId
            },
        });

        // Rollback topic analytics safely
        const difficultyKey = question.difficulty.toLowerCase();
        await prisma.topic.update({
            where: { id: topicId },
            data: {
                totalQuestion: {
                    decrement: 1
                },
                difficultyDistribution: {
                    ...((topic.difficultyDistribution as any) || {
                        easy: 0,
                        medium: 0,
                        hard: 0
                    }),
                    [difficultyKey]: Math.max(
                        (((topic.difficultyDistribution as any)?.[difficultyKey]) || 0) - 1, 0),
                },
            },
        });

        // success 
        return res.status(200).json({
            message: "Question deleted successfully",
        });

    } catch (error) {
        console.error("Deleted question error:", error);
        return res.status(500).json({
            message: "Internal server error while deleting question",
        })
    }
}

// tested*************
export async function createNewTopics(req: Request, res: Response) {
    try {
        // validate request using zod 
        const parsedResult = createTopicSchema.safeParse(req.body);

        if (!parsedResult.success) {
            console.log("parsedResult : ", parsedResult.error?.issues.map(err => err.message));
            return res.status(400).json({
                message: "Invalid input data",
            })
        }
        console.log("parsedResult : ", parsedResult);

        const { name, category, description } = parsedResult.data;

        // check the existence of topic
        const existingTopic = await prisma.topic.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                }
            }
        });

        if (existingTopic) {
            return res.status(409).json({ message: "Topic with this name already exists" });
        }

        // create new topic
        const newTopic = await prisma.topic.create({
            data: {
                name,
                category,
                description: description || null,
                icon: "No icon available",
                difficultyDistribution: {
                    easy: 0,
                    medium: 0,
                    hard: 0
                },
                totalQuestion: 0,
            },
        })

        console.log("newTopic : ", newTopic);

        return res.status(200).json({ message: "Topic created successfully", data: newTopic });

    } catch (error) {
        console.error("Create topic error :", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
//tested***************
// controller to handle the modification 
export async function modifyTopic(req: Request, res: Response) {
    // icon, name, description 
    try {
        // make the zod schema to handle typesafty
        const topicSchema = z.object({
            id: z
                .number()
                .int()
                .positive(),
            name: z
                .string()
                .trim()
                .min(2, { message: "Topic name must be at least 2 characters" })
                .max(100, { message: "Topic name must not exceed 100 characters" })
                .optional(),
            description: z
                .string()
                .trim()
                .max(500, { message: "Description must not exceed 500 characters" })
                .optional(),
        });

        const parsedResult = topicSchema.safeParse(req.body);

        if (!parsedResult.success) {
            console.log("parsedResult in modifying question :", parsedResult);
            return res.status(400).json({
                message: "Something went wrong,invalid data"
            });
        }

        const { id, name, description } = parsedResult.data;

        // fetch the existing topic 
        const topicExists = await prisma.topic.findUnique({
            where: { id }
        });

        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found",
            })
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;

        // Nothing to update 
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update",
            })
        }

        //update the details 
        const updatedData = await prisma.topic.update({
            where: { id },
            data: updateData
        })

        // success response 
        return res.status(200).json({
            message: "Topic updated successfully",
            data: updatedData
        })

    } catch (error) {
        console.error("Error in modifying topcis : ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// controller to handle the deletion of topic with associated question 
/**
 * DELETE /admin/topic/:topicId
 * -------------------------------------------
 * Delete a topic and all associated data.
 */
//tested**************
export async function destroyTopic(req: Request, res: Response) {
    try {
        // 1️⃣ Validate params
        const paramSchema = z.object({
            topicId: z.number().int().positive(),
        });

        const parsed = paramSchema.safeParse({
            topicId: Number(req.params.topicId),
        });

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid topic id",
            });
        }

        const { topicId } = parsed.data;
        // topic existance 
        // 2️⃣ Check topic existence
        const topicExists = await prisma.topic.findUnique({
            where: { id: topicId },
        });


        if (!topicExists) {
            return res.status(404).json({
                message: "Topic not found",
            });
        }

        // 3️⃣ Transactional delete (data integrity)
        await prisma.$transaction([
            prisma.question.deleteMany({
                where: { topicId },
            }),
            prisma.practiceSession.deleteMany({
                where: { topicId },
            }),
            prisma.topic.delete({
                where: { id: topicId },
            }),
        ]);

        // 4️⃣ Success response
        return res.status(200).json({
            message: "Topic and associated data deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting topic:", error);
        return res.status(500).json({
            message: "Internal server error while deleting topic",
        });
    }
}
