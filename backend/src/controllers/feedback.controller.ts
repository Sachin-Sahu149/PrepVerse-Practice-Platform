import { Request, Response } from "express";
import z from 'zod'
import { feedbackSchema } from "../Validators/feedback.validator";
import { prisma } from "../../lib/prisma";

/*
1️⃣ Submit feedback (USER)
POST /api/v1/feedback


Purpose
Create a new feedback entry
Auth
✅ Required (user)
Request body
{
  "content": "The practice session freezes on submit",
  "category": "bug",
  "rating": 4
}
Rules
userId → from auth
isReviewed → default false
rating optional
Response
{
  "message": "Feedback submitted successfully",
  "data": {
    "id": 12
  }
}
*/

export async function submitFeedback(req: Request, res: Response) {
    try {
        // create the z schema for validity 
        const parsedBody = feedbackSchema.safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({
                message: "Invalid data",
            });
        }
        // destructure 
        const { content, rating, category } = parsedBody.data;
        // get the userId through auth 
        // but for now create a temporary 
        const userId = 3;
        // create new feedback entry 
        const newEntry = await prisma.feedback.create({
            data: {
                userId: userId,
                content: content,
                rating: rating,
                category: category
            }
        });

        // send the success message to the client 
        return res.status(201).json({
            message: "Feedback submitted successfully",
            data: {
                id: newEntry.id
            }
        })

    } catch (error) {
        console.error("Error in submitFeedback controller : ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// 2️⃣ Get feedback by ID (USER / ADMIN)
// GET /api/v1/feedback/:feedbackId


// Access rules

// User → can only access their own feedback

// Admin → can access any

// Response

// {
//   "id": 12,
//   "content": "...",
//   "category": "bug",
//   "rating": 4,
//   "isReviewed": false,
//   "createdAt": "2026-01-17T..."
// }

export async function fetchFeedbackById(req: Request, res: Response) {
    try {
        // validate the id 
        const paramSchema = z.object({
            feedbackId: z.coerce.number().int().nonnegative(),
        })

        // parse 
        const parsedParam = paramSchema.safeParse({
            feedbackId: Number(req.params.feedbackId),
        });

        if (!parsedParam.success) {
            return res.status(400).json({
                message: "Invalid feedback id ",
            });
        }

        // destructure the parsedParams 
        const { feedbackId } = parsedParam.data;

        // check existance 
        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            select: {
                content: true,
                isReviewed: true,
                category: true,
                userId: true,
                id: true,
                rating: true,
                createdAt: true,
                // updatedAt:true,
            }
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        // return actual data if exist 
        return res.status(200).json({
            data: feedback,
        })
    } catch (error) {
        console.error("Error in fetchFeedbackById controller : ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// 3️⃣ Get all feedback of a specific user (USER / ADMIN)
// GET /api/v1/feedback/user/:userId
// Access rules
// User → only their own userId
// Admin → any user
// Use case
// User feedback history
// Support tickets per user

export async function fetchFeedbackByUserId(req: Request, res: Response) {
    try {
        // validate the userId 
        const paramSchema = z.object({
            userId: z.coerce.number().int().nonnegative(),
        })

        // parse 
        const parsedParam = paramSchema.safeParse({
            userId: Number(req.params.userId),
        });

        if (!parsedParam.success) {
            return res.status(400).json({
                message: "Invalid user id ",
            });
        }

        // destructure the parsedParams 
        const { userId } = parsedParam.data;

        // user existance 
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        //If not found 
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        //find out all the feedback associated with current userId 
        const feedbacks = await prisma.feedback.findMany({
            where: { userId: userId },
        });


        // return the feedbacks even if user has not made any submission yet
        // empty 
        return res.status(200).json({
            data: feedbacks,
        })
    } catch (error) {
        console.error("Error in fetchAllFeedback : ", error);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}


/*

4️⃣ Get all feedback (ADMIN – analytics)
GET /api/v1/feedback
Query params (optional)
GET /api/v1/feedback?category=bug&reviewed=false
Supports
Dashboard
Trends
Moderation queue

*/
export async function fetchAllFeedback(req: Request, res: Response) {
    try {
        // simply fetch all feedback based one query if provided 
        // Resume from this point onwards
        // fetch the query parameters first 
        const { category, reviewed } = req.query;
        // Log the category and reviewed to understand the types of variables 
        const query: any = {};
        if (category !== undefined && category !== null) {
            query.category = category;
        }

        if (reviewed !== undefined && reviewed !== null) {
            query.isReviewed = reviewed;
        }

        // Fetch all the feedback 
        const feedbacks = await prisma.feedback.findMany({
            where: query
        });

        // return scuccess message with data 
        return res.status(200).json({
            data: feedbacks
        })

    } catch (error) {
        console.error("Error in fetchAllFeedback controller : ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}



/*
5️⃣ Mark feedback as reviewed (ADMIN)
PATCH /api/v1/feedback/:feedbackId/review


Body

{
 "isReviewed": true
}
 */

export async function updateFeedbackReview(req: Request, res: Response) {
    try {
        // validate the feedbackId and then 
        // validate the id 
        const paramSchema = z.object({
            feedbackId: z.coerce.number().int().nonnegative(),
        })

        // parse 
        const parsedParam = paramSchema.safeParse({
            feedbackId: Number(req.params.feedbackId),
        });

        if (!parsedParam.success) {
            return res.status(400).json({
                message: "Invalid feedback id ",
            });
        }

        // destructure the parsedParams 
        const { feedbackId } = parsedParam.data;

        // Find the feedback Id 
        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found",
            });
        }

        // now update the review 
        const updatedFeedback = await prisma.feedback.update({
            where: { id: feedbackId },
            data: {
                ...feedback,
                isReviewed: !feedback.isReviewed
            }
        });

        console.log("UpdatedFeedback : ", updatedFeedback);

        // send the success message
        return res.status(200).json({
            message: "Feedback marked reviwed",
            data: updatedFeedback
        })

    } catch (error) {
        console.error("Error in updateFeedbackReview controller : ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}