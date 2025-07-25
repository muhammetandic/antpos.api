import { UnknownKeysParam, ZodError, ZodIssue, ZodObject, ZodRawShape } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../common/constants/http-status.js";
import { Result } from "../common/dtos/result.js";

export function validateData(schema: ZodObject<ZodRawShape, UnknownKeysParam>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce((acc: Record<string, string[]>, issue: ZodIssue) => {
          const key = issue.path.join(".");

          if (!acc[key]) {
            acc[key] = [issue.message];
          } else {
            acc[key].push(issue.message);
          }
          return acc;
        }, {});

        res.status(HttpStatus.BadRequest).json(new Result().setErrors(errors));
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
