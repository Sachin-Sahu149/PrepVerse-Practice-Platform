import { Router } from "express";

/**
 * Email Writing Routes
 * Handles:
 * - Email challenge listing (user & admin)
 * - Email submission & evaluation
 * - Fetching evaluation results
 * - Retry failed evaluations
 * - Admin CRUD for email challenges
 */

import {
    // ---------------- USER — EMAIL SUBMISSION & RESULT ----------------
    submitEmailChallenge,        // submit email & trigger evaluation
    fetchEmailResult,            // fetch evaluated email result
    retryEmailSubmission,        // retry failed email evaluation

    // ---------------- USER — EMAIL CHALLENGE FETCH ----------------
    fetchEmailChallenge,         // fetch all email challenges (user)
    fetchOneEmail,               // fetch single email challenge (user)

    // ---------------- ADMIN — EMAIL CHALLENGE FETCH ----------------
    fetchEmailChallengeAdmin,    // fetch all email challenges (admin)
    fetchOneEmailAdmin,          // fetch single email challenge (admin)

    // ---------------- ADMIN — EMAIL CHALLENGE MANAGEMENT ----------------
    createEmailWritingChallenge, // create new email challenge
    modifyEmailChallenge,        // update email challenge
    destroyEmailChallenge        // delete email challenge
} from "../../controllers/writing/email";

const router = Router();

/* ======================================================================= */
/*                         USER — EMAIL SUBMISSION                          */
/* ======================================================================= */

/**
 * POST /api/v1/email/submit
 * Submit an email writing challenge
 * Triggers async AI evaluation
 */
router.post("/email/submit", submitEmailChallenge);

/**
 * GET /api/v1/email/result/:id
 * Fetch evaluated email result
 * If evaluation is still running → returns 202
 */
router.get("/email/result/:id", fetchEmailResult);

/**
 * POST /api/v1/email/submission/:id/retry
 * Retry failed email evaluation
 */
router.post("/email/submission/:id/retry", retryEmailSubmission);


/* ======================================================================= */
/*                      USER — EMAIL CHALLENGE FETCH                        */
/* ======================================================================= */

/**
 * GET /api/v1/email/challenges
 * Fetch all email challenges (user side)
 * Supports:
 * - pagination
 * - cursor pagination
 * - filters (difficulty, category)
 * - search
 */
router.get("/email/challenges", fetchEmailChallenge);

/**
 * GET /api/v1/email/challenge/:id
 * Fetch one email challenge (user view)
 * Hides evaluation keywords & content
 */
router.get("/email/challenge/:id", fetchOneEmail);


/* ======================================================================= */
/*                      ADMIN — EMAIL CHALLENGE FETCH                       */
/* ======================================================================= */

/**
 * GET /api/v1/admin/email/challenges
 * Fetch all email challenges (admin)
 */
router.get("/admin/email/challenges", fetchEmailChallengeAdmin);

/**
 * GET /api/v1/admin/email/challenge/:id
 * Fetch single email challenge (admin)
 * Includes full content & evaluation keywords
 */
router.get("/admin/email/challenge/:id", fetchOneEmailAdmin);


/* ======================================================================= */
/*                    ADMIN — EMAIL CHALLENGE MANAGEMENT                    */
/* ======================================================================= */

/**
 * POST /api/v1/admin/email/challenge
 * Create a new email writing challenge
 */
router.post("/admin/email/challenge", createEmailWritingChallenge);

/**
 * PATCH /api/v1/admin/email/challenge/:challengeId
 * Update email writing challenge (partial update allowed)
 */
router.patch("/admin/email/challenge/:challengeId", modifyEmailChallenge);

/**
 * DELETE /api/v1/admin/email/challenge/:challengeId
 * Delete email writing challenge
 * Prevents deletion if user submissions exist
 */
router.delete("/admin/email/challenge/:challengeId", destroyEmailChallenge);

export default router;
