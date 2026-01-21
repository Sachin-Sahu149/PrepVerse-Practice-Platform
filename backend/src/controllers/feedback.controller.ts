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
        // Rating is required and just change, status from optional to required in prisma schema
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

// export async function fetchFeedbackById(req: Request, res: Response) {
//     try {
//         // validate the id 
//         const paramSchema = z.object({
//             feedbackId: z.coerce.number().int().nonnegative(),
//         })

//         // parse 
//         const parsedParam = paramSchema.safeParse({
//             feedbackId: Number(req.params.feedbackId),
//         });

//         if (!parsedParam.success) {
//             return res.status(400).json({
//                 message: "Invalid feedback id ",
//             });
//         }

//         // destructure the parsedParams 
//         const { feedbackId } = parsedParam.data;

//         // check existance 
//         const feedback = await prisma.feedback.findUnique({
//             where: { id: feedbackId },
//             select: {
//                 content: true,
//                 isReviewed: true,
//                 category: true,
//                 userId: true,
//                 id: true,
//                 rating: true,
//                 createdAt: true,
//                 // updatedAt:true,
//             }
//         });

//         if (!feedback) {
//             return res.status(404).json({
//                 message: "Feedback not found"
//             });
//         }

//         // return actual data if exist 
//         return res.status(200).json({
//             data: feedback,
//         })
//     } catch (error) {
//         console.error("Error in fetchFeedbackById controller : ", error);
//         return res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// }
export async function fetchFeedbackById(req: Request, res: Response) {
    try {
        const paramSchema = z.object({
            feedbackId: z.coerce.number().int().positive(),
        });

        const parsedParam = paramSchema.safeParse({
            feedbackId: Number(req.params.feedbackId),
        });

        if (!parsedParam.success) {
            return res.status(400).json({
                message: "Invalid feedback id",
            });
        }

        // 🔐 ADMIN AUTH CHECK (TEMP)
        // Replace with real middleware later
        const currentUser = {
            id: 1,
            role: "ADMIN", // must be ADMIN
        };

        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        const { feedbackId } = parsedParam.data;

        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            select: {
                id: true,
                content: true,
                category: true,
                rating: true,
                isReviewed: true,
                userId: true,
                createdAt: true,
            },
        });

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found",
            });
        }

        return res.status(200).json({
            message: "Feedback fetched successfully",
            data: feedback,
        });
    } catch (error) {
        console.error("Error in fetchFeedbackById controller:", error);
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

        // Admin auth check (temporary )
        // Replace with real admin middleware 

        const currentUser = {
            id: 1,
            role: "ADMIN",
        };

        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied",
            });
        }

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

        /**
         * 
         * ❌ 3. User existence check is unnecessary
            This part:
            const user = await prisma.user.findUnique(...)
            is wasted DB work.
            Why?
            If user has no feedback → return []
            If userId doesn’t exist → still []
            Admins don’t need a 404 here.
            This is cleaner and faster.
         */

        // // user existance 
        // const user = await prisma.user.findUnique({
        //     where: { id: userId },
        // })

        // //If not found 
        // if (!user) {
        //     return res.status(404).json({
        //         message: "User not found",
        //     });
        // }

        //find out all the feedback associated with current userId 
        const feedbacks = await prisma.feedback.findMany({
            where: { userId: userId },
            select: {
                id: true,
                content: true,
                category: true,
                rating: true,
                isReviewed: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });


        // return the feedbacks even if user has not made any submission yet
        // empty 
        return res.status(200).json({
            data: feedbacks,
        })
    } catch (error) {
        console.error("Error in fetchFeedbackByUserId:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
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
        // Admin auth check Temp 
        // Replace with real middleware 

        const currentUser = {
            id: 1,
            role: "ADMIN",
        };

        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied",
            });
        }


        // ✅ Validate query params
        const querySchema = z.object({
            category: z.enum(["bug", "suggestion", "appreciation"]).optional(),
            reviewed: z.enum(["true", "false"]).optional(),
        });

        const parsedQuery = querySchema.safeParse(req.query);

        if (!parsedQuery.success) {
            return res.status(400).json({
                message: "Invalid query parameters",
                errors: parsedQuery.error.flatten().fieldErrors,
            });
        }

        const { category, reviewed } = parsedQuery.data;

        // Build prisma filter safely 
        const where: {
            category?: "bug" | "suggestion" | "appreciation";
            isReviewed?: boolean
        } = {};

        if (category) {
            where.category = category;
        }

        if (reviewed !== undefined) {
            where.isReviewed = reviewed === "true";
        }

        // Fetch all the feedback 
        const feedbacks = await prisma.feedback.findMany({
            where,
            select: {
                id: true,
                content: true,
                category: true,
                rating: true,
                isReviewed: true,
                userId: true,      // useful for moderation
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },

        });

        // return scuccess message with data 
        return res.status(200).json({
            message: "Feedback fetched successfully",
            count: feedbacks.length,
            data: feedbacks,
        });

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
        // 🔐 ADMIN AUTH CHECK (TEMP)
        // Replace with real middleware
        const currentUser = {
            id: 1,
            role: "ADMIN",
        };

        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        // validate the feedbackId and then 
        // validate the id 
        const paramSchema = z.object({
            feedbackId: z.coerce.number().int().positive(),
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
            select: {
                isReviewed: true,
            }
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


export async function deleteFeedbackById(req: Request, res: Response) {
    try {
        // 🔐 ADMIN AUTH CHECK (replace with middleware)
        const currentUser = {
            id: 1,
            role: "ADMIN",
        };

        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        // validate the id 
        const paramSchema = z.object({
            feedbackId: z.coerce.number().int().positive(),
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


        // // Find the feedback Id 
        // const feedback = await prisma.feedback.findUnique({
        //     where: { id: feedbackId },
        // });

        // if (!feedback) {
        //     return res.status(404).json({
        //         message: "Feedback not found",
        //     });
        // }

        // ✅ Delete directly (single DB call)
        const deletedFeedback = await prisma.feedback.delete({
            where: { id: feedbackId },
            select: {
                id: true,
            },
        });

        return res.status(200).json({
            message: "Feedback deleted successfully",
            data: deletedFeedback,
        });

    } catch (error: any) {

        // Prisma record not found error 
        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Feedback not found",
            });
        }

        console.error("Error in deleteFeedbackById controller:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

// deleteFeedbackByUserId

export async function deleteFeedbackByUserId(req: Request, res: Response) {
    try {

        // 🔐 ADMIN AUTH CHECK (replace with middleware)
        const currentUser = {
            id: 1,
            role: "ADMIN",
        };

        if (currentUser.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied",
            });
        }


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

        // ✅ Delete all feedback for this user (single DB call)
        const result = await prisma.feedback.deleteMany({
            where: { userId },
        });

        return res.status(200).json({
            message: "User feedback deleted successfully",
            data: {
                deletedCount: result.count,
            },
        });
    } catch (error) {
        console.error("Error in deleteFeedbackByUserId controller:", error);
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}
