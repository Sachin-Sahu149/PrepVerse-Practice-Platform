import z from "zod";

export const feedbackSchema = z.object({
    content: z.string().trim().min(5).max(300),
    category: z.enum(["bug", "suggestion", "appreciation"]),
    rating: z.number().int().min(1).max(5),
});

//  bug // feedback about issues or errors
//   suggestion // feedback suggesting improvements
//   appreciation