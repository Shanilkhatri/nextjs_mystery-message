import { z } from "zod";

export const signInSchema = z
.object({
    identifier: z.string().email({ message: "Invalid email" }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(20, { message: "Password must be less than 20 characters" }),
});