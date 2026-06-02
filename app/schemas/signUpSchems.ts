import z from "zod";

export const signUpSchema = z.object({
    username: z.string().min(3,'Username must be at least 3 characters').max(50,'Username must be less than 50 characters'),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
    password: z.string().min(6,'Password must be at least 6 characters').max(50,'Password must be less than 50 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
});