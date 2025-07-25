import { z } from "zod";

export const forgetPasswordValidator = z
  .object({
    email: z.string().email().min(3).max(100),
  })
  .strict();
