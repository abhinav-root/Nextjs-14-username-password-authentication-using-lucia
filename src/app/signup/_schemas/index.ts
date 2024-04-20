import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "First Name must be at least 3 characters"),
    lastName: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Last Name must be at least 3 characters"),
    email: z.string().trim().toLowerCase().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
  })
  .strict();

export type SignupSchema = z.infer<typeof signupSchema>;
