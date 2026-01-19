import z from "zod";

export const feedbackSchema = z.object({
    content: z.string().min(2).max(300),
    category: z.enum(["bug", "suggestion", "appreciation"]),
    rating: z.number().min(1).max(5).nonnegative(),
});

//  bug // feedback about issues or errors
//   suggestion // feedback suggesting improvements
//   appreciation