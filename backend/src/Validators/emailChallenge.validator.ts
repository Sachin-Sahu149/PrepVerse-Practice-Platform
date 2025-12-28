import { z } from "zod";

/**
 * Validator: Create Email Writing Challenge (Admin Only)
 */

export const createEmailChallengeSchema = z.object({
    category: z.enum(
        ["job_application", "complaint", "request", "campus_email", "business"],
    ),

    problemStatement: z
        .string()
        .min(20, "Problem statement must be at least 20 characters")
        .max(1500, "Problem statement is too long")
        .transform((val) => val.trim()),

    difficultyLevel: z.enum(["easy", "medium", "hard"],),

    wordCount: z
        .number()
        .int()
        .positive()
        .min(50, "Minimum word count should be at least 50")
        .max(1000, "Maximum word count exceeded"),

    requiredTime: z
        .number()
        .int()
        .positive()
        .min(5, "Minimum time should be at least 5 minutes")
        .max(30, "Maximum allowed time is 30 minutes"),

    evaluationKeywords: z
        .array(z.string().min(2, "Evaluation keyword too short"))
        .min(1, "At least one evaluation keyword is required"),

    content: z
        .object({
            subject: z
                .string()
                .min(3, "Email subject must be at least 3 characters")
                .max(200, "Email subject too long")
                .transform((val) => val.trim()),
            body: z
                .string()
                .min(30, "Email body must be at least 30 characters")
                .max(5000, "Email body is too long")
                .transform((val) => val.trim()),
        })
        .optional(), // 🔥 optional if AI-only evaluation is used
});


/**
 * Type inference for controller usage
 */
export type CreateEmailChallengeInput = z.infer<
    typeof createEmailChallengeSchema
>;
