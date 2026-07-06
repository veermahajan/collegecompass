import { z } from "zod";

// Zod on every API route input, per spec Sec 8.

export const contactMessageSchema = z.object({
  fromEmail: z.string().email().max(320),
  message: z.string().min(1).max(5000),
});
