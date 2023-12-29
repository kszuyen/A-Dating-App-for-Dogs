import { z } from "zod";

export const messageSchema = z.object({
  senderId: z.string().min(1),
  receiverId: z.string().min(1),
  content: z.string().min(1),
});
