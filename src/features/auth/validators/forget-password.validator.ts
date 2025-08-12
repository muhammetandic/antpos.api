import { z } from "zod";

export const forgetPasswordValidator = z
  .object({
    email: z.email().min(3).max(100),
  })
  .strict();
