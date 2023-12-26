import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_PUSHER_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
};

publicEnvSchema.parse(publicEnv);
