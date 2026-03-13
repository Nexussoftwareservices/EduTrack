import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { ApiResponse } from "./utils/apiResponse";

const app: Application = express();
app.use(helmet());

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/v1", routes);

app.get("/health", (_req: Request, res: Response) => {
  return ApiResponse(res, 200, true, "Server is healthy");
});

app.use((_req: Request, res: Response) => {
  return ApiResponse(res, 404, false, "Route not found");
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global Error:", err);

  return ApiResponse(
    res,
    err.statusCode || 500,
    false,
    err.message || "Internal Server Error",
  );
});

export default app;
