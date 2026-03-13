import { Router } from "express";
import authRouter from "./module/auth/auth.routes"

const router = Router();

// Authentication Module Router
router.use("/auth", authRouter);

export default router;
