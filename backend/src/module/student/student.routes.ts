import { Router } from "express";
import {
  getStudentCourses,
  getStudentCourseById,
  getStudentCourseRecordings,
  getStudentCourseResources,
} from "./student.course.controller";

import {
  getStudentProfile,
  updateStudentProfile,
  studentNotificatioin,
} from "./student.controllers";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.use(authMiddleware, authorizeRoles("STUDENT"));

// Student Profile Routes

router.get("/profile", getStudentProfile);
router.put("/profile", updateStudentProfile);
router.get("/notifications", studentNotificatioin);

// Student Course Routes

router.get("/courses", getStudentCourses);
router.get("/courses/:id", getStudentCourseById);
router.get("/courses/:id/recordings", getStudentCourseRecordings);
router.get("/courses/:id/resources", getStudentCourseResources);

export default router;
