import z from 'zod'


export const submitEssaySchema = z.object({
    questionId: z.number().int().positive({ error: "Invalid essay question id" }),
    userEssay: z.string()
        .trim()
        .min(50, { error: "Essay must contain at least 50 characters" })
        .max(10000, { error: "Essay is too long" }),

    timeTaken: z.number().int().positive()
        .max(60 * 60) // max 1 hour 
        .optional()
})