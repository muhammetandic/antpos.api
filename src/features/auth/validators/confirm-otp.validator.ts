import { z } from "zod";

export const confirmOtpValidator = z
  .object({
    email: z.email(),
    controlCode: z.string().min(3).max(100),
    otp: z.string().min(6).max(6),
  })
  .strict();
