import { z } from "zod";

export const loginRequestValidator = z
  .object({
    email: z.email().min(3).max(100),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/,
        "Password must include at least one uppercase letter, one number, and one punctuation mark.",
      ),
  })
  .strict();
