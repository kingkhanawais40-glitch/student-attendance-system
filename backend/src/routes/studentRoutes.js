import express from "express";

import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../controllers/studentController.js";

import {
    authenticateToken,
    authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// View students
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "teacher"),
    getStudents
);

// Add student — Admin only
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createStudent
);

// Update student — Admin only
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    updateStudent
);

// Delete student — Admin only
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteStudent
);

export default router;