import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";
import { Role } from "@prisma/client";


export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse(res, 401, false, "Unauthorized");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse(res, 403, false, "Access denied");
    }

    next();
  };
};
