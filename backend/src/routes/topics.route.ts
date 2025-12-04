import Router from "express";
import { allTopics, oneTopic, findQuestions, fetchOneQuestion, addQuestions, modifyQuestions, destroyQuestions } from "../controllers/topics.controller";

const router = Router();

/**
 * GET /topics
 * -------------------------------------------
 * Fetch a paginated list of all topics.
 * Supports optional query filters.
 *
 * Query Params:
 *  - search?: string        (optional search text)
 *  - cursor?: string        (pagination cursor)
 *  - limit?: number         (default: 10)
 */
router.get("/topics", allTopics);



/**
 * GET /topics/:topicId/questions
 * -------------------------------------------
 * Fetch all questions for a given topic.
 * Used when a user clicks a topic and applies
 * filters such as easy/medium/hard difficulty.
 *
 * Params:
 *  - topicId: string
 *
 * Query Params:
 *  - difficulty?: "easy" | "medium" | "hard"
 *  - cursor?: string
 *  - limit?: number (default: 10)
 */
router.get("/topics/:topicId/questions", oneTopic);



/**
 * GET /questions/:questionId
 * -------------------------------------------
 * Fetch a single question by its ID.
 * Typically used for viewing or editing
 * a standalone question.
 *
 * Params:
 *  - questionId: string
 */
router.get("/questions/:questionId", findQuestions);



/**
 * GET /questions/:topicId/:questionId
 * -------------------------------------------
 * Fetch a question by topic & question IDs.
 * Useful for practice sessions where:
 *  - you want the "next" question within a topic
 *  - you want to track user progress
 *  - you want to resume a user's session later
 *
 * Params:
 *  - topicId: string
 *  - questionId: string
 */
router.get("/questions/:topicId/:questionId", fetchOneQuestion);



/**
 * POST /admin/questions
 * -------------------------------------------
 * Create a new question.
 *
 * Body:
 *  {
 *    topicId: string,
 *    type: string,
 *    text: string,
 *    options?: string[],
 *    correctIndex?: number,
 *    explanation?: string,
 *    difficulty: "easy" | "medium" | "hard",
 *    tags?: string[]
 *  }
 */
router.post("/admin/questions", addQuestions);



/**
 * PATCH /admin/:topicId/:questionId
 * -------------------------------------------
 * Partially update an existing question.
 *
 * Params:
 *  - topicId: string
 *  - questionId: string
 *
 * Body:
 *  - any field(s) from the question schema
 */
router.patch("/admin/:topicId/:questionId", modifyQuestions);



/**
 * DELETE /admin/:topicId/:questionId
 * -------------------------------------------
 * Delete a question permanently.
 *
 * Params:
 *  - topicId: string
 *  - questionId: string
 */
router.delete("/admin/:topicId/:questionId", destroyQuestions);



export default router;
