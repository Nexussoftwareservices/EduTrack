import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  forgotPasswordUser,
  resetPasswordUser,
} from "./auth.service";
import { ApiResponse } from "../../utils/apiResponse";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);
    return ApiResponse(res, 201, true, "User registered successfully", result);
  } catch (error: any) {
    return ApiResponse(res, 500, false, "Unable to Register Server Issue");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return ApiResponse(res, 200, true, "Login successful", result);
  } catch (error) {
    return ApiResponse(res, 500, false, "Unable to login User:: Server ERROR");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const result = await forgotPasswordUser(email);

    return ApiResponse(res, 200, true, result.message);
  } catch (error: any) {
    return ApiResponse(res, 400, false, error.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const result = await resetPasswordUser(token, newPassword);

    return ApiResponse(res, 200, true, result.message);
  } catch (error: any) {
    return ApiResponse(res, 400, false, error.message);
  }
};
