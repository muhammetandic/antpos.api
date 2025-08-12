import { z } from "zod";

export const resetPasswordValidator = z.object({
  email: z.email().min(3).max(100),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/,
      "Password must include at least one uppercase letter, one number, and one punctuation mark.",
    ),
  controlCode: z.string().min(3).max(100),
});
