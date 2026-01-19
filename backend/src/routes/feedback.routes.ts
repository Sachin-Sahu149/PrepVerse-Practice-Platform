import Router from "express"
import { deleteFeedbackById, deleteFeedbackByUserId, fetchAllFeedback, fetchFeedbackById, fetchFeedbackByUserId, submitFeedback, updateFeedbackReview } from "../controllers/feedback.controller";

const router = Router();

// create the api end point to submit the feedback 
// user can submit the feedback 
/**
 * get the feedback by specific id , userId  
 * get the all feedback at once to analysis 
 * submit the feedback 
 * destroy one feedback with specific id 
 * destroy all feedback of any userid 
 * mark reviewed
 * 
 * 
 * 📌 Base Route
/api/v1/feedback

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

router.post("/feedback", submitFeedback);

/*

2️⃣ Get feedback by ID (USER / ADMIN)
GET /api/v1/feedback/:feedbackId


Access rules

User → can only access their own feedback

Admin → can access any

Response

{
  "id": 12,
  "content": "...",
  "category": "bug",
  "rating": 4,
  "isReviewed": false,
  "createdAt": "2026-01-17T..."
}
  */
router.get("/feedback/:feedbackId", fetchFeedbackById);


/*

3️⃣ Get all feedback of a specific user (USER / ADMIN)
GET /api/v1/feedback/user/:userId
Access rules
User → only their own userId
Admin → any user
Use case
User feedback history
Support tickets per user
*/
router.get("/feedback/admin/:userId", fetchFeedbackByUserId);

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
router.get("/feedback", fetchAllFeedback)

/*
5️⃣ Mark feedback as reviewed (ADMIN)
PATCH /api/v1/feedback/:feedbackId/review


Body

{
 "isReviewed": true
}
(or no body at all, just mark true)
 */

router.patch("/feedback/:feedbackId/review", updateFeedbackReview);

/*

6️⃣ Delete one feedback by ID (USER / ADMIN)
DELETE /api/v1/feedback/:feedbackId


Rules

User → can delete their own feedback

Admin → can delete any
*/
router.delete("/feedback/:feedbackId", deleteFeedbackById);


/*

7️⃣ Delete all feedback of a user (ADMIN only)
DELETE /api/v1/feedback/user/:userId


Purpose

GDPR-like cleanup

Abuse / test account cleanup
* 
* 
*/

router.delete("/feedback/user/:userId", deleteFeedbackByUserId);