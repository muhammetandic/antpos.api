import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../common/constants/http-status.js";
import { Result } from "../common/dtos/result.js";

export function validateData(
  schema: z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>,
  source: "body" | "query" | "params" = "body",
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.reduce((acc: Record<string, string[]>, issue: z.ZodIssue) => {
        const key = issue.path.join(".") || "_global";
        acc[key] = acc[key] ? [...acc[key], issue.message] : [issue.message];
        return acc;
      }, {});

      return res.status(HttpStatus.BadRequest).json(new Result().setErrors(errors));
    }

    next();
  };
}
