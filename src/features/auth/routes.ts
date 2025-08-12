import express, { Router, Response, Request } from "express";
import {
  confirmMailAsync,
  confirmResetPasswordAsync,
  forgetPasswordAsync,
  loginAsync,
  registerAsync,
  resetPasswordAsync,
} from "./services.js";
import { LoginRequest } from "./models/login.request.js";
import { validateData } from "../../middlewares/validation.js";
import { loginRequestValidator } from "./validators/login-request.validator.js";
import { RegisterRequest } from "./models/register.request.js";
import { registerRequestValidator } from "./validators/register-request.validator.js";
import { forgetPasswordValidator } from "./validators/forget-password.validator.js";
import { ForgetPasswordRequest } from "./models/forget-password.request.js";
import { confirmOtpValidator } from "./validators/confirm-otp.validator.js";
import { ConfirmOtpRequest } from "./models/confirm-otp.request.js";
import { ResetPasswordRequest } from "./models/reset-password.request.js";
import { resetPasswordValidator } from "./validators/reset-password.validator.js";

export const authRoutes: Router = express.Router();

authRoutes.post("/login", validateData(loginRequestValidator), async (req: Request<LoginRequest>, res: Response) => {
  const request = req.body;
  const result = await loginAsync(request);

  if (request.authType === "cookie") {
    res.status(result.status).cookie("token", result.data?.accessToken).json({ success: true });
  }

  res.status(result.status).json(result);
});

authRoutes.post(
  "/register",
  validateData(registerRequestValidator),
  async (req: Request<RegisterRequest>, res: Response) => {
    const request = req.body;
    const result = await registerAsync(request);

    res.status(result.status).json(result);
  },
);

authRoutes.post(
  "/forgetPassword",
  validateData(forgetPasswordValidator),
  async (req: Request<ForgetPasswordRequest>, res: Response) => {
    const request = req.body;
    const result = await forgetPasswordAsync(request);

    res.status(result.status).json(result);
  },
);

authRoutes.post(
  "/confirmMail",
  validateData(confirmOtpValidator),
  async (req: Request<ConfirmOtpRequest>, res: Response) => {
    const request = req.body;
    console.log(request);
    const result = await confirmMailAsync(request);

    res.status(result.status).json(result);
  },
);

// authRoutes.post(
//   "/confirmPhone",
//   validateData(confirmPhoneValidator),
//   async (req: Request<ConfirmPhoneRequest>, res: Response) => {
//     const request = req.body as ConfirmPhoneRequest;
//     const result = await confirmPhoneAsync(request);
//
//     res.status(result.status).json(result);
//   },
// );

authRoutes.post(
  "/confirmResetPassword",
  validateData(confirmOtpValidator),
  async (req: Request<ConfirmOtpRequest>, res: Response) => {
    const request = req.body;
    const result = await confirmResetPasswordAsync(request);

    res.status(result.status).json(result);
  },
);

authRoutes.post(
  "/resetPassword",
  validateData(resetPasswordValidator),
  async (req: Request<ResetPasswordRequest>, res: Response) => {
    const request = req.body;
    const result = await resetPasswordAsync(request);

    res.status(result.status).json(result);
  },
);
