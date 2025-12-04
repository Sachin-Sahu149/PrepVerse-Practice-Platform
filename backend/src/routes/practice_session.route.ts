import { Router } from "express";
import { createSession, submitOneQuestion, submitTest, fetchSessionReport, submitAllQuestions } from "../controllers/practice_session.controller"

const router = Router();

/**
 * POST /practice/session
 * -------------------------------------------
 * Create a new practice or test session.
 *
 * Body:
 *  {
 *    topicId: string,
 *    difficulty: "easy" | "medium" | "hard",
 *    totalQuestions: number,
 *    practiceType: "practice" | "test"
 *  }
 *
 * Response:
 *  {
 *    sessionId: string,
 *    questionIds: string[]
 *  }
 */
router.post("/practice/session", createSession);



/**
 * POST /practice/sessions/:sessionId/question
 * -------------------------------------------
 * Submit a user's answer for one question during a session.
 *
 * Params:
 *  - sessionId: string
 *
 * Body:
 *  {
 *    questionId: string,
 *    selectedOption: number,
 *    timeSpent: number
 *  }
 *
 * Response:
 *  {
 *    isCorrect: boolean,
 *    explanation: string,
 *    xpGained: number
 *  }
 */
router.post("/practice/sessions/:sessionId/question", submitOneQuestion);



/**
 * POST /practice/sessions/:sessionId/complete
 * -------------------------------------------
 * Complete the practice/test session and calculate the final results.
 *
 * Params:
 *  - sessionId: string
 *
 * Body:
 *  (Optional or unused — depends on design)
 *
 * Response:
 *  {
 *    summary: {
 *      totalTimeSpent: number,
 *      correctAnswers: number,
 *      xpEarned: number
 *    }
 *  }
 */
router.post("/practice/sessions/:sessionId/complete", submitTest);



/**
 * GET /practice/sessions/:sessionId
 * -------------------------------------------
 * Fetch the full report/summary of a completed session.
 *
 * Params:
 *  - sessionId: string
 *
 * Response:
 *  {
 *    sessionId,
 *    topicId,
 *    difficulty,
 *    questions: [...],
 *    summary: {...}
 *  }
 */
router.get("/practice/sessions/:sessionId", fetchSessionReport);


// submit all practice sesstions questions at once 
router.post("/practice/sessions/:sessionId", submitAllQuestions);


export default router;
