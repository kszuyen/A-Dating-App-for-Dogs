import { z } from "zod";

export const authSchema = z.object({
  // Sign in doesn't require a username, but sign up does.
  isSignUp: z.string(),
  username: z.string().optional(),
  email: z.string().email(),
  // Passwords must be at least 8 characters long.
  password: z.string().min(8),
});
