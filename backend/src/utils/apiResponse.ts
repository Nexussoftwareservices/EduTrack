import { Response } from "express";

interface ApiResponseShape<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const ApiResponse = <T>(
  res: Response,
  statusCode: number = 200,
  success: boolean = true,
  message: string = "",
  data?: T,
) => {
  const response: ApiResponseShape<T> = {
    success,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};
