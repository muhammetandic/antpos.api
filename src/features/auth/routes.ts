import express, { Router, Response, Request } from "express";
import { loginAsync, registerAsync } from "./services.js";
import { LoginRequest } from "./models/login-request.js";
import { validateData } from "../../middlewares/validation.js";
import { loginRequestValidator } from "./validators/login-request-validator.js";
import { RegisterRequest } from "./models/register-request.js";
import { registerRequestValidator } from "./validators/register-request-validator.js";

export const authRoutes: Router = express.Router();

authRoutes.post("/login", validateData(loginRequestValidator), async (req: Request<LoginRequest>, res: Response) => {
  const request = req.body;
  const result = await loginAsync(request);

  if (result.error) {
    res.status(result.status).json({ success: false, error: result.error });
  }

  if (request.authType === "cookie") {
    res.status(result.status).cookie("token", result.data?.accessToken).json({ success: true });
  }
  res.status(result.status).json({ success: true, data: result.data });
});

authRoutes.post(
  "/register",
  validateData(registerRequestValidator),
  async (req: Request<RegisterRequest>, res: Response) => {
    const request = req.body;
    const result = await registerAsync(request);

    if (result.error) {
      res.status(result.status).json({ success: false, error: result.error });
    }

    res.status(result.status).json({ success: true, data: result.data });
  },
);
