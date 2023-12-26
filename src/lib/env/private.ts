import { z } from "zod";

const privateEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  PUSHER_ID: z.string(),
  PUSHER_SECRET: z.string(),
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  PUSHER_ID: process.env.PUSHER_ID!,
  PUSHER_SECRET: process.env.PUSHER_SECRET!,
};

privateEnvSchema.parse(privateEnv);
