import { z } from "zod";
import { QuestionType, Difficulty } from "../../generated/prisma/enums";
// adjust path based on your prisma output

export const createQuestionSchema = z
    .object({
        topicId: z
            .number()
            .int()
            .positive(),

        type: z.enum(QuestionType), // ✅ no required_error here

        text: z
            .string()
            .trim()
            .min(5, { message: "Question text must be at least 10 characters" })
            .max(1200),

        options: z.array(z.string().trim().min(1, { message: "Option must have at least 1 char" })).optional(),

        correctOption: z.number().int().nonnegative().optional(),

        explanation: z.string().trim().optional(),

        difficulty: z.enum(Difficulty), // ✅ no required_error here

        keywords: z
            .array(z.string().trim().min(1))
            .min(1, { message: "At least one keyword is required" }),

        weightage: z
            .number()
            .int()
            .min(1)
            .max(10)
            .positive(),
    })
    .superRefine((data, ctx) => {
        // 🔹 MCQ-specific validation
        if (data.type === "MCQ") {
            console.log("under the validators : ");
            if (!data.options || data.options.length < 2) {
                ctx.addIssue({
                    path: ["options"],
                    message: "MCQ must have at least 2 options",
                    code: "custom",
                });
            }

            if (data.correctOption === undefined) {
                ctx.addIssue({
                    path: ["correctOption"],
                    message: "correctOption is required for MCQ",
                    code: "custom",
                });
            } else if (
                data.options &&
                data.correctOption >= data.options.length
            ) {
                ctx.addIssue({
                    path: ["correctOption"],
                    message: "correctOption index is out of range",
                    code: "custom",
                });
            }
        }

        // 🔹 Grammar-specific validation
        if (data.type === "Grammar") {
            if (data.options && data.options.length > 0) {
                ctx.addIssue({
                    path: ["options"],
                    message: "Grammar questions should not have options",
                    code: "custom"
                });
            }

            if (data.correctOption !== undefined) {
                ctx.addIssue({
                    path: ["correctOption"],
                    message: "Grammar questions must not have correctOption",
                    code: "custom",
                });
            }
        }
    });


export const destroyQuestionParamsSchema = z.object({
    topicId: z
        .number({ error: "topicId must be a number" })
        .int()
        .positive(),

    questionId: z
        .number({ error: "questionId must be a number" })
        .int()
        .positive(),
});

export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;