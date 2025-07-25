import express, { Router, Response, Request } from "express";
import { forgetPasswordAsync, loginAsync, registerAsync } from "./services.js";
import { LoginRequest } from "./models/login.request.js";
import { validateData } from "../../middlewares/validation.js";
import { loginRequestValidator } from "./validators/login-request.validator.js";
import { RegisterRequest } from "./models/register.request.js";
import { registerRequestValidator } from "./validators/register-request.validator.js";
import { forgetPasswordValidator } from "./validators/forget-password.validator.js";
import { ForgetPasswordRequest } from "./models/forget-password.request.js";

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
