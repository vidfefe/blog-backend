import { z } from "zod";
import { passwordSchema } from "./shared/password.js";
export const registerSchema = z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
    avatarUrl: z.string().url("Avatar must be a valid URL").optional(),
});
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
});
