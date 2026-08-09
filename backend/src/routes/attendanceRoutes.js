import express from "express";

import {
    getAttendance,
    saveAttendance,
    getAttendanceHistory,
    getTodayAttendanceSummary,
} from "../controllers/attendanceController.js";

import {
    authenticateToken,
    authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Attendance summary
// Admin + Teacher
router.get(
    "/summary",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    getTodayAttendanceSummary
);

// Attendance history
// Admin + Teacher
router.get(
    "/history",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    getAttendanceHistory
);

// Get attendance
// Admin + Teacher
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    getAttendance
);

// Save attendance
// Admin + Teacher
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    saveAttendance
);

export default router;