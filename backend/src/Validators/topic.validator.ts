import { z } from "zod";
// import { Category } from "../../generated/prisma/enums";


/**
 * Zod schema to validate Topic creation payload
 */

export const createTopicSchema = z.object(
    {
        name: z
            .string()
            .trim()
            .min(2, { message: "Topic name must be at least 2 characters" })
            .max(100, { message: "Topic name must not exceed 100 characters" }),

        category: z.enum(["Technical", "Communication", "Aptitude"], {
            message: "Invalid category value",
        }),
        description: z
            .string()
            .trim()
            .max(500, { message: "Description must not exceed 500 characters" })
            .optional(),
    }
);

/**
 * Type inferred from schema
 * Used for strong typing in services/controllers
 */
export type CreateTopicInput = z.infer<typeof createTopicSchema>;