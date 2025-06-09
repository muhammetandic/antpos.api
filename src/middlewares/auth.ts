import { NextFunction, Response, Request } from "express";
import { verifyAccessToken } from "../services/jwt.service.js";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.slice(7);
  const cookie = req.cookies["token"];
  const accessToken = cookie ? cookie : token;
  try {
    const user = verifyAccessToken(accessToken);
    (req as AuthenticatedRequest).userId = user.sub as string;
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
}
