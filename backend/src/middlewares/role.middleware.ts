import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { ApiResponse } from "../utils/apiResponse";

export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return ApiResponse(res, 403, false, "Forbidden");
    }
    next();
  };
};
