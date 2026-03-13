import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiResponse } from "../utils/apiResponse";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return ApiResponse(
        res,
        400,
        false,
        error.errors?.[0]?.message || "Invalid input",
      );
    }
  };
