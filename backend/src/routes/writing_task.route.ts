import { Router } from "express";

// -------- Controller Functions (renamed for clarity) --------

// Test/Task mode (AI scored, asynchronous)
import {
    submitWritingTaskTestMode,       // test mode submission
    fetchWritingTaskReport,          // fetch final AI report

    // Practice mode (instant feedback)
    submitPracticeWritingChallenge,
    fetchPracticeChallengeReport,

    // Admin challenge management (essay + email)
    createWritingChallengeAdmin,
    fetchAllWritingChallengesAdmin,
    fetchSingleWritingChallengeAdmin,
    updateWritingChallengeAdmin,
    deleteWritingChallengeAdmin
} from "../controllers/writing.controller";


const router = Router();

/* ======================================================================= */
/*                               TEST MODE                                 */
/* ======================================================================= */

/**
 * POST /writing/tasks/:taskId/submit
 * Submit a writing task (essay/email) for asynchronous AI scoring.
 */
router.post("/writing/tasks/:taskId/submit", submitWritingTaskTestMode);


/**
 * GET /writing/submissions/:submissionId
 * Fetch AI-generated evaluated writing report.
 */
router.get("/writing/submissions/:submissionId", fetchWritingTaskReport);




/* ======================================================================= */
/*                             PRACTICE MODE                               */
/* ======================================================================= */

/**
 * POST /practice/essay/challenge
 * Submit practice essay writing challenge for instant feedback.
 */
router.post("/practice/essay/challenge", submitPracticeWritingChallenge);

/**
 * POST /practice/email/challenge
 * Submit practice email writing challenge for instant feedback.
 */
router.post("/practice/email/challenge", submitPracticeWritingChallenge);


/**
 * GET /practice/essay/challenge/:challengeId/report
 * Fetch report for essay practice challenge.
 */
router.get("/practice/essay/challenge/:challengeId/report", fetchPracticeChallengeReport);

/**
 * GET /practice/email/challenge/:challengeId/report
 * Fetch report for email practice challenge.
 */
router.get("/practice/email/challenge/:challengeId/report", fetchPracticeChallengeReport);




/* ======================================================================= */
/*                         ADMIN — ESSAY CHALLENGES                         */
/* ======================================================================= */

/**
 * POST /admin/essay/writing/challenge
 * Create a new essay writing challenge.
 */
router.post("/admin/essay/writing/challenge", createWritingChallengeAdmin);

/**
 * GET /essay/writing/challenges
 * Fetch all essay writing challenges.
 */
router.get("/essay/writing/challenges", fetchAllWritingChallengesAdmin);

/**
 * GET /essay/writing/:challengeId
 * Fetch one essay writing challenge.
 */
router.get("/essay/writing/:challengeId", fetchSingleWritingChallengeAdmin);

/**
 * PATCH /admin/essay/writing/:challengeId
 * Update essay writing challenge.
 */
router.patch("/admin/essay/writing/:challengeId", updateWritingChallengeAdmin);

/**
 * DELETE /admin/essay/writing/:challengeId
 * Delete essay writing challenge.
 */
router.delete("/admin/essay/writing/:challengeId", deleteWritingChallengeAdmin);




/* ======================================================================= */
/*                        ADMIN — EMAIL CHALLENGES                          */
/* ======================================================================= */

/**
 * POST /admin/email/writing/challenge
 * Create a new email writing challenge.
 */
router.post("/admin/email/writing/challenge", createWritingChallengeAdmin);

/**
 * GET /email/writing/challenges
 * Fetch all email writing challenges.
 */
router.get("/email/writing/challenges", fetchAllWritingChallengesAdmin);

/**
 * GET /email/writing/:challengeId
 * Fetch one email writing challenge.
 */
router.get("/email/writing/:challengeId", fetchSingleWritingChallengeAdmin);

/**
 * PATCH /admin/email/writing/:challengeId
 * Update email writing challenge.
 */
router.patch("/admin/email/writing/:challengeId", updateWritingChallengeAdmin);

/**
 * DELETE /admin/email/writing/:challengeId
 * Delete email writing challenge.
 */
router.delete("/admin/email/writing/:challengeId", deleteWritingChallengeAdmin);




export default router;
