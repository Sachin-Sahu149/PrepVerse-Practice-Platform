import { Router } from "express";

/**
 * Essay Writing Routes
 * Handles:
 * - Essay submission & evaluation
 * - Fetching evaluation results
 * - Retry failed evaluations
 * - Essay challenge listing (user & admin)
 * - Admin CRUD operations for essay challenges
 */

import {
    // ---------------- USER — ESSAY SUBMISSION & RESULT ----------------
    submitEssayChallenge,       // submit essay & trigger evaluation
    fetchEssayResult,           // fetch evaluated essay result
    retryEssaySubmission,       // retry failed essay evaluation

    // ---------------- USER — ESSAY CHALLENGE FETCH ----------------
    fetchEssayChallenge,        // fetch all essay challenges (user)
    fetchOneEssayChallenge,     // fetch single essay challenge (user)

    // ---------------- ADMIN — ESSAY CHALLENGE FETCH ----------------
    fetchEssayChallengeAdmin,   // fetch all essay challenges (admin)
    fetchOneEssayChallengeAdmin,// fetch single essay challenge (admin)

    // ---------------- ADMIN — ESSAY CHALLENGE MANAGEMENT ----------------
    createEssayWritingChallenge,// create new essay challenge
    modifyEssayChallenge,       // update essay challenge
    destroyEssayChallenge       // delete essay challenge
} from "../../controllers/writing/essay";

const router = Router();

/* ======================================================================= */
/*                         USER — ESSAY SUBMISSION                          */
/* ======================================================================= */

/**
 * POST /api/v1/essay/submit
 * Submit an essay writing challenge
 * Triggers async AI evaluation
 */
router.post("/essay/submit", submitEssayChallenge);

/**
 * GET /api/v1/essay/result/:id
 * Fetch evaluated essay result
 * Returns:
 * - 202 if evaluation is still in progress
 * - 200 if completed or failed
 */
router.get("/essay/result/:id", fetchEssayResult);

/**
 * POST /api/v1/essay/submission/:id/retry
 * Retry failed essay evaluation
 */
router.post("/essay/submission/:id/retry", retryEssaySubmission);


/* ======================================================================= */
/*                      USER — ESSAY CHALLENGE FETCH                        */
/* ======================================================================= */

/**
 * GET /api/v1/essay/challenges
 * Fetch all essay challenges (user side)
 * Supports:
 * - pagination
 * - cursor pagination
 * - difficulty & category filters
 * - search
 */
router.get("/essay/challenges", fetchEssayChallenge);

/**
 * GET /api/v1/essay/challenge/:id
 * Fetch a single essay challenge (user view)
 * Evaluation criteria keywords are hidden
 */
router.get("/essay/challenge/:id", fetchOneEssayChallenge);


/* ======================================================================= */
/*                      ADMIN — ESSAY CHALLENGE FETCH                       */
/* ======================================================================= */

/**
 * GET /api/v1/admin/essay/challenges
 * Fetch all essay challenges (admin)
 */
router.get("/admin/essay/challenges", fetchEssayChallengeAdmin);

/**
 * GET /api/v1/admin/essay/challenge/:id
 * Fetch a single essay challenge (admin)
 * Includes full evaluation metadata
 */
router.get("/admin/essay/challenge/:id", fetchOneEssayChallengeAdmin);


/* ======================================================================= */
/*                    ADMIN — ESSAY CHALLENGE MANAGEMENT                    */
/* ======================================================================= */

/**
 * POST /api/v1/admin/essay/challenge
 * Create a new essay writing challenge
 */
router.post("/admin/essay/challenge", createEssayWritingChallenge);

/**
 * PATCH /api/v1/admin/essay/challenge/:challengeId
 * Update an existing essay challenge (partial update)
 */
router.patch("/admin/essay/challenge/:challengeId", modifyEssayChallenge);

/**
 * DELETE /api/v1/admin/essay/challenge/:challengeId
 * Delete an essay challenge
 * ❌ Prevents deletion if user submissions exist
 */
router.delete("/admin/essay/challenge/:challengeId", destroyEssayChallenge);

export default router;
