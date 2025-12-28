import z from "zod"

/**
 * Validator:Create Essay writing challenge 
 * 
 */

export const createEssayChallengeSchema = z.object({
    problemStatement: z
        .string()
        .trim()
        .min(20, "Problem statement must be at least 20 characters")
        .max(2000, "Problem statement is too long"),

    difficultyLevel: z
        .enum(["easy", "medium", "hard"]),

    category: z.enum(
        [
            "technical",
            "moral",
            "historical",
            "abstract",
            "business",
            "personal_growth",
            "others"
        ]),

    requiredTime: z
        .number()
        .int()
        .positive()
        .min(5, "Minimum time should be at least 5 minutes")
        .max(60, "maximum allowed time is 60 minutes"),

    requiredWordCount: z
        .number()
        .int()
        .positive()
        .min(100, "Minimum word count should be at least 100")
        .max(5000, "Maximum word count exceeded"),

    essayOutline: z.object({
        heading: z.string().min(3, "Outline heading must be at least 3 characters"),
        hintQuestions: z
            .array(z.string().min(5, "Hint question too short"))
            .min(1, "At least one hint question is required"),

    }),

    evaluationCriteriaKeywords: z
        .array(z.string().min(2, "Keyword too short"))
        .min(1, "At least one evaluation keyword is required")

})


/**
 * Type inference for controller usage
 */
export type CreateEssayChallengeInput = z.infer<
    typeof createEssayChallengeSchema
>;