import z from "zod";

export const messageSchema = z.object({
    message: z.string().min(1,'Message must be at least 1 character').max(1000,'Message must be less than 1000 characters'),
});