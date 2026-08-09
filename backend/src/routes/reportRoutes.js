import express from "express";

import {
    getAttendanceReport,
} from "../controllers/reportController.js";

import {
    authenticateToken,
    authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Attendance reports
// Admin + Teacher
router.get(
    "/attendance",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    getAttendanceReport
);

export default router;