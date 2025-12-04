import { Router } from "express";
import { fetchResultantReport, submitTest } from "../controllers/writing.controller";

const router = Router();

/**
 * POST /writing/tasks/:taskId/submit
 * -------------------------------------------
 * Submit a user's essay or email writing attempt.
 *
 * Params:
 *  - taskId: string
 *
 * Body:
 *  {
 *    userId: string,
 *    responseText: string,
 *    timeTaken: number,      // in seconds or ms
 *    meta?: object           // additional metadata (browser, language, etc.)
 *  }
 *
 * Behavior:
 *  - Stores the submission
 *  - Starts async scoring + AI analysis
 *
 * Response (202 - Accepted):
 *  {
 *    jobId: string          // client can poll for results
 *  }
 */
router.post("/writing/tasks/:taskId/submit", submitTest);



/**
 * GET /writing/submissions/:submissionId
 * -------------------------------------------
 * Fetch the generated report for a completed writing challenge.
 *
 * Params:
 *  - submissionId: string
 *
 * Response:
 *  {
 *    submissionId: string,
 *    score: number,
 *    feedback: string,
 *    strengths: string[],
 *    improvementAreas: string[],
 *    aiSummary: string,
 *    timeTaken: number,
 *    submittedText: string,
 *    metadata?: object
 *  }
 */
router.get("/writing/submissions/:submissionId", fetchResultantReport);



export default router;
