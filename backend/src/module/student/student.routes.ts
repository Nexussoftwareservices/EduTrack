import { Router } from "express";
import {
  getStudentProfile,
  updateStudentProfile,
  studentNotificatioin,
} from "./student.controllers";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.get(
  "/profile",
  authMiddleware,
  authorizeRoles("STUDENT"),
  getStudentProfile,
);

router.put(
  "/profile",
  authMiddleware,
  authorizeRoles("STUDENT"),
  updateStudentProfile,
);

router.get(
  "/notifications",
  authMiddleware,
  authorizeRoles("STUDENT"),
  studentNotificatioin,
);

export default router;

