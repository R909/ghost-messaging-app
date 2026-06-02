import z from "zod";

export const signInSchema = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    password: z.string().min(6,'Password must be at least 6 characters').max(50,'Password must be less than 50 characters'),
});